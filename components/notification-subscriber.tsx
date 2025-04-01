"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  BellOff,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Share,
} from "lucide-react";
import {
  initializeFirebase,
  requestNotificationPermission,
  subscribeToTopic,
} from "@/lib/firebase";

export function NotificationSubscriber() {
  const [notificationStatus, setNotificationStatus] = useState<
    | "checking"
    | "supported"
    | "unsupported"
    | "blocked"
    | "ios-homescreen"
    | "ios-safari"
  >("checking");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is in standalone mode (installed to home screen)
    const checkStandalone = () => {
      const isInStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes("android-app://");
      setIsStandalone(isInStandalone);
      return isInStandalone;
    };

    // Check if iOS
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOSSafari = isIOS && isSafari;
    console.log(isIOSSafari);
    // Check notification support
    const checkNotificationSupport = async () => {
      // First check if iOS
      if (isIOS) {
        // Check if installed to home screen
        if (checkStandalone()) {
          // iOS 16.4+ supports push notifications for home screen apps
          setNotificationStatus("ios-homescreen");
        } else {
          // Not installed to home screen
          setNotificationStatus("ios-safari");
        }
        return false;
      }

      // For non-iOS devices, check standard notification support
      if (!("Notification" in window)) {
        setNotificationStatus("unsupported");
        return false;
      }

      if (!("serviceWorker" in navigator)) {
        setNotificationStatus("unsupported");
        return false;
      }

      if (!("PushManager" in window)) {
        setNotificationStatus("unsupported");
        return false;
      }

      if (Notification.permission === "denied") {
        setNotificationStatus("blocked");
        return false;
      }

      setNotificationStatus("supported");

      if (Notification.permission === "granted") {
        setIsSubscribed(true);
      }

      return true;
    };

    const initializeApp = async () => {
      const isSupported = await checkNotificationSupport();

      if (isSupported) {
        try {
          await initializeFirebase();
          setInitialized(true);
        } catch (err) {
          console.error("Firebase initialization error:", err);
          setError("Failed to initialize Firebase");
        }
      }
    };

    initializeApp();

    // Add event listener for permission changes
    const handlePermissionChange = () => {
      if (Notification.permission === "denied") {
        setNotificationStatus("blocked");
        setIsSubscribed(false);
      } else if (Notification.permission === "granted") {
        setNotificationStatus("supported");
        setIsSubscribed(true);
      }
    };

    // Check if the browser supports the permissionchange event
    if ("permissions" in navigator && "query" in navigator.permissions) {
      navigator.permissions
        .query({ name: "notifications" as PermissionName })
        .then((status) => {
          status.addEventListener("change", handlePermissionChange);
        })
        .catch((err) => console.error("Permission query error:", err));
    }

    return () => {
      // Clean up event listeners
      if ("permissions" in navigator && "query" in navigator.permissions) {
        navigator.permissions
          .query({ name: "notifications" as PermissionName })
          .then((status) => {
            status.removeEventListener("change", handlePermissionChange);
          })
          .catch((err) => console.error("Permission query error:", err));
      }
    };
  }, []);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const permission = await requestNotificationPermission();

      if (permission === "granted") {
        await subscribeToTopic("general");
        setIsSubscribed(true);
        setNotificationStatus("supported");
      } else if (permission === "denied") {
        setNotificationStatus("blocked");
        setError("Notification permission denied");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError("Failed to subscribe to notifications");
    } finally {
      setIsLoading(false);
    }
  };
  console.log(isStandalone);
  // Render based on notification status
  if (notificationStatus === "checking") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Checking notification support...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  if (notificationStatus === "ios-safari") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            iOS requires installation to home screen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <Share className="mb-2 h-8 w-8 text-blue-500" />
            <p className="mb-4 font-medium">
              Add to Home Screen to Enable Notifications
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                iOS 16.4 or later supports web push notifications, but only for
                apps installed to the home screen:
              </p>
              <ol className="text-left space-y-1 pl-5 list-decimal">
                <li>
                  Tap the share button <Share className="inline h-4 w-4" />
                </li>
                <li>Scroll down and tap Add to Home Screen</li>
                <li>Tap Add in the top right corner</li>
                <li>Open the app from your home screen</li>
                <li>Allow notifications when prompted</li>
              </ol>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground">
            Requires iOS 16.4 or later
          </p>
        </CardFooter>
      </Card>
    );
  }

  if (notificationStatus === "ios-homescreen" && !isSubscribed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Enable notifications for this app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <Bell className="mb-2 h-8 w-8 text-blue-500" />
            <p className="mb-4 font-medium">You can now enable notifications</p>
            <div className="text-sm text-muted-foreground">
              <p>
                Since youve installed this app to your home screen, you can now
                enable push notifications:
              </p>
              <ol className="text-left space-y-1 pl-5 list-decimal mt-2">
                <li>Tap the button below to request permission</li>
                <li>When prompted, tap Allow to enable notifications</li>
              </ol>
            </div>
            {error && (
              <div className="text-red-500 mt-4 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                {error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              <span className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Enable Notifications
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (notificationStatus === "unsupported") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Receive updates and important notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
            <AlertCircle className="mb-2 h-8 w-8 text-amber-500" />
            <p className="mb-2 font-medium">
              Push notifications are not supported in this browser.
            </p>
            <p className="text-sm">
              Try using a modern browser like Chrome, Edge, Firefox, or Safari
              on a desktop or Android device.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <a
            href="https://caniuse.com/push-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Check browser compatibility
          </a>
        </CardFooter>
      </Card>
    );
  }

  if (notificationStatus === "blocked") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Notifications are currently blocked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <BellOff className="mb-2 h-8 w-8 text-red-500" />
            <p className="mb-4 font-medium">
              Notifications are blocked for this site
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                To enable notifications, you need to change your browser
                settings:
              </p>
              <ol className="text-left space-y-1 pl-5 list-decimal">
                <li>Click the lock/info icon in your address bar</li>
                <li>Find Notifications or Site Settings</li>
                <li>Change the setting from Block to Allow</li>
                <li>Reload this page</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
        <CardDescription>
          Receive updates and important notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubscribed ? (
          <div className="flex items-center justify-center p-4 text-center text-green-600 dark:text-green-400">
            <CheckCircle className="mr-2 h-5 w-5" />
            <p>You are subscribed to push notifications!</p>
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="mb-4">
              Get notified about important updates and announcements.
            </p>
            {error && (
              <div className="text-red-500 mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                {error}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {!isSubscribed && (
          <Button
            onClick={handleSubscribe}
            disabled={isLoading || !initialized}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              <span className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Subscribe to Notifications
              </span>
            )}
          </Button>
        )}
        {isSubscribed && (
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              Youll receive notifications when important updates are available
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
