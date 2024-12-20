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
import { motion } from 'framer-motion';
import { Cloud, Server, Cpu, GitBranch, User, MemoryStick, RotateCw, ScrollText, Clock, LineChart } from 'lucide-react';
import MonitoringDashboard from "./components/SystemMetrics";


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
        description:
          "Your application is being redeployed with the new configuration.",
      });

      // Refresh the application details without navigating away
      router.refresh();
    } catch (error: any) {
      console.error("Error during deployment modification:", error);
      toast({
        title: "Deployment Error",
        description:
          error.message || "An error occurred during deployment modification.",
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
    // <div className="bg-[#A4FBAD] min-h-screen pt-2">
    //   <div className="w-full max-w-6xl mx-auto p-6 pt-16">
    //     <Tabs defaultValue="details">
    //     <TabsList className="w-full backdrop-blur-sm bg-white/30 border border-white/20 
    //     rounded-lg h-12 p-1 grid grid-cols-4 gap-1">
    //         <TabsTrigger value="details"  className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
    //         data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
    //         transition-all duration-300 hover:bg-white/20">Details</TabsTrigger>
    //         <TabsTrigger value="logs"  className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
    //         data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
    //         transition-all duration-300 hover:bg-white/20">Logs</TabsTrigger>
    //         <TabsTrigger value="cron"  className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
    //         data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
    //         transition-all duration-300 hover:bg-white/20">Cron Jobs</TabsTrigger>
    //         <TabsTrigger value="metrics"  className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
    //         data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
    //         transition-all duration-300 hover:bg-white/20">Metrics</TabsTrigger>
    //       </TabsList>
    //       <TabsContent value="details">
    //       <GlassCard>
    //   <CardHeader>
    //     <CardTitle className="flex items-center gap-2 text-2xl">
    //       <Cloud className="h-6 w-6 text-emerald-600" />
    //       {application.project_name}
    //     </CardTitle>
    //     <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
    //       <div className="flex items-center gap-2">
    //         <GitBranch className="h-4 w-4" />
    //         <span>{application.github_repo_name}</span>
    //       </div>
    //       <div className="flex items-center gap-2">
    //         <User className="h-4 w-4" />
    //         <span>{application.github_username}</span>
    //       </div>
    //     </div>
    //   </CardHeader>

    //   <CardContent className="space-y-6">
    //     {/* Resource Allocation Section */}
    //     <div className="bg-white/40 rounded-lg p-4 space-y-4">
    //       <h3 className="text-sm font-medium text-gray-700 mb-4">Resource Configuration</h3>
          
    //       {/* Container Port */}
    //       <div className="flex items-center justify-between">
    //         <div className="flex items-center gap-2">
    //           <Server className="h-4 w-4 text-blue-600" />
    //           <Label className="text-sm font-medium">Container Port</Label>
    //         </div>
    //         <div className="flex items-center gap-2">
    //           {isEditing.containerPort ? (
    //             <motion.div 
    //               initial={{ opacity: 0, x: 20 }}
    //               animate={{ opacity: 1, x: 0 }}
    //               className="flex gap-2"
    //             >
    //               <Input
    //                 value={editedValues.containerPort}
    //                 onChange={(e) => handleInputChange("containerPort", parseInt(e.target.value))}
    //                 className="w-24 h-8"
    //               />
    //               <Button 
    //                 variant="ghost" 
    //                 size="sm"
    //                 onClick={() => handleEditToggle("containerPort")}
    //               >
    //                 Cancel
    //               </Button>
    //             </motion.div>
    //           ) : (
    //             <div className="flex items-center gap-2">
    //               <span className="text-sm font-medium">{application.container_port}</span>
    //               <Button 
    //                 variant="ghost" 
    //                 size="sm"
    //                 onClick={() => handleEditToggle("containerPort")}
    //                 className="text-blue-600 hover:text-blue-700"
    //               >
    //                 Edit
    //               </Button>
    //             </div>
    //           )}
    //         </div>
    //       </div>

    //       {/* CPU Allocation */}
    //       <div className="flex items-center justify-between">
    //         <div className="flex items-center gap-2">
    //           <Cpu className="h-4 w-4 text-purple-600" />
    //           <Label className="text-sm font-medium">CPU Allocation</Label>
    //         </div>
    //         <div className="flex items-center gap-2">
    //           {isEditing.cpuAllocation ? (
    //             <motion.div 
    //               initial={{ opacity: 0, x: 20 }}
    //               animate={{ opacity: 1, x: 0 }}
    //               className="flex gap-2"
    //             >
    //               <Select
    //                 value={editedValues.cpuAllocation}
    //                 onValueChange={(value) => handleInputChange("cpuAllocation", value)}
    //               >
    //                 <SelectTrigger className="w-32 h-8">
    //                   <SelectValue />
    //                 </SelectTrigger>
    //                 <SelectContent>
    //                   <SelectItem value="0.5">0.5 CPU</SelectItem>
    //                   <SelectItem value="1">1 CPU</SelectItem>
    //                   <SelectItem value="2">2 CPU</SelectItem>
    //                 </SelectContent>
    //               </Select>
    //               <Button 
    //                 variant="ghost" 
    //                 size="sm"
    //                 onClick={() => handleEditToggle("cpuAllocation")}
    //               >
    //                 Cancel
    //               </Button>
    //             </motion.div>
    //           ) : (
    //             <div className="flex items-center gap-2">
    //               <span className="text-sm font-medium">{application.requested_cpu}</span>
    //               <Button 
    //                 variant="ghost" 
    //                 size="sm"
    //                 onClick={() => handleEditToggle("cpuAllocation")}
    //                 className="text-purple-600 hover:text-purple-700"
    //               >
    //                 Edit
    //               </Button>
    //             </div>
    //           )}
    //         </div>
    //       </div>

    //       {/* Memory Allocation */}
    //       <div className="flex items-center justify-between">
    //         <div className="flex items-center gap-2">
    //           <MemoryStick className="h-4 w-4 text-orange-600" />
    //           <Label className="text-sm font-medium">Memory</Label>
    //         </div>
    //         <div className="flex items-center gap-2">
    //           {isEditing.memoryAllocation ? (
    //             <motion.div 
    //               initial={{ opacity: 0, x: 20 }}
    //               animate={{ opacity: 1, x: 0 }}
    //               className="flex gap-2"
    //             >
    //               <Select
    //                 value={editedValues.memoryAllocation}
    //                 onValueChange={(value) => handleInputChange("memoryAllocation", value)}
    //               >
    //                 <SelectTrigger className="w-32 h-8">
    //                   <SelectValue />
    //                 </SelectTrigger>
    //                 <SelectContent>
    //                   <SelectItem value="512Mi">512 MB</SelectItem>
    //                   <SelectItem value="1Gi">1 GB</SelectItem>
    //                   <SelectItem value="2Gi">2 GB</SelectItem>
    //                 </SelectContent>
    //               </Select>
    //               <Button 
    //                 variant="ghost" 
    //                 size="sm"
    //                 onClick={() => handleEditToggle("memoryAllocation")}
    //               >
    //                 Cancel
    //               </Button>
    //             </motion.div>
    //           ) : (
    //             <div className="flex items-center gap-2">
    //               <span className="text-sm font-medium">{application.requested_memory}</span>
    //               <Button 
    //                 variant="ghost" 
    //                 size="sm"
    //                 onClick={() => handleEditToggle("memoryAllocation")}
    //                 className="text-orange-600 hover:text-orange-700"
    //               >
    //                 Edit
    //               </Button>
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>

    //     {/* Action Buttons */}
    //     <div className="space-y-3 pt-4">
    //       {isModified && (
    //         <motion.div
    //           initial={{ opacity: 0, y: 10 }}
    //           animate={{ opacity: 1, y: 0 }}
    //         >
    //           <Button 
    //             onClick={handleModifyDeployment}
    //             disabled={isModifyingDeployment}
    //             className="w-full bg-emerald-600 hover:bg-emerald-700"
    //           >
    //             {isModifyingDeployment ? "Updating Deployment..." : "Update Configuration"}
    //           </Button>
    //         </motion.div>
    //       )}
          
    //       <Button
    //         variant="outline"
    //         onClick={handleDelete}
    //         disabled={isDeleting}
    //         className="w-full border-red-300 text-red-600 hover:bg-red-50"
    //       >
    //         {isDeleting ? "Deleting Application..." : "Delete Application"}
    //       </Button>
    //     </div>
    //   </CardContent>
    // </GlassCard>
    //       </TabsContent>
    //       <TabsContent value="logs">
    //         <LogViewer appName={application.project_name} />
    //       </TabsContent>
    //       <TabsContent value="cron">
    //         <CronJobs applicationId={application.id} />
    //       </TabsContent>
    //       <TabsContent value="metrics">
    //         <MonitoringDashboard appName={application.project_name} />
    //       </TabsContent>
    //     </Tabs>
    //   </div>
    // </div>
    <div className="bg-[#A4FBAD] min-h-screen pt-2">
    <div className="w-full max-w-6xl mx-auto p-6 pt-16">
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="w-full backdrop-blur-sm bg-white/30 border border-white/20 
          rounded-lg h-12 p-1 grid grid-cols-4 gap-1">
          <TabsTrigger value="details" className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
            data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
            transition-all duration-300 hover:bg-white/20">
            <Server className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
            data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
            transition-all duration-300 hover:bg-white/20">
            <ScrollText className="h-4 w-4" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="cron" className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
            data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
            transition-all duration-300 hover:bg-white/20">
            <Clock className="h-4 w-4" />
            Cron Jobs
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-white/50 data-[state=active]:text-emerald-700
            data-[state=active]:shadow-sm rounded-md h-10 flex items-center gap-2
            transition-all duration-300 hover:bg-white/20">
            <LineChart className="h-4 w-4" />
            Metrics
          </TabsTrigger>
        </TabsList>


        {/* Details Tab */}
        <TabsContent value="details">
        <GlassCard>
       <CardHeader>
         <CardTitle className="flex items-center gap-2 text-2xl">
           <Cloud className="h-6 w-6 text-emerald-600" />
           {application.project_name}
         </CardTitle>
         <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
           <div className="flex items-center gap-2">
             <GitBranch className="h-4 w-4" />
             <span>{application.github_repo_name}</span>
           </div>
           <div className="flex items-center gap-2">
             <User className="h-4 w-4" />
             <span>{application.github_username}</span>
           </div>
         </div>
       </CardHeader>

       <CardContent className="space-y-6">
         {/* Resource Allocation Section */}
         <div className="bg-white/40 rounded-lg p-4 space-y-4">
           <h3 className="text-sm font-medium text-gray-700 mb-4">Resource Configuration</h3>
          
           {/* Container Port */}
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <Server className="h-4 w-4 text-blue-600" />
               <Label className="text-sm font-medium">Container Port</Label>
             </div>
             <div className="flex items-center gap-2">
               {isEditing.containerPort ? (
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex gap-2"
                 >
                   <Input
                     value={editedValues.containerPort}
                     onChange={(e) => handleInputChange("containerPort", parseInt(e.target.value))}
                     className="w-24 h-8"
                   />
                   <Button 
                     variant="ghost" 
                     size="sm"
                     onClick={() => handleEditToggle("containerPort")}
                   >
                     Cancel
                   </Button>
                 </motion.div>
               ) : (
                 <div className="flex items-center gap-2">
                   <span className="text-sm font-medium">{application.container_port}</span>
                   <Button 
                     variant="ghost" 
                     size="sm"
                     onClick={() => handleEditToggle("containerPort")}
                     className="text-blue-600 hover:text-blue-700"
                   >
                     Edit
                   </Button>
                 </div>
               )}
             </div>
           </div>

           {/* CPU Allocation */}
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <Cpu className="h-4 w-4 text-purple-600" />
               <Label className="text-sm font-medium">CPU Allocation</Label>
             </div>
             <div className="flex items-center gap-2">
               {isEditing.cpuAllocation ? (
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex gap-2"
                 >
                   <Select
                     value={editedValues.cpuAllocation}
                     onValueChange={(value) => handleInputChange("cpuAllocation", value)}
                   >
                     <SelectTrigger className="w-32 h-8">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="0.5">0.5 CPU</SelectItem>
                       <SelectItem value="1">1 CPU</SelectItem>
                       <SelectItem value="2">2 CPU</SelectItem>
                     </SelectContent>
                   </Select>
                   <Button 
                     variant="ghost" 
                     size="sm"
                     onClick={() => handleEditToggle("cpuAllocation")}
                   >
                     Cancel
                   </Button>
                 </motion.div>
               ) : (
                 <div className="flex items-center gap-2">
                   <span className="text-sm font-medium">{application.requested_cpu}</span>
                   <Button 
                     variant="ghost" 
                     size="sm"
                     onClick={() => handleEditToggle("cpuAllocation")}
                     className="text-purple-600 hover:text-purple-700"
                   >
                     Edit
                   </Button>
                 </div>
               )}
             </div>
           </div>

           {/* Memory Allocation */}
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <MemoryStick className="h-4 w-4 text-orange-600" />
               <Label className="text-sm font-medium">Memory</Label>
             </div>
             <div className="flex items-center gap-2">
               {isEditing.memoryAllocation ? (
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex gap-2"
                 >
                   <Select
                     value={editedValues.memoryAllocation}
                     onValueChange={(value) => handleInputChange("memoryAllocation", value)}
                   >
                     <SelectTrigger className="w-32 h-8">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="512Mi">512 MB</SelectItem>
                       <SelectItem value="1Gi">1 GB</SelectItem>
                       <SelectItem value="2Gi">2 GB</SelectItem>
                     </SelectContent>
                   </Select>
                   <Button 
                     variant="ghost" 
                     size="sm"
                     onClick={() => handleEditToggle("memoryAllocation")}
                   >
                     Cancel
                   </Button>
                 </motion.div>
               ) : (
                 <div className="flex items-center gap-2">
                   <span className="text-sm font-medium">{application.requested_memory}</span>
                   <Button 
                     variant="ghost" 
                     size="sm"
                     onClick={() => handleEditToggle("memoryAllocation")}
                     className="text-orange-600 hover:text-orange-700"
                   >
                     Edit
                   </Button>
                 </div>
               )}
             </div>
           </div>
         </div>

         {/* Action Buttons */}
         <div className="space-y-3 pt-4">
           {isModified && (
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
             >
               <Button 
                 onClick={handleModifyDeployment}
                 disabled={isModifyingDeployment}
                 className="w-full bg-emerald-600 hover:bg-emerald-700"
               >
                 {isModifyingDeployment ? "Updating Deployment..." : "Update Configuration"}
               </Button>
             </motion.div>
           )}
          
           <Button
             variant="outline"
             onClick={handleDelete}
             disabled={isDeleting}
             className="w-full border-red-300 text-red-600 hover:bg-red-50"
           >
             {isDeleting ? "Deleting Application..." : "Delete Application"}
           </Button>
         </div>
       </CardContent>
     </GlassCard>
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
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
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
      </Tabs>
    </div>
  </div>
  );
}
