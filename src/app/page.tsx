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
import { getGithubAccount } from "@/lib/db";

type GithubInfo = {
  connected: boolean;
  username: string | undefined;
} | null;

const BACKEND_URL = "http://localhost:3005";

export default function Home() {
  const { data: session, update } = useSession();
  const [githubInfo, setGithubInfo] = useState<GithubInfo>(null);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  useEffect(() => {
    async function fetchGithubInfo() {
      if (session?.user?.id) {
        try {
          const githubAccount = await getGithubAccount(session.user.id);
          if (githubAccount) {
            setGithubInfo({
              connected: true,
              username: githubAccount.github_username,
            });
          } else {
            setGithubInfo(null);
          }
        } catch (error) {
          console.error("Error fetching GitHub info:", error);
          setGithubInfo(null);
        }
      }
    }
    fetchGithubInfo();
  }, [session]);

  const handleGithubConnect = async () => {
    const result = await signIn("github", { redirect: false });
    if (result?.error) {
      console.error("GitHub sign-in error:", result.error);
    } else {
      await update(); // Force session update
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
              {githubInfo ? (
                <p className="mb-4">GitHub connected: {githubInfo.username}</p>
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

      {githubInfo && <RepoSelector onSelectRepo={handleSelectRepo} />}
      
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