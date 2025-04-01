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
import { Bell, BellOff, CheckCircle, AlertCircle } from "lucide-react";
import {
  initializeFirebase,
  requestNotificationPermission,
  subscribeToTopic,
} from "@/lib/firebase";

export function NotificationSubscriber() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Check if service workers and push messaging are supported
    const checkSupport = async () => {
      const supported = "serviceWorker" in navigator && "PushManager" in window;
      setIsSupported(supported);

      if (supported) {
        try {
          await initializeFirebase();
          setInitialized(true);

          // Check if already subscribed
          const permission = Notification.permission;
          setIsSubscribed(permission === "granted");
        } catch (err) {
          console.error("Firebase initialization error:", err);
          setError("Failed to initialize Firebase");
        }
      }
    };

    checkSupport();
  }, []);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const permission = await requestNotificationPermission();

      if (permission === "granted") {
        await subscribeToTopic("general");
        setIsSubscribed(true);
      } else {
        setError("Notification permission denied");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError("Failed to subscribe to notifications");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Receive updates and important notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4 text-center text-muted-foreground">
            <AlertCircle className="mr-2 h-5 w-5" />
            <p>Push notifications are not supported in this browser.</p>
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
            <BellOff className="mx-auto h-5 w-5 mb-2" />
            <p className="text-sm">
              To unsubscribe, change notification settings in your browser
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
