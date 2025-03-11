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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/app/components/ui/CustomCards";
import { motion } from "framer-motion";
import {
  Cloud,
  Server,
  Cpu,
  GitBranch,
  User,
  MemoryStick,
  RotateCw,
  ScrollText,
  Clock,
  LineChart,
  Gauge,
  MapPin,
} from "lucide-react";
import MonitoringDashboard from "./components/SystemMetrics";
import { Switch } from "@/components/ui/switch";
import AdvancedOptimization from "./components/AdvancedOptimization";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import DeploymentDetails from "./components/DeploymentDetails";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceMap from "./components/ServiceMap";
import CICDViewer from "./components/CICD";
import ClusterVisualizer from "./components/TopologyMap";
import KubernetesTopology from "./components/KubernetesTopology";

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

  const [editedValues, setEditedValues] = useState({
    containerPort: 0,
    replicas: 0,
    cpuAllocation: "",
    memoryAllocation: "",
  });

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

  if (!application) {
    return (
      <div className="bg-[#A4FBAD] min-h-screen pt-2">
        <div className="w-full max-w-6xl mx-auto p-6 pt-16 space-y-6">
          {/* Tabs Skeleton */}
          <div className="w-full h-12">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>

          {/* Header Skeleton */}
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#A4FBAD] min-h-screen pt-2">
      <div className="w-full max-w-6xl mx-auto p-6 pt-16">
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList
            className="w-full backdrop-blur-sm bg-white/30 border border-white/20 
          rounded-lg h-12 p-1 grid grid-cols-7 gap-1"
          >
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
            data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
            transition-all duration-300 hover:bg-white/20"
            >
              <Server className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
            data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
            transition-all duration-300 hover:bg-white/20"
            >
              <ScrollText className="h-4 w-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger
              value="cron"
              className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
            data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
            transition-all duration-300 hover:bg-white/20"
            >
              <Clock className="h-4 w-4" />
              Cron Jobs
            </TabsTrigger>
            <TabsTrigger
              value="metrics"
              className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
            data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
            transition-all duration-300 hover:bg-white/20"
            >
              <LineChart className="h-4 w-4" />
              Metrics
            </TabsTrigger>
            <TabsTrigger
              value="advanced-optimizations"
              className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
            data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
            transition-all duration-300 hover:bg-white/20"
            >
              <Gauge className="h-4 w-4" />
              Advanced
            </TabsTrigger>
            <TabsTrigger
              value="service-map"
              className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
            data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
            transition-all duration-300 hover:bg-white/20"
            >
              <MapPin className="h-4 w-4" />
              Service Map
            </TabsTrigger>
            <TabsTrigger
              value="cicd"
              className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
            data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
            transition-all duration-300 hover:bg-white/20"
            >
              <GitBranch className="h-4 w-4" />
              CI/CD
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details">
            <DeploymentDetails></DeploymentDetails>
          </TabsContent>
          {/* Logs Tab */}
          <TabsContent value="logs">
            <GlassCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScrollText className="h-5 w-5 text-emerald-600" />
                  Application Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LogViewer appName={application.project_name} />
              </CardContent>
            </GlassCard>
          </TabsContent>

          {/* Cron Jobs Tab */}
          <TabsContent value="cron">
            <GlassCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  Scheduled Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CronJobs applicationId={application.id} />
              </CardContent>
            </GlassCard>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics">
            <GlassCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-emerald-600" />
                  System Metrics
                </CardTitle>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                  <div className="flex items-center gap-4">
                    <Select defaultValue="1h">
                      <SelectTrigger className="w-32 bg-white/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">Last Hour</SelectItem>
                        <SelectItem value="6h">Last 6 Hours</SelectItem>
                        <SelectItem value="24h">Last 24 Hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <MonitoringDashboard appName={application.project_name} />
              </CardContent>
            </GlassCard>
          </TabsContent>
          <TabsContent value="advanced-optimizations">
            <AdvancedOptimization />
          </TabsContent>
          <TabsContent value="service-map">
            <KubernetesTopology namespace={application.user_id.toString()} />
          </TabsContent>
          <TabsContent value="cicd">
            <CICDViewer appName={application.project_name} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
