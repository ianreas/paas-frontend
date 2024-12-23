import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Activity,
  Box,
  Grid3X3,
  List,
  Loader2,
  Plus,
  Search,
  Server,
  Settings2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Application } from "@/app/applications/page";
import { GlassCard } from "./CustomCards";
import { RepoSelector } from "../RepoSelector";
import Link from "next/link";

// Sample data
// const sampleApps = [
//   {
//     id: 1,
//     project_name: "express-api",
//     github_repo_name: "user/express-api",
//     github_username: "developer1",
//     status: "running",
//     lastDeployed: "2024-02-15",
//     cpu: "23%",
//     memory: "156MB"
//   },
//   {
//     id: 2,
//     project_name: "next-frontend",
//     github_repo_name: "user/next-frontend",
//     github_username: "developer2",
//     status: "updating",
//     lastDeployed: "2024-02-14",
//     cpu: "45%",
//     memory: "312MB"
//   },
//   {
//     id: 3,
//     project_name: "auth-service",
//     github_repo_name: "user/auth-service",
//     github_username: "developer1",
//     status: "stopped",
//     lastDeployed: "2024-02-10",
//     cpu: "0%",
//     memory: "0MB"
//   }
// ]

const ApplicationViews = ({
  applications,
  fetchApplications,
}: {
  applications: Application[];
  fetchApplications: () => void;
}) => {
  const [viewType, setViewType] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500";
      case "updating":
        return "bg-yellow-500";
      case "stopped":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredApps = applications.filter(
    (app) =>
      app.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.github_repo_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {" "}
          {/* New wrapper div for heading + button */}
          <h1 className="text-3xl font-bold">Deployed Applications</h1>
          <RepoSelector fetchApplications={fetchApplications} />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewType === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewType("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewType("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === "command" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewType("command")}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Search applications..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </Command>
      </div>

      {viewType === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <GlassCard key={app.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{app.project_name}</CardTitle>
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(
                      app.status
                    )}`}
                  />
                </div>
                <CardDescription>{app.github_repo_name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary">
                    <Server className="w-3 h-3 mr-1" />
                    {app.requested_cpu}
                  </Badge>
                  <Badge variant="secondary">
                    <Activity className="w-3 h-3 mr-1" />
                    {app.requested_memory}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
  Last deployed: {format(new Date(app.last_deployed_at), "MMMM d, yyyy h:mm a")}
</p>
              </CardContent>
              <CardFooter>
                <Link href={`/applications/${app.id}`}>
                  <Button variant="outline" className="w-full">
                    Manage
                  </Button>
                </Link>
              </CardFooter>
            </GlassCard>
          ))}
        </div>
      )}

      {viewType === "list" && (
        <div className="space-y-2">
          {filteredApps.map((app) => (
            <Card key={app.id} className="hover:bg-accent transition-colors">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-8 rounded-full ${getStatusColor(
                      app.status
                    )}`}
                  />
                  <div>
                    <h3 className="font-semibold">{app.project_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {app.github_repo_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      <Server className="w-3 h-3 mr-1" />
                      {app.requested_cpu}
                    </Badge>
                    <Badge variant="secondary">
                      <Activity className="w-3 h-3 mr-1" />
                      {app.requested_memory}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {viewType === "command" && (
        <Command className="rounded-lg border shadow-md">
          <CommandList>
            <CommandEmpty>No applications found.</CommandEmpty>
            <CommandGroup heading="Applications">
              {filteredApps.map((app) => (
                <CommandItem
                  key={app.id}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4" />
                    <div>
                      <p className="font-medium">{app.project_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {app.github_repo_name}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusColor(
                      app.status
                    )}`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}

      {filteredApps.length === 0 && (
        <Alert>
          <AlertTitle>No applications found</AlertTitle>
          <AlertDescription>
            Try adjusting your search query or deploy a new application.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ApplicationViews;
