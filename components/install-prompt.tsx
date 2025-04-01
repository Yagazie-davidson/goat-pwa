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
import { Download, Share } from "lucide-react";

export function InstallPrompt() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if app is already installed
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Check if iOS
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", () => {});
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
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
          <div className="text-center p-4 text-muted-foreground">
            <p>
              This app can be installed, but your browser does not support the
              install prompt.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {isInstallable && !isIOS && (
          <Button onClick={handleInstall} className="w-full">
            <Download className="mr-2 h-5 w-5" />
            Install App
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
