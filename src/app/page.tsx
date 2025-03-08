"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRef, useState } from "react";
import KuberSpline from "./components/KuberSpline";
import FeatureShowcase from "./components/ui/FeatureShowcase";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  const handleGithubConnect = async () => {
    const result = await signIn("github", { redirect: false });
    if (result?.error) {
      console.error("GitHub sign-in error:", result.error);
    } else {
      await update();
    }
  };

  const signInButton = useRef();

  function onLoad(spline: any) {
    const obj = spline.findObjectById("f62c804b-f73f-4b2f-88f9-31a013bd1b05");
    console.log(JSON.stringify(obj));
    signInButton.current = obj;
    setIsLoading(false);
  }

  function onSplineMouseDown(e: any) {
    if (e.target.name === "cta") {
      console.log("I have been clicked!");
    }
  }

  return (
    <div className="min-h-screen bg-[#A4FBAD]">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#A4FBAD] flex flex-col items-center justify-center">
          <div className="text-center space-y-6">
            <Loader2 className="h-16 w-16 animate-spin text-emerald-600 mx-auto" />
            <h2 className="text-2xl font-bold text-emerald-800">
              Loading Meow PaaS
            </h2>
            <p className="text-emerald-700">
              Preparing your purr-fect deployment experience...
            </p>
          </div>
        </div>
      )}

      {/* Hero Section with Full-screen SplineViewer */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <KuberSpline onSplineMouseDown={onSplineMouseDown} onLoad={onLoad} />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl h-full flex flex-col justify-end pb-52 pl-16">
            <div className="flex gap-4">
              {!session ? (
                <Button
                  onClick={() => signIn("google")}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Get Started Here
                </Button>
              ) : (
                <Button
                  onClick={handleGithubConnect}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {session.user.githubUsername
                    ? "Deploy Now"
                    : "Connect GitHub"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Meow PaaS?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/50 border-none shadow-lg">
            <CardHeader>
              <CardTitle>Easy Deployment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Deploy your applications with just a few clicks. No complex
                configurations needed.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 border-none shadow-lg">
            <CardHeader>
              <CardTitle>GitHub Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Connect your GitHub repositories and deploy directly from your
                workflow.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 border-none shadow-lg">
            <CardHeader>
              <CardTitle>Scalable Infrastructure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Built on modern cloud infrastructure for reliability and
                scalability.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <FeatureShowcase />

      {/* Auth Status Section */}
      {/* {session && (
        <div className="container mx-auto px-4 pb-20">
          <Card className="bg-white/50 border-none shadow-lg">
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>
                Welcome back, {session.user.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Username: {session.user.username}</p>
              {session.user.githubUsername && (
                <p>GitHub Connected: {session.user.githubUsername}</p>
              )}
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="w-full"
              >
                Sign out
              </Button>
            </CardContent>
          </Card>
        </div>
      )} */}
    </div>
  );
}
