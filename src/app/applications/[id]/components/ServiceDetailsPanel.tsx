"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CircleOff,
  CircleCheck,
  AlertCircle,
  Server,
  Cpu,
  Clock,
  Network,
  ArrowDownUp,
  MessageCircle,
  MemoryStick,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ServiceNode, ServiceMetrics } from "@/types/topology";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Mock time-series data for the charts
const generateMockTimeSeriesData = (baseline: number, dataPoints = 10) => {
  return Array.from({ length: dataPoints }, (_, i) => {
    const time = new Date(
      Date.now() - (dataPoints - i) * 60000
    ).toLocaleTimeString();
    // Generate a value with some random variation around the baseline
    const value = Math.max(0, baseline * (0.7 + Math.random() * 0.6));
    return { time, value };
  });
};

interface ServiceDetailsPanelProps {
  selectedNode: ServiceNode | null;
  metrics?: ServiceMetrics;
  connections: {
    incoming: {
      name: string;
      requestsPerSecond?: number;
      errorRate?: number;
    }[];
    outgoing: {
      name: string;
      requestsPerSecond?: number;
      errorRate?: number;
    }[];
  };
  onClose: () => void;
}

const ServiceDetailsPanel: React.FC<ServiceDetailsPanelProps> = ({
  selectedNode,
  metrics,
  connections,
  onClose,
}) => {
  if (!selectedNode) return null;

  const requestRateData = generateMockTimeSeriesData(
    metrics?.requestRate || 10
  );
  const errorRateData = generateMockTimeSeriesData(metrics?.errorRate || 0.02);
  const latencyData = generateMockTimeSeriesData(metrics?.latency?.p50 || 25);
  const cpuData = generateMockTimeSeriesData(metrics?.cpu?.usage || 40);
  const memoryData = generateMockTimeSeriesData(metrics?.memory?.usage || 60);

  // Status badge appearance
  const statusBadge = () => {
    if (!selectedNode.isHealthy) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <CircleOff className="h-3 w-3" />
          Unhealthy
        </Badge>
      );
    }

    if (metrics?.status === "degraded") {
      return (
        <Badge
          variant="destructive"
          className="flex items-center gap-1 bg-yellow-500"
        >
          <AlertCircle className="h-3 w-3" />
          Degraded
        </Badge>
      );
    }

    return (
      <Badge variant="default" className="flex items-center gap-1 bg-green-500">
        <CircleCheck className="h-3 w-3" />
        Healthy
      </Badge>
    );
  };

  return (
    <Card className="w-full bg-white shadow-lg border-l-4 border-l-blue-500 max-h-[calc(100vh-220px)] overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-semibold">
                {selectedNode.name}
              </CardTitle>
              {statusBadge()}
            </div>
            <CardDescription className="mt-1">
              {selectedNode.type} • {selectedNode.namespace} •{" "}
              {selectedNode.podsCount}{" "}
              {selectedNode.podsCount === 1 ? "pod" : "pods"}
            </CardDescription>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="Close details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="metrics" className="w-full">
          <div className="px-6 border-b">
            <TabsList className="mb-2">
              <TabsTrigger value="metrics" className="flex items-center gap-1">
                <Cpu className="h-4 w-4" />
                Metrics
              </TabsTrigger>
              <TabsTrigger
                value="connections"
                className="flex items-center gap-1"
              >
                <Network className="h-4 w-4" />
                Connections
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-1">
                <Server className="h-4 w-4" />
                Details
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="pt-5">
            <TabsContent value="metrics">
              <div className="space-y-5">
                {/* Resource Usage Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* CPU Usage */}
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm flex items-center gap-1">
                        <Cpu className="h-4 w-4 text-blue-500" />
                        CPU Usage
                      </h4>
                      <span className="text-sm font-bold text-blue-600">
                        {metrics?.cpu?.usage || 45}%
                      </span>
                    </div>
                    <Progress
                      value={metrics?.cpu?.usage || 45}
                      className="h-2"
                    />
                    <ResponsiveContainer width="100%" height={80}>
                      <AreaChart data={cpuData}>
                        <defs>
                          <linearGradient
                            id="cpuFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#3B82F6"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="100%"
                              stopColor="#3B82F6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#3B82F6"
                          fill="url(#cpuFill)"
                          strokeWidth={2}
                        />
                        <XAxis dataKey="time" tick={false} axisLine={false} />
                        <YAxis hide domain={[0, 100]} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Memory Usage */}
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm flex items-center gap-1">
                        <MemoryStick className="h-4 w-4 text-indigo-500" />
                        Memory Usage
                      </h4>
                      <span className="text-sm font-bold text-indigo-600">
                        {metrics?.memory?.usage || 60}%
                      </span>
                    </div>
                    <Progress
                      value={metrics?.memory?.usage || 60}
                      className="h-2"
                    />
                    <ResponsiveContainer width="100%" height={80}>
                      <AreaChart data={memoryData}>
                        <defs>
                          <linearGradient
                            id="memoryFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#6366F1"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="100%"
                              stopColor="#6366F1"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#6366F1"
                          fill="url(#memoryFill)"
                          strokeWidth={2}
                        />
                        <XAxis dataKey="time" tick={false} axisLine={false} />
                        <YAxis hide domain={[0, 100]} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Request Rate */}
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm flex items-center gap-1">
                        <ArrowDownUp className="h-4 w-4 text-green-500" />
                        Request Rate
                      </h4>
                      <span className="text-sm font-bold text-green-600">
                        {metrics?.requestRate || 12.5} req/s
                      </span>
                    </div>
                    <ResponsiveContainer width="100%" height={80}>
                      <AreaChart data={requestRateData}>
                        <defs>
                          <linearGradient
                            id="requestFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#10B981"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="100%"
                              stopColor="#10B981"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#10B981"
                          fill="url(#requestFill)"
                          strokeWidth={2}
                        />
                        <XAxis dataKey="time" tick={false} axisLine={false} />
                        <YAxis hide />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Error Rate */}
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        Error Rate
                      </h4>
                      <span className="text-sm font-bold text-red-600">
                        {metrics?.errorRate
                          ? (metrics.errorRate * 100).toFixed(2)
                          : "2.10"}
                        %
                      </span>
                    </div>
                    <ResponsiveContainer width="100%" height={80}>
                      <AreaChart data={errorRateData}>
                        <defs>
                          <linearGradient
                            id="errorFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#EF4444"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="100%"
                              stopColor="#EF4444"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#EF4444"
                          fill="url(#errorFill)"
                          strokeWidth={2}
                        />
                        <XAxis dataKey="time" tick={false} axisLine={false} />
                        <YAxis hide />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Latency */}
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm flex items-center gap-1">
                        <Clock className="h-4 w-4 text-amber-500" />
                        Latency
                      </h4>
                      <span className="text-sm font-bold text-amber-600">
                        {metrics?.latency?.p50 || 25} ms
                      </span>
                    </div>
                    <ResponsiveContainer width="100%" height={80}>
                      <AreaChart data={latencyData}>
                        <defs>
                          <linearGradient
                            id="latencyFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#F59E0B"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="100%"
                              stopColor="#F59E0B"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#F59E0B"
                          fill="url(#latencyFill)"
                          strokeWidth={2}
                        />
                        <XAxis dataKey="time" tick={false} axisLine={false} />
                        <YAxis hide />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="connections">
              <div className="space-y-6">
                {/* Incoming Connections */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-500"
                    >
                      <path d="M12 19V5"></path>
                      <path d="M5 12l7-7 7 7"></path>
                    </svg>
                    Incoming Connections ({connections.incoming.length})
                  </h3>

                  {connections.incoming.length > 0 ? (
                    <div className="space-y-2">
                      {connections.incoming.map((conn, i) => (
                        <div
                          key={i}
                          className="bg-slate-50 rounded-lg p-3 flex justify-between items-center"
                        >
                          <div className="font-medium">{conn.name}</div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500">
                              {conn.requestsPerSecond?.toFixed(1) || "0.0"}{" "}
                              req/s
                            </div>
                            <div
                              className={`text-sm ${
                                conn.errorRate && conn.errorRate > 0.05
                                  ? "text-red-500"
                                  : "text-gray-500"
                              }`}
                            >
                              {conn.errorRate
                                ? (conn.errorRate * 100).toFixed(2)
                                : "0.00"}
                              % errors
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 text-gray-400">
                      No incoming connections
                    </div>
                  )}
                </div>

                {/* Outgoing Connections */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <path d="M12 5v14"></path>
                      <path d="M19 12l-7 7-7-7"></path>
                    </svg>
                    Outgoing Connections ({connections.outgoing.length})
                  </h3>

                  {connections.outgoing.length > 0 ? (
                    <div className="space-y-2">
                      {connections.outgoing.map((conn, i) => (
                        <div
                          key={i}
                          className="bg-slate-50 rounded-lg p-3 flex justify-between items-center"
                        >
                          <div className="font-medium">{conn.name}</div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500">
                              {conn.requestsPerSecond?.toFixed(1) || "0.0"}{" "}
                              req/s
                            </div>
                            <div
                              className={`text-sm ${
                                conn.errorRate && conn.errorRate > 0.05
                                  ? "text-red-500"
                                  : "text-gray-500"
                              }`}
                            >
                              {conn.errorRate
                                ? (conn.errorRate * 100).toFixed(2)
                                : "0.00"}
                              % errors
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 text-gray-400">
                      No outgoing connections
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Service Type
                      </h4>
                      <p className="font-medium">{selectedNode.type}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Namespace
                      </h4>
                      <p className="font-medium">{selectedNode.namespace}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Pod Count
                      </h4>
                      <p className="font-medium">{selectedNode.podsCount}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Created
                      </h4>
                      <p className="font-medium">
                        {selectedNode.createdAt || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Status
                      </h4>
                      <p className="font-medium">
                        {selectedNode.status ||
                          (selectedNode.isHealthy ? "Healthy" : "Unhealthy")}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Service ID
                      </h4>
                      <p className="font-medium text-gray-600 text-sm">
                        {selectedNode.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resource Limits */}
                <div className="pt-3 border-t">
                  <h3 className="text-sm font-medium mb-3">Resource Limits</h3>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1 items-baseline">
                        <h4 className="text-xs font-medium text-gray-500">
                          CPU Limit
                        </h4>
                        <span className="text-xs text-gray-500">
                          {metrics?.cpu?.usage || 45}% of{" "}
                          {metrics?.cpu?.limit || 1000}m
                        </span>
                      </div>
                      <Progress
                        value={metrics?.cpu?.usage || 45}
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 items-baseline">
                        <h4 className="text-xs font-medium text-gray-500">
                          Memory Limit
                        </h4>
                        <span className="text-xs text-gray-500">
                          {metrics?.memory?.usage || 60}% of{" "}
                          {metrics?.memory?.limit || 512}Mi
                        </span>
                      </div>
                      <Progress
                        value={metrics?.memory?.usage || 60}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default ServiceDetailsPanel;
