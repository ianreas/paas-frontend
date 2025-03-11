/**
 * Represents a Kubernetes service node in the topology graph
 */
export interface ServiceNode {
  id: string;
  name: string;
  namespace: string;
  type: string; // 'service', 'deployment', 'pod', 'statefulset', etc.
  podsCount: number;
  isHealthy: boolean;
  status?: string;
  createdAt?: string;
  cpu?: {
    usage: number;
    limit: number;
  };
  memory?: {
    usage: number;
    limit: number;
  };
  // For D3 positioning
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

/**
 * Represents a connection between Kubernetes services
 */
export interface ServiceConnection {
  source: string;
  target: string;
  requestsPerSecond?: number;
  errorRate?: number;
  latency?: number; // in milliseconds
  protocol?: string; // 'HTTP', 'gRPC', 'TCP', etc.
}

/**
 * Complete topology data structure
 */
export interface TopologyData {
  nodes: ServiceNode[];
  connections: ServiceConnection[];
}

/**
 * Service metrics data
 */
export interface ServiceMetrics {
  serviceId: string;
  timestamp: string;
  requestRate: number;
  errorRate: number;
  latency: {
    p50: number;
    p90: number;
    p99: number;
  };
  cpu: {
    usage: number;
    limit: number;
  };
  memory: {
    usage: number;
    limit: number;
  };
  status: "healthy" | "degraded" | "unhealthy";
}

/**
 * WebSocket message for topology updates
 */
export interface TopologyMessage {
  type: "topology_update" | "metrics_update" | "error";
  data: TopologyData | ServiceMetrics[] | { message: string };
  timestamp: string;
}
