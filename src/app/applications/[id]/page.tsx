"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Application } from "../page";
import LogViewer from "./components/LogViewer";
import CronJobs from "./components/CronJobs";

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

export default function ApplicationDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  const [application, setApplication] = useState<Application | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State variables for edit mode and edited values
  const [isEditing, setIsEditing] = useState({
    containerPort: false,
    replicas: false,
    cpuAllocation: false,
    memoryAllocation: false,
  });

  const [editedValues, setEditedValues] = useState({
    containerPort: 0,
    replicas: 0,
    cpuAllocation: "",
    memoryAllocation: "",
  });

  // Flags to check if any field has been modified
  const [isModified, setIsModified] = useState(false);
  const [isModifyingDeployment, setIsModifyingDeployment] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/get-single-application?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch application details.");
        }
        const data = await response.json();
        setApplication(data.application);

        // Initialize edited values with current application values
        setEditedValues({
          containerPort: data.application.container_port,
          replicas: data.application.replicas,
          cpuAllocation: data.application.requested_cpu,
          memoryAllocation: data.application.requested_memory,
        });
      } catch (error: any) {
        console.error("Error fetching application:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch application details.",
          variant: "destructive",
        });
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id, toast]);

  const handleEditToggle = (field: string) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field as keyof typeof prevState],
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedValues((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    // Check if any field has been modified
    if (application) {
      const isModified =
        editedValues.containerPort !== application.container_port ||
        editedValues.replicas !== application.replicas ||
        editedValues.cpuAllocation !== application.requested_cpu ||
        editedValues.memoryAllocation !== application.requested_memory;
      setIsModified(isModified);
    }
  };

  const handleModifyDeployment = async () => {
    if (
      !application ||
      !session?.user.id ||
      !session.accessToken ||
      !session.user.githubUsername
    ) {
      console.error("Missing required data for deployment modification.");
      toast({
        title: "Error",
        description: "Missing required data for deployment modification.",
        variant: "destructive",
      });
      return;
    }

    setIsModifyingDeployment(true);
    try {
      const requestData = {
        repoFullName: application.github_repo_name,
        accessToken: session.accessToken,
        userId: session.user.id.toString(),
        githubUsername: session.user.githubUsername,
        containerPort: editedValues.containerPort,
        replicas: editedValues.replicas,
        cpuAllocation: editedValues.cpuAllocation,
        memoryAllocation: editedValues.memoryAllocation,
      };

      console.log("Request Data:", requestData);

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
        throw new Error(errorData.message || "Failed to modify deployment.");
      }

      const data = await response.json();
      console.log("Deployment modification initiated:", data);

      toast({
        title: "Deployment Modification Started",
        description: "Your application is being redeployed with the new configuration.",
      });

      // Refresh the application details without navigating away
      router.refresh();
    } catch (error: any) {
      console.error("Error during deployment modification:", error);
      toast({
        title: "Deployment Error",
        description: error.message || "An error occurred during deployment modification.",
        variant: "destructive",
      });
    } finally {
      setIsModifyingDeployment(false);
      setIsModified(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
    //   const response = await fetch(`/api/delete-application?id=${id}`, {
    //     method: "DELETE",
    //   });
    //   if (!response.ok) {
    //     throw new Error("Failed to delete application.");
    //   }
      toast({
        title: "Application Deleted",
        description: "The application has been deleted successfully.",
      });
      router.push("/applications");
    } catch (error: any) {
      console.error("Error deleting application:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete application.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const cpuOptions: CPUResource[] = [
    "100m",
    "250m",
    "500m",
    "1",
    "2",
    "4",
    "8",
    "12",
    "16",
    "20",
    "24",
  ];
  const memoryOptions: MemoryResource[] = [
    "256Mi",
    "512Mi",
    "1Gi",
    "2Gi",
    "4Gi",
    "8Gi",
    "16Gi",
    "32Gi",
    "48Gi",
    "64Gi",
  ];

  if (!application) {
    return <p>Loading application details...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>{application.project_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Repository:</strong> {application.github_repo_name}
          </p>
          <p>
            <strong>Deployed By:</strong> {application.github_username}
          </p>
          <p>
            <strong>User ID:</strong> {application.user_id}
          </p>

          {/* Container Port */}
          <div className="mb-4 flex items-center">
            <Label htmlFor="containerPort" className="mr-2 min-w-[150px]">
              Container Port
            </Label>
            {isEditing.containerPort ? (
              <Input
                id="containerPort"
                type="number"
                value={editedValues.containerPort}
                onChange={(e) =>
                  handleInputChange("containerPort", parseInt(e.target.value))
                }
                className="mr-2"
              />
            ) : (
              <span className="mr-2">{application.container_port}</span>
            )}
            <Button
              variant="link"
              onClick={() => handleEditToggle("containerPort")}
            >
              {isEditing.containerPort ? "Cancel" : "Edit"}
            </Button>
          </div>

          {/* Replicas */}
          <div className="mb-4 flex items-center">
            <Label htmlFor="replicas" className="mr-2 min-w-[150px]">
              Replicas
            </Label>
            {isEditing.replicas ? (
              <Input
                id="replicas"
                type="number"
                value={editedValues.replicas}
                onChange={(e) =>
                  handleInputChange("replicas", parseInt(e.target.value))
                }
                className="mr-2"
              />
            ) : (
              <span className="mr-2">{application.replicas}</span>
            )}
            <Button
              variant="link"
              onClick={() => handleEditToggle("replicas")}
            >
              {isEditing.replicas ? "Cancel" : "Edit"}
            </Button>
          </div>

          {/* CPU Allocation */}
          <div className="mb-4 flex items-center">
            <Label htmlFor="cpuAllocation" className="mr-2 min-w-[150px]">
              CPU Allocation
            </Label>
            {isEditing.cpuAllocation ? (
              <Select
                onValueChange={(value) =>
                  handleInputChange("cpuAllocation", value)
                }
                value={editedValues.cpuAllocation}
              >
                <SelectTrigger className="w-full mr-2">
                  <SelectValue placeholder="Select CPU Allocation" />
                </SelectTrigger>
                <SelectContent>
                  {cpuOptions.map((cpu) => (
                    <SelectItem key={cpu} value={cpu}>
                      {cpu}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="mr-2">{application.requested_cpu}</span>
            )}
            <Button
              variant="link"
              onClick={() => handleEditToggle("cpuAllocation")}
            >
              {isEditing.cpuAllocation ? "Cancel" : "Edit"}
            </Button>
          </div>

          {/* Memory Allocation */}
          <div className="mb-4 flex items-center">
            <Label htmlFor="memoryAllocation" className="mr-2 min-w-[150px]">
              Memory Allocation
            </Label>
            {isEditing.memoryAllocation ? (
              <Select
                onValueChange={(value) =>
                  handleInputChange("memoryAllocation", value)
                }
                value={editedValues.memoryAllocation}
              >
                <SelectTrigger className="w-full mr-2">
                  <SelectValue placeholder="Select Memory Allocation" />
                </SelectTrigger>
                <SelectContent>
                  {memoryOptions.map((mem) => (
                    <SelectItem key={mem} value={mem}>
                      {mem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="mr-2">{application.requested_memory}</span>
            )}
            <Button
              variant="link"
              onClick={() => handleEditToggle("memoryAllocation")}
            >
              {isEditing.memoryAllocation ? "Cancel" : "Edit"}
            </Button>
          </div>

          {isModified && (
            <Button
              onClick={handleModifyDeployment}
              disabled={isModifyingDeployment}
              className="w-full mt-4"
            >
              {isModifyingDeployment
                ? "Modifying Deployment..."
                : "Modify Deployment"}
            </Button>
          )}

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full mt-4"
          >
            {isDeleting ? "Deleting..." : "Delete Application"}
          </Button>
        </CardContent>
      </Card>

      {/* Include the LogViewer component, passing the appName */}
      <LogViewer appName={application.project_name} />
      <CronJobs applicationId={application.id} />
    </div>
  );
}