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
import { useEffect, useState } from "react";
import { RepoSelector, Repository } from "./components/RepoSelector";

export default function Home() {
  const { data: session, update } = useSession();
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  const handleGithubConnect = async () => {
    const result = await signIn("github", { redirect: false });
    if (result?.error) {
      console.error("GitHub sign-in error:", result.error);
    } else {
      await update();
    }
  };

  const handleSelectRepo = (repo: Repository) => {
    setSelectedRepo(repo);
    console.log("Selected repository for deployment:", repo.full_name);
    // Here you would typically call your backend API to initiate the deployment
  };

  return (
    <div className="container mx-auto mt-10">
      <Card className="w-[350px] mx-auto">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Manage your account</CardDescription>
        </CardHeader>
        <CardContent>
          {session ? (
            <>
              <p className="mb-4">Signed in as {session.user.email}</p>
              <p className="mb-4">Username: {session.user.username}</p>
              {session.user.githubUsername ? (
                <p className="mb-4">GitHub connected: {session.user.githubUsername}</p>
              ) : (
                <Button onClick={handleGithubConnect} className="w-full mb-2">
                  Connect GitHub
                </Button>
              )}
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="w-full"
              >
                Sign out
              </Button>
            </>
          ) : (
            <Button onClick={() => signIn("google")} className="w-full">
              Sign in with Google
            </Button>
          )}
        </CardContent>
      </Card>

      {session?.user.githubUsername && <RepoSelector onSelectRepo={handleSelectRepo} />}
      
      {selectedRepo && (
        <Card className="w-[350px] mx-auto mt-4">
          <CardHeader>
            <CardTitle>Selected Repository</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ready to deploy: {selectedRepo.full_name}</p>
          </CardContent>
        </Card>
      )}

      {session && (
        <Card className="w-[350px] mx-auto mt-4">
          <CardHeader>
            <CardTitle>Session Info</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-60">
              {JSON.stringify(session, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}