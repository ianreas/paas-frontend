"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Application } from "../page";
import LogViewer from "./components/LogViewer";

export default function ApplicationDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [application, setApplication] = useState<Application | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/get-single-application?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch application details.");
        }
        const data = await response.json();
        setApplication(data.application);
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

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/delete-application?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete application.");
      }
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
          <p>
            <strong>Container Port:</strong> {application.container_port}
          </p>
          <p>
            <strong>Replicas:</strong> {application.replicas}
          </p>
          <p>
            <strong>CPU Allocation:</strong> {application.requested_cpu}
          </p>
          <p>
            <strong>Memory Allocation:</strong> {application.requested_memory}
          </p>
          {/* Add more application details as needed */}
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="mt-4"
          >
            {isDeleting ? "Deleting..." : "Delete Application"}
          </Button>
        </CardContent>
      </Card>
      {/* Include the LogViewer component, passing the appName */}
      <LogViewer appName={application.project_name} />
    </div>
  );
}
