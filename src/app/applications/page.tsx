"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { RepoSelector, Repository } from "../components/RepoSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "../../hooks/use-toast";
import Link from 'next/link';
import ApplicationViews from "../components/ui/ListViewer";



export interface Application {
  id: number;
  github_repo_name: string;
  github_username: string;
  user_id: string;
  project_name: string;
  container_port: number;
  replicas: number;
  requested_cpu: string;
  requested_memory: string;
  status: string;
  last_deployed_at: string;
}

export default function Applications() {
  const { data: session } = useSession();
 
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

 



  return (
    <div className="bg-[#A4FBAD] min-h-screen pt-0">
      {applications.length > 0 && (
        <div className="pt-16">
          <ApplicationViews applications={applications} fetchApplications={fetchApplications} />
          <div className="space-y-4">
          </div>
        </div>
      )}
    </div>
  );
}
