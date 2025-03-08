import React, { useState } from "react";
import { CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/app/components/ui/CustomCards";
import { useSession } from "next-auth/react";

interface CICDViewerProps {
  appName: string;
}

const createWorkflow = async (
  sessionToken: string,
  githubUsername: string | undefined,
  repoName: string | undefined
) => {
  console.log(`sessionToken: ${sessionToken}`);
  console.log(`githubUsername: ${githubUsername}`);
  console.log(`repoName: ${repoName}`);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/create-workflow`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repoOwner: githubUsername,
        repoName: repoName,
        accessToken: sessionToken,
        baseBranch: "main",
      }),
    }
  );

  console.log(`response: ${JSON.stringify(response)}`);

  const data = await response.json();
  return data;
};

export default function CICDViewer({ appName }: CICDViewerProps) {
  const { data: session } = useSession();
  const [repo, setRepo] = useState("");

  const handleTriggerWorkflow = async () => {
    // if (!repo) {
    //   alert("Please enter a repository in the format owner/repo");
    //   return;
    // }
    if (!session) {
      alert("You need to be signed in to trigger the workflow.");
      return;
    }

    const sessionToken = session.accessToken as string;
    if (!sessionToken) {
      alert(
        "GitHub access token not found. Please connect your GitHub account."
      );
      return;
    }

    try {
      const result = await createWorkflow(
        sessionToken,
        session.user.githubUsername,
        appName
      );
      console.log("Workflow triggered:", result);
      // You can display a success message or update the UI here
    } catch (error) {
      console.error("Error triggering workflow:", error);
      alert("Failed to trigger the workflow. Please try again.");
    }
  };

  return (
    <GlassCard>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            <span className="text-lg font-semibold">
              Trigger CI/CD Workflow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              {appName}
            </Badge>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <Button onClick={handleTriggerWorkflow}>Trigger Workflow</Button>
        </div>
      </CardHeader>
    </GlassCard>
  );
}
