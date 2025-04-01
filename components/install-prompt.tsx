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
import { Download, Share, Info } from "lucide-react";

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [installStatus, setInstallStatus] = useState<string | null>(null);

  useEffect(() => {
    // Check if app is already installed
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes("android-app://");
      setIsStandalone(isStandalone);
      return isStandalone;
    };

    // Check if iOS
    const checkIOS = () => {
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as any).MSStream;
      setIsIOS(isIOS);
      return isIOS;
    };

    const isInStandalone = checkStandalone();
    const isOnIOS = checkIOS();

    if (!isInStandalone) {
      // Listen for the beforeinstallprompt event
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        setInstallPrompt(e);
        setIsInstallable(true);
      });

      // Check if PWA is installable
      if ("serviceWorker" in navigator && "PushManager" in window) {
        navigator.serviceWorker.ready
          .then(() => {
            setIsInstallable(true);
          })
          .catch((err) => {
            console.error("Service worker registration failed:", err);
            setInstallStatus(
              "Service worker registration failed. PWA features may not work properly."
            );
          });
      }
    }

    // Listen for app installed event
    window.addEventListener("appinstalled", () => {
      setInstallStatus("App was successfully installed!");
      setIsInstallable(false);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", () => {});
      window.removeEventListener("appinstalled", () => {});
    };
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      // Show the install prompt
      installPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await installPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);

      if (outcome === "accepted") {
        setInstallStatus("Installation started!");
      } else {
        setInstallStatus("Installation declined.");
      }

      // We've used the prompt, and can't use it again, throw it away
      setInstallPrompt(null);
    }
  };

  // Don't show anything if already installed
  if (isStandalone) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Install App</CardTitle>
        <CardDescription>
          Add this app to your home screen for quick access
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isIOS ? (
          <div className="text-center p-4">
            <p className="mb-4">To install this app on your iOS device:</p>
            <ol className="text-left space-y-2 mb-4">
              <li className="flex items-center">
                <span className="mr-2">1.</span>
                <span>
                  Tap the share button <Share className="inline h-4 w-4" />
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">2.</span>
                <span>Scroll down and tap Add to Home Screen</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">3.</span>
                <span>Tap Add in the top right corner</span>
              </li>
            </ol>
          </div>
        ) : isInstallable ? (
          <div className="text-center p-4">
            <p>
              Install this application on your device to access it offline and
              get a better experience.
            </p>
          </div>
        ) : (
          <div className="text-center p-4">
            <div className="flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
              <Info className="h-5 w-5 mr-2" />
              <p className="font-medium">Installation Status</p>
            </div>
            <p className="text-muted-foreground">
              {installStatus ||
                "This app can be installed, but your browser doesn't support the automatic install prompt. Try using Chrome or Edge."}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {isInstallable && !isIOS && installPrompt && (
          <Button onClick={handleInstall} className="w-full">
            <Download className="mr-2 h-5 w-5" />
            Install App
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
