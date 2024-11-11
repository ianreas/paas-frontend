import { GlassCard } from "@/app/components/ui/CustomCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Clock,
  Plus,
  Calendar,
  Cpu,
  MemoryStick,
  Copy,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

interface CronJobFromDB {
  id: number;
  application_id: number;
  name: string;
  cron_expression: string;
  replicas: number;
  requested_memory: string;
  requested_cpu: string;
}

interface NewCronJob {
  name: string;
  cron_expression: string;
  replicas: number;
  requested_memory: string;
  requested_cpu: string;
  active_deadline_seconds: number;
  suspend: boolean;
}

export default function CronJobs({ applicationId }: { applicationId: number }) {
  const [cronJobs, setCronJobs] = useState<CronJobFromDB[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [newCronJob, setNewCronJob] = useState<NewCronJob | null>(null);

  useEffect(() => {
    fetch(`/api/cron-jobs?application_id=${applicationId}`)
      .then((response) => response.json())
      .then((data) => setCronJobs(data.cronJobs));
  }, [applicationId]);

  const handleAddCronJob = () => {
    console.log("Add Cron Job");
    setIsPopoverOpen(false);
  };

  return (
    <GlassCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Clock className="h-6 w-6 text-purple-600" />
          Cron Jobs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Cron Job Button */}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              onClick={() => setIsPopoverOpen(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Cron Job
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl">
            <div className="grid gap-6">
              <div className="space-y-2">
                <h4 className="font-medium leading-none flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Cron Job Details
                </h4>
                <p className="text-sm text-gray-600">
                  Configure your scheduled task settings
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="name" className="font-medium">
                    Name*
                  </Label>
                  <Input
                    id="name"
                    className="col-span-2 h-9 bg-white/50 border border-white/20"
                    placeholder="backup-job"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="cronExpression" className="font-medium">
                    Schedule*
                  </Label>
                  <Input
                    id="cronExpression"
                    className="col-span-2 h-9 bg-white/50 border border-white/20"
                    placeholder="0 0 * * *"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="replicas" className="font-medium">
                    Replicas
                  </Label>
                  <Input
                    id="replicas"
                    type="number"
                    defaultValue="1"
                    className="col-span-2 h-9 bg-white/50 border border-white/20"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="requestedMemory" className="font-medium">
                    Memory
                  </Label>
                  <Input
                    id="requestedMemory"
                    defaultValue="512Mi"
                    className="col-span-2 h-9 bg-white/50 border border-white/20"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="requestedCpu" className="font-medium">
                    CPU
                  </Label>
                  <Input
                    id="requestedCpu"
                    defaultValue="0.5"
                    className="col-span-2 h-9 bg-white/50 border border-white/20"
                  />
                </div>
                <Button
                  onClick={handleAddCronJob}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Create Cron Job
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Cron Jobs List */}
        <div className="space-y-4">
          {cronJobs.map((cronJob) => (
            <motion.div
              key={cronJob.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Link
                    href={`/applications/${applicationId}/${cronJob.id}`}
                    className="text-lg font-medium text-purple-700 hover:text-purple-800 flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    {cronJob.name}
                  </Link>
                  <div className="text-sm text-gray-600 font-mono">
                    {cronJob.cron_expression}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Copy className="h-4 w-4" />
                  <span>Replicas: {cronJob.replicas}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MemoryStick className="h-4 w-4" />
                  <span>{cronJob.requested_memory}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Cpu className="h-4 w-4" />
                  <span>{cronJob.requested_cpu} CPU</span>
                </div>
              </div>
            </motion.div>
          ))}

          {cronJobs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No cron jobs configured yet</p>
              <p className="text-sm">
                Click &quot;Add Cron Job&quot; to create your first scheduled
                task
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </GlassCard>
    // <div>
    //   <GlassCard>
    //     <CardHeader>Cron Jobs</CardHeader>
    //     <CardContent>
    //       <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
    //         <PopoverTrigger>
    //           <Button onClick={() => setIsPopoverOpen(true)}>
    //             Add Cron Job
    //           </Button>
    //         </PopoverTrigger>
    //         <PopoverContent className="w-80">
    //           <div className="grid gap-4">
    //             <div className="space-y-2">
    //               <h4 className="font-medium leading-none">Cron Job Details</h4>
    //               <p className="text-sm text-muted-foreground">
    //                 Set the details for the cron job.
    //               </p>
    //             </div>
    //             <div className="grid gap-2">
    //               <div className="grid grid-cols-3 items-center gap-4">
    //                 <Label htmlFor="name">Name*</Label>
    //                 <Input
    //                   id="name"
    //                   className="col-span-2 h-8"
    //                 />
    //               </div>
    //               <div className="grid grid-cols-3 items-center gap-4">
    //                 <Label htmlFor="cronExpression">Cron Expression*</Label>
    //                 <Input
    //                   id="cronExpression"
    //                   defaultValue="300px"
    //                   className="col-span-2 h-8"
    //                 />
    //               </div>
    //               <div className="grid grid-cols-3 items-center gap-4">
    //                 <Label htmlFor="replicas">Replicas</Label>
    //                 <Input
    //                   id="replicas"
    //                   defaultValue="1"
    //                   className="col-span-2 h-8"
    //                 />
    //               </div>
    //               <div className="grid grid-cols-3 items-center gap-4">
    //                 <Label htmlFor="requestedMemory">Requested Memory</Label>
    //                 <Input
    //                   id="requestedMemory"
    //                   defaultValue="1"
    //                   className="col-span-2 h-8"
    //                 />
    //               </div>
    //               <div className="grid grid-cols-3 items-center gap-4">
    //                 <Label htmlFor="requestedCpu">Requested CPU</Label>
    //                 <Input
    //                   id="requestedCpu"
    //                   defaultValue="1"
    //                   className="col-span-2 h-8"
    //                 />
    //               </div>
    //               <Button onClick={handleAddCronJob}>Add</Button>
    //             </div>
    //           </div>
    //         </PopoverContent>
    //       </Popover>
    //       {cronJobs.map((cronJob) => (
    //         <div key={cronJob.id} className="mb-4">
    //           <h3>
    //             <Link href={`/applications/${applicationId}/${cronJob.id}`}>
    //               {cronJob.name}
    //             </Link>
    //           </h3>
    //           <p>{cronJob.cron_expression}</p>
    //           <p>{cronJob.replicas}</p>
    //           <p>{cronJob.requested_memory}</p>
    //           <p>{cronJob.requested_cpu}</p>
    //         </div>
    //       ))}
    //     </CardContent>
    //   </GlassCard>
    // </div>
  );
}
