"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { RepoSelector, Repository } from "../components/RepoSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "../../hooks/use-toast";

interface Application {
  id: number;
  github_repo_name: string;
  github_username: string;
  user_id: string;
  project_name: string;
}

export default function Applications() {
  const { data: session } = useSession();
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();

  const [applications, setApplications] = useState<Application[]>([]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/get-user-applications');
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      setApplications(data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch applications.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSelectRepo = (repo: Repository) => {
    setSelectedRepo(repo);
  };

  const handleDeploy = async () => {
    if (
      !selectedRepo ||
      !session?.user.id ||
      !session.accessToken ||
      !session.user.githubUsername
    ) {
      console.error("Missing required data for deployment.");
      toast({
        title: "Error",
        description: "Missing required data for deployment.",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    try {
      const requestData = {
        repoFullName: selectedRepo.full_name,
        accessToken: session.accessToken,
        userId: session.user.id.toString(),
        githubUsername: session.user.githubUsername,
      };

      const goEndpointUrl = "http://localhost:3005/build-and-push-deploy";

      const response = await fetch(goEndpointUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to initiate deployment.");
      }

      const data = await response.json();
      console.log("Build and push initiated:", data);

      toast({
        title: "Deployment Started",
        description: "Your application is being deployed.",
      });

      // Refresh the list of applications after deployment
      fetchApplications();

    } catch (error: any) {
      console.error("Error during build and push:", error);
      toast({
        title: "Deployment Error",
        description: error.message || "An error occurred during deployment.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div>
      {applications.length > 0 && (
        <div className="my-4">
          <h2 className="text-xl font-bold mb-4">Your Applications</h2>
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <CardTitle>{app.project_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Repository:</strong> {app.github_repo_name}</p>
                  <p><strong>Deployed By:</strong> {app.github_username}</p>
                  {/* Add more details as needed */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {session?.user.githubUsername && (
        <RepoSelector onSelectRepo={handleSelectRepo} />
      )}

      {selectedRepo && (
        <Card className="w-[350px] mx-auto mt-4">
          <CardHeader>
            <CardTitle>Selected Repository</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ready to deploy: {selectedRepo.full_name}</p>
            <Button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="mt-4"
            >
              {isDeploying ? "Deploying..." : "Deploy Application"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}