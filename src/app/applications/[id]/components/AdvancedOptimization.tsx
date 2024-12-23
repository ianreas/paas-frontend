import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/app/components/ui/CustomCards";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NUMA_AWARE_INFO = (
  <>
    <p>
      The Topology Manager coordinates the NUMA (Non-Uniform Memory Access) alignment 
      of resources like CPU, memory, and devices to optimize performance for 
      hardware-sensitive workloads.
    </p>

    <div className="mt-4">
      <p className="font-medium">Available Policies:</p>
      <ul className="list-disc pl-6 mt-2">
        <li><span className="font-medium">Single NUMA Node:</span> Ensures all resources are allocated from a single NUMA node (strictest policy)</li>
        <li><span className="font-medium">Restricted:</span> Allows resources from multiple NUMA nodes only if single-node allocation is impossible</li>
        <li><span className="font-medium">Best Effort:</span> Attempts NUMA alignment but allows allocation even if not optimal</li>
        <li><span className="font-medium">None:</span> No NUMA alignment optimization (default)</li>
      </ul>
    </div>

    <div className="mt-4">
      <p className="font-medium">Best For:</p>
      <ul className="list-disc pl-6 mt-2">
        <li>High-performance computing (HPC) workloads</li>
        <li>GPU-accelerated applications</li>
        <li>Network-intensive applications using DPDK</li>
        <li>Low-latency financial applications</li>
        <li>AI/ML training workloads</li>
      </ul>
    </div>

    <p className="mt-4">
      <span className="font-medium">Performance Impact:</span> Proper NUMA alignment 
      can reduce memory access latency by up to 40% and improve overall application 
      performance, especially for memory-intensive workloads.
    </p>

    <p className="mt-4">
      <span className="font-medium">Note:</span> Stricter policies may result in 
      pods being unable to schedule if their resource requirements cannot be met 
      within a single NUMA node.
    </p>
  </>
);

const CPU_MANAGER_POLICY_INFO = (
  <>
    <p>
      The CPU Manager Policy controls how CPU resources are allocated and managed for 
      containers in your pods. The static policy enables exclusive CPU core allocation 
      for containers in Guaranteed QoS class pods, while the default "none" policy 
      uses the standard Kubernetes CPU shares-based allocation.
    </p>

    <div className="mt-4">
      <p className="font-medium">Static Policy Benefits:</p>
      <ul className="list-disc pl-6 mt-2">
        <li>Reduced CPU context switching and cache thrashing</li>
        <li>Improved CPU cache affinity</li>
        <li>Lower and more predictable latency</li>
        <li>Better performance isolation</li>
      </ul>
    </div>

    <div className="mt-4">
      <p className="font-medium">Recommended For:</p>
      <ul className="list-disc pl-6 mt-2">
        <li>Latency-sensitive applications (gaming servers, financial trading)</li>
        <li>CPU-intensive workloads (scientific computing, video encoding)</li>
        <li>Applications requiring predictable performance</li>
        <li>Workloads with strict QoS requirements</li>
        <li>NFV (Network Function Virtualization) applications</li>
      </ul>
    </div>

    <div className="mt-4">
      <p className="font-medium">Requirements & Limitations:</p>
      <ul className="list-disc pl-6 mt-2">
        <li>Only works with Guaranteed QoS class pods</li>
        <li>Requires integer CPU requests (e.g., 2 cores, not 2.5)</li>
        <li>Cannot be used with CPU limits different from requests</li>
        <li>Reduces scheduling flexibility and CPU utilization</li>
      </ul>
    </div>

    <p className="mt-4">
      <span className="font-medium">Note:</span> The static policy reserves a set of 
      CPUs for system tasks and kubelet (specified via --reserved-cpus flag). All 
      other pods use the remaining CPU cores, which may impact overall cluster 
      density and resource utilization.
    </p>

    <p className="mt-4">
      <span className="font-medium">Best Practice:</span> Use static policy only 
      for workloads that truly benefit from CPU pinning and isolation. For general-purpose 
      workloads, the default policy provides better resource utilization and flexibility.
    </p>
  </>
);

