"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#A4FBAD] flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-500">
            {error === "AccessDenied"
              ? "Access was denied. Please ensure you're using the correct account and try again."
              : "An error occurred during authentication."}
          </p>
          <Button
            onClick={() => router.push("/auth/signin")}
            className="w-full"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 