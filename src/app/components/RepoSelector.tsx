import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

type CPUResource =
  | "100m"
  | "250m"
  | "500m"
  | "1"
  | "2"
  | "4"
  | "8"
  | "12"
  | "16"
  | "20"
  | "24";

type MemoryResource =
  | "256Mi"
  | "512Mi"
  | "1Gi"
  | "2Gi"
  | "4Gi"
  | "8Gi"
  | "16Gi"
  | "32Gi"
  | "48Gi"
  | "64Gi";

export type Repository = {
  id: number;
  name: string;
  full_name: string;
};

export function RepoSelector({ fetchApplications }: { fetchApplications: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  const [containerPort, setContainerPort] = useState<number>(3000);
  const [replicas, setReplicas] = useState<number>(1);
  const [cpuAllocation, setCpuAllocation] = useState<CPUResource>("500m");
  const [memoryAllocation, setMemoryAllocation] = useState<MemoryResource>("512Mi");

  const [isDeploying, setIsDeploying] = useState(false);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (session?.accessToken) {
      fetchRepos();
    }
  }, [session]);

  const fetchRepos = async () => {
    try {
      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch repositories');
      const data = await response.json();
      setRepos(data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch repositories.",
        variant: "destructive",
      });
    }
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
        containerPort: containerPort,
        replicas: replicas,
        cpuAllocation: cpuAllocation,
        memoryAllocation: memoryAllocation,
      };

      const apiUrl = "http://localhost:3005/build-and-push-deploy";

      const response = await fetch(apiUrl, {
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

      // Navigate to the application's page using application_id
      const applicationId = data.application_id;
      router.push(`/applications/${applicationId}/`);

    } catch (error: any) {
      console.error("Error during build and push:", error);
      toast({
        title: "Deployment Error",
        description: error.message || "An error occurred during deployment.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
      fetchApplications();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Deploy New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Deploy a New Application</CardTitle>
          </CardHeader>
          <CardContent>
            {session?.accessToken ? (
              <>
                <div className="mb-4">
                  <Label htmlFor="repository">Select Repository</Label>
                  <Select
                    onValueChange={(value) => {
                      const repo = repos.find((r) => r.full_name === value);
                      if (repo) {
                        setSelectedRepo(repo);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a repository" />
                    </SelectTrigger>
                    <SelectContent>
                      {repos.map((repo) => (
                        <SelectItem key={repo.id} value={repo.full_name}>
                          {repo.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRepo && (
                  <>
                    <div className="mb-4">
                      <Label htmlFor="containerPort">Container Port</Label>
                      <Input
                        id="containerPort"
                        type="number"
                        value={containerPort}
                        onChange={(e) => setContainerPort(parseInt(e.target.value))}
                      />
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="replicas">Replicas</Label>
                      <Input
                        id="replicas"
                        type="number"
                        value={replicas}
                        onChange={(e) => setReplicas(parseInt(e.target.value))}
                      />
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="cpuAllocation">CPU Allocation</Label>
                      <Select
                        onValueChange={(value: CPUResource) => setCpuAllocation(value)}
                        value={cpuAllocation}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select CPU Allocation" />
                        </SelectTrigger>
                        <SelectContent>
                          {["100m", "250m", "500m", "1", "2", "4", "8", "12", "16", "20", "24"].map((cpu) => (
                            <SelectItem key={cpu} value={cpu}>
                              {cpu}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="memoryAllocation">Memory Allocation</Label>
                      <Select
                        onValueChange={(value: MemoryResource) => setMemoryAllocation(value)}
                        value={memoryAllocation}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Memory Allocation" />
                        </SelectTrigger>
                        <SelectContent>
                          {["256Mi", "512Mi", "1Gi", "2Gi", "4Gi", "8Gi", "16Gi", "32Gi", "48Gi", "64Gi"].map((mem) => (
                            <SelectItem key={mem} value={mem}>
                              {mem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleDeploy}
                      disabled={isDeploying}
                      className="w-full mt-4"
                    >
                      {isDeploying ? "Deploying..." : "Deploy Application"}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <p>Please sign in to select a repository.</p>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}