const QOS_CLASS_INFO = (
  <>
    <p>
      Kubernetes Quality of Service (QoS) classes determine how pods are scheduled, 
      prioritized, and evicted under resource pressure. The QoS class is automatically 
      assigned based on resource requests and limits configuration.
    </p>

    <div className="mt-4">
      <p className="font-medium">Available Classes:</p>
      <ul className="list-disc pl-6 mt-2">
        <li>
          <span className="font-medium">Guaranteed:</span> Requests equal limits for all 
          resources. Highest priority, last to be evicted. Best for production workloads 
          requiring stable performance.
        </li>
        <li>
          <span className="font-medium">Burstable:</span> At least one container has 
          requests lower than limits. Medium priority, evicted after BestEffort pods.
        </li>
        <li>
          <span className="font-medium">BestEffort:</span> No resource requests or 
          limits specified. Lowest priority, first to be evicted under resource pressure.
        </li>
      </ul>
    </div>

    <div className="mt-4">
      <p className="font-medium">Use Guaranteed For:</p>
      <ul className="list-disc pl-6 mt-2">
        <li>Production critical workloads</li>
        <li>Applications requiring consistent performance</li>
        <li>Workloads using CPU Manager static policy</li>
        <li>Services with strict SLA requirements</li>
        <li>Memory-sensitive applications</li>
      </ul>
    </div>

    <div className="mt-4">
      <p className="font-medium">Use Burstable For:</p>
      <ul className="list-disc pl-6 mt-2">
        <li>Development/staging environments</li>
        <li>Applications with variable workloads</li>
        <li>Batch processing jobs</li>
        <li>Services that can handle occasional throttling</li>
      </ul>
    </div>

    <div className="mt-4">
      <p className="font-medium">Use BestEffort For:</p>
      <ul className="list-disc pl-6 mt-2">
        <li>Non-critical batch jobs</li>
        <li>Development tools</li>
        <li>Testing workloads</li>
        <li>Jobs where completion time is not critical</li>
      </ul>
    </div>

    <p className="mt-4">
      <span className="font-medium">Resource Implications:</span> QoS class affects:
    </p>
    <ul className="list-disc pl-6 mt-2">
      <li>Pod scheduling priority</li>
      <li>Order of pod eviction under node pressure</li>
      <li>CPU throttling behavior</li>
      <li>Memory allocation and OOM kill priority</li>
    </ul>

    <p className="mt-4">
      <span className="font-medium">Note:</span> Higher QoS classes (Guaranteed) 
      typically require more resources but provide better stability and predictability. 
      Choose based on your application's requirements and criticality.
    </p>
  </>
);

interface FormState {
  compute: {
    cpuManagerPolicy: string;
    topologyManager: string;
    reservedCPUs: string;
    qosClass: string;
  };
  memory: {
    enableHugePages: boolean;
    hugePageSize: string;
    numaAware: boolean;
    memoryPolicy: string;
  };
  storage: {
    localSSD: boolean;
    storageClass: string;
    iopsLimit: number;
  };
  network: {
    networkPolicy: string;
    enableIPv6: boolean;
    maxPodsPerNode: number;
    xdpAcceleration: boolean;
  };
  monitoring: {
    detailedMonitoring: boolean;
    customMetricsEndpoint: string;
    runtimeMetrics: boolean;
  };
}

