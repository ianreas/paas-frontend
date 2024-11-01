import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    <div>
      <Card>
        <CardHeader>Cron Jobs</CardHeader>
        <CardContent>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger>
              <Button onClick={() => setIsPopoverOpen(true)}>
                Add Cron Job
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Cron Job Details</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the details for the cron job.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="name">Name*</Label>
                    <Input
                      id="name"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="cronExpression">Cron Expression*</Label>
                    <Input
                      id="cronExpression"
                      defaultValue="300px"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="replicas">Replicas</Label>
                    <Input
                      id="replicas"
                      defaultValue="1"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="requestedMemory">Requested Memory</Label>
                    <Input
                      id="requestedMemory"
                      defaultValue="1"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="requestedCpu">Requested CPU</Label>
                    <Input
                      id="requestedCpu"
                      defaultValue="1"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <Button onClick={handleAddCronJob}>Add</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {cronJobs.map((cronJob) => (
            <div key={cronJob.id} className="mb-4">
              <h3>
                <Link href={`/applications/${applicationId}/${cronJob.id}`}>
                  {cronJob.name}
                </Link>
              </h3>
              <p>{cronJob.cron_expression}</p>
              <p>{cronJob.replicas}</p>
              <p>{cronJob.requested_memory}</p>
              <p>{cronJob.requested_cpu}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
