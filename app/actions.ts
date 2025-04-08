"use server";
import { User } from "@/components/user-tag-input";
import { createClient } from "@/lib/supabase/server";
import { encodedRedirect } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { ParamValue } from "next/dist/server/request/params";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const house_id = formData.get("houseId")?.toString();
  const username = formData.get("username")?.toString();

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/auth/signin",
      "Email and password are required"
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/signin`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/auth/signup", error.message);
  } else {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([
        {
          auth_id: data.user?.id,
          username: username,
          email: data.user?.email,
          house_id: house_id,
        },
      ]);

    if (userError) {
      console.error("Error inserting user data:", userError.message);
    } else {
      console.log("User profile created:", userData);
    }
    redirect("/auth/signin");
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/auth/signin", error.message);
  }

  return redirect(`/${data.user.id}`);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/auth/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/auth/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const fetchHousematesWithId = async (houseId: string) => {
  console.log(`house ${houseId}`);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("house_id", houseId);

  if (error) {
    console.error(error);
    return [];
  }
  console.log("shiht");
  console.log(data);
  return data;
};

export const createNewBill = async (prevState: any, formData: FormData) => {
  try {
    const supabase = await createClient();
    const bill_name = formData.get("bill_name")?.toString();
    const total_amount = formData.get("total_amount");
    const issuer_id = formData.get("issuer_id");
    // @ts-ignore
    const tagged = JSON.parse(formData.get("tagged"));
    console.log({
      bill_name,
      total_amount,
      issuer_id,
      tagged,
    });

    if (
      bill_name != "" &&
      total_amount != null &&
      issuer_id != "" &&
      tagged.length > 0
    ) {
      const { data: billsData, error: billsError } = await supabase
        .from("bills")
        .insert([
          {
            bill_name,
            total_amount: total_amount,
            issuer_id,
          },
        ])
        .select("id")
        .single();
      if (billsError) {
        return { success: false, message: billsError.message };
      }
      const tags = tagged.map((tag: User) => ({
        bill_id: billsData.id,
        bill_name: bill_name,
        housemate_id: tag.auth_id,
        issuer_id: issuer_id,
        // @ts-ignore
        amount: total_amount / (tagged.length + 1),
      }));
      const { error: taggedError } = await supabase.from("tags").insert(tags);
      if (taggedError) {
        return { success: false, message: taggedError.message };
      }
      for (const { auth_id } of tagged) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("auth_id", auth_id.toString());
        // @ts-ignore
        const currentOwe = userData[0]?.amount_owe;
        // @ts-ignore
        const newOwe = currentOwe + total_amount / (tagged.length + 1);
        const { error: updateError } = await supabase
          .from("users")
          .update({ amount_owe: newOwe })
          .eq("auth_id", auth_id);
        if (updateError) {
          return { success: false, message: updateError.message };
        }
      }
      return { success: true, message: "Bill created successfully!" };
    } else {
      return { success: false, message: "Please confirm your inputs" };
    }
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const fetchIssuerInfo = async (issuerId: string) => {
  try {
    const supabase = await createClient();
    const { data: issuerData, error: issuerError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", issuerId.toString());
    if (issuerError) {
      return { success: false, message: issuerError.message };
    }
    return issuerData;
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const updateBillForVerification = async (
  tagId: string,
  housemate_id: string
) => {
  try {
    const supabase = await createClient();

    const { error: updateError } = await supabase
      .from("tags")
      .update({ status: "verifying" })
      .eq("id", tagId);
    if (updateError) {
      return { success: false, message: updateError.message };
    }
    revalidatePath(`/${housemate_id}`);
    return { success: true, message: "Waiting for verification" };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const verifyBillPaid = async (
  tagId: string,
  housemate_id: string,
  issuer_id: string
) => {
  try {
    const supabase = await createClient();
    const { data: tagsData } = await supabase
      .from("tags")
      .select("*")
      .eq("id", tagId);

    const { error: updateError } = await supabase
      .from("tags")
      .update({ status: "paid" })
      .eq("id", tagId);
    if (updateError) {
      return { success: false, message: updateError.message };
    }
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", housemate_id);
    if (userError) {
      return { success: false, message: userError.message };
    }
    if (tagsData) {
      const { error: updateUserError } = await supabase
        .from("users")
        .update({ amount_owe: userData[0].amount_owe - tagsData[0].amount })
        .eq("auth_id", housemate_id);
      if (updateUserError) {
        return { success: false, message: updateUserError.message };
      }
    }
    revalidatePath(`/${issuer_id}/notifications`);
    return { success: true, message: "Good" };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const updateAccountInfo = async (prevState: any, formData: FormData) => {
  try {
    const supabase = await createClient();
    const bank_name = formData.get("bank_name")?.toString();
    const account_number = formData.get("account_number");
    const user_id = formData.get("user_id");
    const account_name = formData.get("account_name")?.toString();

    console.log({
      bank_name,
      account_number,
      account_name,
      user_id,
    });

    if (
      bank_name != "" &&
      account_number != null &&
      account_name != "" &&
      account_name != ""
    ) {
      const { data: userAccount, error: userAccountError } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", user_id);
      if (userAccount) {
        if (userAccount?.length > 0) {
          const { error: accountError } = await supabase
            .from("accounts")
            .update([
              {
                bank_name,
                account_number,
                account_name,
                user_id,
              },
            ])
            .eq("user_id", user_id);
          if (accountError) {
            return { success: false, message: accountError.message };
          }
          return { success: true, message: "Account updated successfully!" };
        } else {
          const { error: accountError } = await supabase
            .from("accounts")
            .insert([
              {
                bank_name,
                account_number,
                account_name,
                user_id,
              },
            ]);
          if (accountError) {
            return { success: false, message: accountError.message };
          }
          return { success: true, message: "Account updated successfully!" };
        }
      } else {
        return { success: false, message: userAccountError.message };
      }
    } else {
      return { success: false, message: "Please confirm your inputs" };
    }
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};
