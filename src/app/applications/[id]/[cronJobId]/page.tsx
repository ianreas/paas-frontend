"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CronJob {
  id: number;
  application_id: number;
  name: string;
  cron_expression: string;
  replicas: number;
  requested_memory: string;
  requested_cpu: string;
}

export default function CronJobDetails() {
  const { id: applicationId, cronJobId } = useParams();
  const { toast } = useToast();

  const [cronJob, setCronJob] = useState<CronJob | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<CronJob | null>(null);
  const [isModified, setIsModified] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchCronJob = async () => {
      try {
        const response = await fetch(
          `/api/cron-jobs/${cronJobId}?application_id=${applicationId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cron job details.");
        }
        const data = await response.json();
        setCronJob(data.cronJob);
        setEditedValues(data.cronJob);
      } catch (error: any) {
        console.error("Error fetching cron job:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch cron job details.",
          variant: "destructive",
        });
      }
    };

    if (applicationId && cronJobId) {
      fetchCronJob();
    }
  }, [applicationId, cronJobId, toast]);

  const handleInputChange = (
    field: keyof CronJob,
    value: string | number
  ) => {
    if (editedValues) {
      setEditedValues((prevState) => prevState && { ...prevState, [field]: value });
      // Check if any field has been modified
      setIsModified(true);
    }
  };

  const handleSave = async () => {
    if (!editedValues) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/cron-jobs/${cronJobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedValues),
      });

      if (!response.ok) {
        throw new Error("Failed to update cron job.");
      }

      toast({
        title: "Cron Job Updated",
        description: "The cron job has been updated successfully.",
      });
      setCronJob(editedValues);
      setIsEditing(false);
      setIsModified(false);
    } catch (error: any) {
      console.error("Error updating cron job:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update cron job.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!cronJob || !editedValues) {
    return <p>Loading cron job details...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Cron Job: {cronJob.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Cron Job Name */}
          <div className="mb-4">
            <Label htmlFor="name">Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={editedValues.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            ) : (
              <p>{cronJob.name}</p>
            )}
          </div>

          {/* Cron Expression */}
          <div className="mb-4">
            <Label htmlFor="cron_expression">Cron Expression</Label>
            {isEditing ? (
              <Input
                id="cron_expression"
                value={editedValues.cron_expression}
                onChange={(e) =>
                  handleInputChange("cron_expression", e.target.value)
                }
              />
            ) : (
              <p>{cronJob.cron_expression}</p>
            )}
          </div>

          {/* Replicas */}
          <div className="mb-4">
            <Label htmlFor="replicas">Replicas</Label>
            {isEditing ? (
              <Input
                id="replicas"
                type="number"
                value={editedValues.replicas}
                onChange={(e) =>
                  handleInputChange("replicas", parseInt(e.target.value))
                }
              />
            ) : (
              <p>{cronJob.replicas}</p>
            )}
          </div>

          {/* Requested Memory */}
          <div className="mb-4">
            <Label htmlFor="requested_memory">Requested Memory</Label>
            {isEditing ? (
              <Input
                id="requested_memory"
                value={editedValues.requested_memory}
                onChange={(e) =>
                  handleInputChange("requested_memory", e.target.value)
                }
              />
            ) : (
              <p>{cronJob.requested_memory}</p>
            )}
          </div>

          {/* Requested CPU */}
          <div className="mb-4">
            <Label htmlFor="requested_cpu">Requested CPU</Label>
            {isEditing ? (
              <Input
                id="requested_cpu"
                value={editedValues.requested_cpu}
                onChange={(e) =>
                  handleInputChange("requested_cpu", e.target.value)
                }
              />
            ) : (
              <p>{cronJob.requested_cpu}</p>
            )}
          </div>

          <div className="flex space-x-4">
            {isEditing ? (
              <>
                {/* Save Changes Button */}
                <Button onClick={handleSave} disabled={!isModified || isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
                {/* Cancel Button */}
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {/* Edit Button */}
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}