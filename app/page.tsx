import { NotificationSubscriber } from "@/components/notification-subscriber";
import { InstallPrompt } from "@/components/install-prompt";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Next.js PWA with Firebase
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            A Progressive Web App with push notifications
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <NotificationSubscriber />
          <InstallPrompt />
        </div>
      </div>
    </main>
  );
}
