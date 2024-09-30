import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Repository = {
  id: number;
  name: string;
  full_name: string;
};

export function RepoSelector({ onSelectRepo }: { onSelectRepo: (repo: Repository) => void }) {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  useEffect(() => {
    console.log('the session', session);
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
    }
  };

  const handleSelectRepo = (repoFullName: string) => {
    const repo = repos.find(r => r.full_name === repoFullName);
    if (repo) {
      setSelectedRepo(repo);
    }
  };

  const handleDeployRepo = () => {
    if (selectedRepo) {
      onSelectRepo(selectedRepo);
    }
  };

  return (
    <Card className="w-[350px] mx-auto mt-4">
      <CardHeader>
        <CardTitle>Deploy a new application</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={handleSelectRepo}>
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
        <Button 
          onClick={handleDeployRepo} 
          className="w-full mt-4" 
          disabled={!selectedRepo}
        >
          Deploy Repository
        </Button>
      </CardContent>
    </Card>
  );
}