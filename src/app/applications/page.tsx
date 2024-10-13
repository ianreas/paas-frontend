"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { RepoSelector, Repository } from "../components/RepoSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "../../hooks/use-toast";
import Link from 'next/link';



export interface Application {
  id: number;
  github_repo_name: string;
  github_username: string;
  user_id: string;
  project_name: string;
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
    <div>
      {applications.length > 0 && (
        <div className="my-4">
          <h2 className="text-xl font-bold mb-4">Your Applications</h2>
          <div className="space-y-4">
            {applications.map((app) => (
              <Link href={`/applications/${app.id}`} key={app.id}>
                <Card className="cursor-pointer">
                  <CardHeader>
                    <CardTitle>{app.project_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Repository:</strong> {app.github_repo_name}
                    </p>
                    <p>
                      <strong>Deployed By:</strong> {app.github_username}
                    </p>
                    {/* Add more details as needed */}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <RepoSelector fetchApplications={fetchApplications} />
    </div>
  );
}