export default function AdvancedEKSConfig() {
  const { toast } = useToast();
  const [activeProfile, setActiveProfile] = React.useState("standard");
  const [saveButtonEnabled, setSaveButtonEnabled] = React.useState(false);

  // Initial form state
  const [formState, setFormState] = React.useState<FormState>({
    compute: {
      cpuManagerPolicy: "static",
      topologyManager: "single-numa-node",
      reservedCPUs: "default",
      qosClass: "guaranteed",
    },
    memory: {
      enableHugePages: false,
      hugePageSize: "2Mi",
      numaAware: false,
      memoryPolicy: "static",
    },
    storage: {
      localSSD: false,
      storageClass: "gp3",
      iopsLimit: 16000,
    },
    network: {
      networkPolicy: "cilium",
      enableIPv6: false,
      maxPodsPerNode: 110,
      xdpAcceleration: false,
    },
    monitoring: {
      detailedMonitoring: false,
      customMetricsEndpoint: "",
      runtimeMetrics: false,
    },
  });

  // Initial reference state to compare against
  const initialFormState = React.useRef(formState);

  // Check for changes whenever formState updates
  React.useEffect(() => {
    const hasChanges =
      JSON.stringify(formState) !== JSON.stringify(initialFormState.current);
    setSaveButtonEnabled(hasChanges);
  }, [formState]);

  // Helper function to update form state
  const updateFormState = (
    section: keyof FormState,
    field: string,
    value: any
  ) => {
    setFormState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log(formState);

    // Show success toast
    toast({
      title: "Settings saved",
      description:
        "Your advanced optimization settings have been updated successfully.",
      variant: "default", // or "destructive" for errors
    });

    // Update the initial state reference to the current state
    initialFormState.current = formState;
    setSaveButtonEnabled(false);
  };

  const renderInfoBadge = (title: string, description: React.ReactNode) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Badge variant="secondary" className="ml-2 cursor-pointer">
          <Info className="h-3 w-3" />
        </Badge>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4" asChild>
            <div className="text-sm text-muted-foreground">
              {description}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="space-y-6">
      <GlassCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Advanced Optimization Settings</CardTitle>
              <CardDescription>
                Configure advanced optimization settings for your application
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compute" className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="compute">Compute</TabsTrigger>
              <TabsTrigger value="memory">Memory</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            </TabsList>

            <TabsContent value="compute" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    CPU Manager Policy{" "}
                    {renderInfoBadge(
                      "Affects how CPU resources are allocated to pods",
                      CPU_MANAGER_POLICY_INFO
                    )}
                  </Label>
                  <Select
                    value={formState.compute.cpuManagerPolicy}
                    onValueChange={(value) =>
                      updateFormState("compute", "cpuManagerPolicy", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="static">Static</SelectItem>
                      <SelectItem value="dynamic">Dynamic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    Topology Manager{" "}
                    {renderInfoBadge(
                      "Controls NUMA alignment of resources",
                      NUMA_AWARE_INFO
                    )}
                  </Label>
                  <Select
                    value={formState.compute.topologyManager}
                    onValueChange={(value) =>
                      updateFormState("compute", "topologyManager", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-numa-node">
                        Single NUMA Node
                      </SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                      <SelectItem value="best-effort">Best Effort</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <>
                  <div className="space-y-2">
                    <Label>
                      Reserved CPUs{" "}
                      {renderInfoBadge(
                        "CPUs reserved for system processes",
                        <></>
                      )}
                    </Label>
                    <Input
                      value={formState.compute.reservedCPUs}
                      onChange={(e) =>
                        updateFormState(
                          "compute",
                          "reservedCPUs",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      QoS Class{" "}
                      {renderInfoBadge(
                        "Quality of Service class for the workload",
                        <></>
                      )}
                    </Label>
                    <Select
                      value={formState.compute.qosClass}
                      onValueChange={(value) =>
                        updateFormState("compute", "qosClass", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select QoS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guaranteed">Guaranteed</SelectItem>
                        <SelectItem value="burstable">Burstable</SelectItem>
                        <SelectItem value="besteffort">Best Effort</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              </div>
              <Button onClick={handleSave} disabled={!saveButtonEnabled}>
                Save
              </Button>
            </TabsContent>

            <TabsContent value="memory" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Enable HugePages</Label>
                    <Switch
                      checked={formState.memory.enableHugePages}
                      onCheckedChange={(checked) =>
                        updateFormState("memory", "enableHugePages", checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>HugePage Size</Label>
                  <Select
                    value={formState.memory.hugePageSize}
                    onValueChange={(value) =>
                      updateFormState("memory", "hugePageSize", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2Mi">2Mi</SelectItem>
                      <SelectItem value="1Gi">1Gi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>
                      NUMA Aware{" "}
                      {renderInfoBadge(
                        "Enable NUMA-aware memory allocation",
                        <></>
                      )}
                    </Label>
                    <Switch
                      checked={formState.memory.numaAware}
                      onCheckedChange={(checked) =>
                        updateFormState("memory", "numaAware", checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Memory Policy</Label>
                  <Select
                    value={formState.memory.memoryPolicy}
                    onValueChange={(value) =>
                      updateFormState("memory", "memoryPolicy", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="static">Static</SelectItem>
                      <SelectItem value="dynamic">Dynamic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSave} disabled={!saveButtonEnabled}>
                Save
              </Button>
            </TabsContent>

            <TabsContent value="storage" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>
                      Local SSD{" "}
                      {renderInfoBadge("Use local NVMe SSDs for storage", <></>)}
                    </Label>
                    <Switch
                      checked={formState.storage.localSSD}
                      onCheckedChange={(checked) =>
                        updateFormState("storage", "localSSD", checked)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Storage Class</Label>
                  <Select
                    value={formState.storage.storageClass}
                    onValueChange={(value) =>
                      updateFormState("storage", "storageClass", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select storage class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gp3">GP3</SelectItem>
                      <SelectItem value="io2">IO2</SelectItem>
                      <SelectItem value="local-nvme">Local NVMe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>
                      IOPS Limit{" "}
                      {renderInfoBadge("Maximum IOPS per volume", <></>)}
                    </Label>
                    <span className="px-2 py-1 text-sm font-medium rounded-md bg-secondary">
                      {formState.storage.iopsLimit.toLocaleString()} IOPS
                    </span>
                  </div>
                  <div className="pt-2">
                    <Slider
                      value={[formState.storage.iopsLimit]}
                      onValueChange={(value) =>
                        updateFormState("storage", "iopsLimit", value[0])
                      }
                      min={3000}
                      max={64000}
                      step={1000}
                      className="my-4"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        3,000
                      </span>
                      <div className="flex gap-1 text-xs text-muted-foreground"></div>
                      <span className="text-xs text-muted-foreground">
                        64,000
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended: 16,000 IOPS for production workloads
                  </p>
                </div>
              </div>
              <Button onClick={handleSave} disabled={!saveButtonEnabled}>
                Save
              </Button>
            </TabsContent>

            <TabsContent value="network" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Network Policy</Label>
                  <Select
                    value={formState.network.networkPolicy}
                    onValueChange={(value) =>
                      updateFormState("network", "networkPolicy", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cilium">Cilium</SelectItem>
                      <SelectItem value="calico">Calico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>
                      Enable IPv6{" "}
                      {renderInfoBadge(
                        "Enable IPv6 dual-stack networking",
                        <></>
                      )}
                    </Label>
                    <Switch
                      checked={formState.network.enableIPv6}
                      onCheckedChange={(checked) =>
                        updateFormState("network", "enableIPv6", checked)
                      }
                    />
                  </div>
                </div>
                <>
                  <div className="space-y-2">
                    <Label>Max Pods per Node</Label>
                    <Input type="number" defaultValue={110} min={1} max={250} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>
                        XDP Acceleration{" "}
                        {renderInfoBadge(
                          "Enable XDP for network acceleration",
                          <></>
                        )}
                      </Label>
                      <Switch
                        checked={formState.network.xdpAcceleration}
                        onCheckedChange={(checked) =>
                          updateFormState("network", "xdpAcceleration", checked)
                        }
                      />
                    </div>
                  </div>
                </>
              </div>
              <Button onClick={handleSave} disabled={!saveButtonEnabled}>
                Save
              </Button>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>
                      Detailed Monitoring{" "}
                      {renderInfoBadge(
                        "Enable enhanced metrics collection",
                        <></>
                      )}
                    </Label>
                    <Switch
                      checked={formState.monitoring.detailedMonitoring}
                      onCheckedChange={(checked) =>
                        updateFormState(
                          "monitoring",
                          "detailedMonitoring",
                          checked
                        )
                      }
                    />
                  </div>
                </div>

                <>
                  <div className="space-y-2">
                    <Label>Custom Metrics Endpoint</Label>
                    <Input placeholder="http://metrics:9090" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>
                        Runtime Metrics{" "}
                        {renderInfoBadge("Collect container runtime metrics", <></>)}
                      </Label>
                      <Switch
                        checked={formState.monitoring.runtimeMetrics}
                        onCheckedChange={(checked) =>
                          updateFormState(
                            "monitoring",
                            "runtimeMetrics",
                            checked
                          )
                        }
                      />
                    </div>
                  </div>
                </>
              </div>
              <Button onClick={handleSave} disabled={!saveButtonEnabled}>
                Save
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </GlassCard>
    </div>
  );
}
