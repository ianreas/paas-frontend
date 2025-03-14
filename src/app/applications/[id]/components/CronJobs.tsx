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
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();
  const [cronJobs, setCronJobs] = useState<CronJobFromDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [newCronJob, setNewCronJob] = useState<NewCronJob | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      setError("Please sign in to view cron jobs");
      setIsLoading(false);
      return;
    }

    const fetchCronJobs = async () => {
      try {
        const response = await fetch(`/api/cron-jobs?application_id=${applicationId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setCronJobs(data.cronJobs);
      } catch (error) {
        console.error("Failed to fetch cron jobs:", error);
        setError("Failed to load cron jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCronJobs();
  }, [applicationId, session, status]);

  const handleAddCronJob = () => {
    console.log("Add Cron Job");
    setIsPopoverOpen(false);
  };

  if (isLoading) {
    return (
      <GlassCard>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard>
        <CardContent className="text-center py-8 text-red-500">
          {error}
        </CardContent>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <CardHeader>
        {/* <CardTitle className="flex items-center gap-2 text-2xl">
          <Clock className="h-6 w-6 text-black" />
          Cron Jobs
        </CardTitle> */}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Cron Job Button */}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              onClick={() => setIsPopoverOpen(true)}
              className="w-full bg-black hover:bg-black/80 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Cron Job
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl">
            <div className="grid gap-6">
              <div className="space-y-2">
                <h4 className="font-medium leading-none flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-black" />
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
                  className="w-full bg-black hover:bg-black/80"
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
                    className="text-lg font-medium text-black hover:text-black/80 flex items-center gap-2"
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
  );
}
