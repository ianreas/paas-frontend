// "use client";

// import React, {
//   useEffect,
//   useRef,
//   useState,
//   useCallback,
//   useMemo,
// } from "react";
// import * as d3 from "d3";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Loader2,
//   Search,
//   SlidersHorizontal,
//   ZoomIn,
//   ZoomOut,
//   Maximize,
//   RefreshCw,
// } from "lucide-react";
// import { GlassCard } from "@/app/components/ui/CustomCards";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Badge } from "@/components/ui/badge";
// import ServiceDetailsPanel from "./ServiceDetailsPanel";
// import {
//   TopologyData,
//   ServiceNode,
//   ServiceConnection,
//   ServiceMetrics,
//   TopologyMessage,
// } from "@/types/topology";
// import { useWebSocket } from "@/hooks/use-websocket";
// import { useToast } from "@/hooks/use-toast";
// import { useSession } from "next-auth/react";
// import { Separator } from "@/components/ui/separator";
// import { debounce } from "lodash";

// interface KubernetesTopologyProps {
//   namespace: string;
// }

// const KubernetesTopology: React.FC<KubernetesTopologyProps> = ({
//   namespace,
// }) => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [topology, setTopology] = useState<TopologyData | null>(null);
//   const [selectedNode, setSelectedNode] = useState<ServiceNode | null>(null);
//   const [selectedNodeMetrics, setSelectedNodeMetrics] =
//     useState<ServiceMetrics | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [errorServices, setErrorServices] = useState<Set<string>>(new Set());
//   const [showLabels, setShowLabels] = useState(true);
//   const [showStats, setShowStats] = useState(true);
//   const [autoRefresh, setAutoRefresh] = useState(true);
//   const simulationRef = useRef<d3.Simulation<
//     d3.SimulationNodeDatum,
//     undefined
//   > | null>(null);
//   const zoomRef = useRef<d3.ZoomBehavior<Element, unknown> | null>(null);
//   const { toast } = useToast();
//   const { data: session } = useSession();
//   const userId = session?.user?.id || "";

//   // WebSocket connection for real-time updates
//   const wsUrl = `${
//     process.env.NEXT_PUBLIC_WS_URL || "wss://api.example.com"
//   }/api/v1/ws/topology/${userId}`;
//   const { status: wsStatus, data: wsData } = useWebSocket<TopologyMessage>(
//     wsUrl,
//     handleWebSocketMessage
//   );

//   // Function to handle topology updates from WebSocket
//   function handleWebSocketMessage(message: TopologyMessage) {
//     if (message.type === "topology_update") {
//       const topologyData = message.data as TopologyData;
//       // Preserve node positions when updating
//       if (topology?.nodes) {
//         const positionMap = new Map(
//           topology.nodes.map((node) => [node.id, { x: node.x, y: node.y }])
//         );

//         topologyData.nodes.forEach((node) => {
//           const pos = positionMap.get(node.id);
//           if (pos) {
//             node.x = pos.x;
//             node.y = pos.y;
//           }
//         });
//       }

//       setTopology(topologyData);
//       setLoading(false);
//     } else if (message.type === "metrics_update") {
//       const metrics = message.data as ServiceMetrics[];

//       // Update error services set
//       const newErrorServices = new Set<string>();
//       metrics.forEach((metric) => {
//         if (metric.status === "unhealthy" || metric.errorRate > 0.05) {
//           newErrorServices.add(metric.serviceId);
//         }
//       });
//       setErrorServices(newErrorServices);

//       // Update metrics for selected node if it exists
//       if (selectedNode) {
//         const nodeMetrics = metrics.find(
//           (m) => m.serviceId === selectedNode.id
//         );
//         if (nodeMetrics) {
//           setSelectedNodeMetrics(nodeMetrics);
//         }
//       }
//     } else if (message.type === "error") {
//       const errorData = message.data as { message: string };
//       toast({
//         title: "WebSocket Error",
//         description: errorData.message,
//         variant: "destructive",
//       });
//     }
//   }

//   // Initial data fetch
//   useEffect(() => {
//     const fetchTopology = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(`/api/v1/topology/${namespace}`);

//         if (!response.ok) {
//           throw new Error(`Failed to fetch topology: ${response.statusText}`);
//         }

//         const data = await response.json();
//         setTopology(data);
//         setError(null);
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : "An unknown error occurred";
//         toast({
//           title: "Failed to fetch topology data",
//           description: errorMessage,
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTopology();
//   }, [namespace, toast]);

//   // Filter nodes based on search
//   const filteredTopology = useMemo(() => {
//     if (!topology) return null;
//     if (!searchQuery.trim()) return topology;

//     const query = searchQuery.toLowerCase();
//     const filteredNodes = topology.nodes.filter(
//       (node) =>
//         node.name.toLowerCase().includes(query) ||
//         node.type.toLowerCase().includes(query)
//     );

//     const nodeIds = new Set(filteredNodes.map((node) => node.id));

//     const filteredConnections = topology.connections.filter(
//       (conn) => nodeIds.has(conn.source) && nodeIds.has(conn.target)
//     );

//     return {
//       nodes: filteredNodes,
//       connections: filteredConnections,
//     };
//   }, [topology, searchQuery]);

//   // D3 visualization
//   useEffect(() => {
//     if (
//       !filteredTopology ||
//       loading ||
//       !svgRef.current ||
//       !containerRef.current
//     )
//       return;

//     // Get container dimensions
//     const containerRect = containerRef.current.getBoundingClientRect();
//     const width = containerRect.width;
//     const height = containerRect.height;

//     // Clear previous SVG content
//     d3.select(svgRef.current).selectAll("*").remove();

//     const svg = d3
//       .select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height)
//       .attr("viewBox", [0, 0, width, height])
//       .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif;");

//     // Add a zoom behavior
//     const zoom = d3
//       .zoom<SVGSVGElement, unknown>()
//       .scaleExtent([0.5, 5])
//       .on("zoom", (event) => {
//         g.attr("transform", event.transform);
//       });

//     svg.call(zoom as any);
//     zoomRef.current = zoom;

//     // Create a container group that will be transformed
//     const g = svg.append("g");

//     // Add a gradient definition for links
//     const defs = svg.append("defs");

//     // Add gradient for links
//     const gradient = defs
//       .append("linearGradient")
//       .attr("id", "link-gradient")
//       .attr("gradientUnits", "userSpaceOnUse");

//     gradient.append("stop").attr("offset", "0%").attr("stop-color", "#4CAF50");

//     gradient
//       .append("stop")
//       .attr("offset", "100%")
//       .attr("stop-color", "#2196F3");

//     // Create a simulation
//     const simulation = d3
//       .forceSimulation(filteredTopology.nodes as d3.SimulationNodeDatum[])
//       .force(
//         "link",
//         d3
//           .forceLink(filteredTopology.connections)
//           .id((d: any) => d.id)
//           .distance(150)
//       )
//       .force("charge", d3.forceManyBody().strength(-500))
//       .force("center", d3.forceCenter(width / 2, height / 2))
//       .force("collision", d3.forceCollide().radius(60));

//     simulationRef.current = simulation;

//     // Create container for links
//     const linkGroup = g.append("g").attr("class", "links");

//     // Create container for arrows
//     const arrowGroup = g.append("g").attr("class", "arrows");

//     // Create the links
//     const link = linkGroup
//       .selectAll("path")
//       .data(filteredTopology.connections)
//       .join("path")
//       .attr("stroke", (d) => {
//         // Check if either source or target is in error state
//         const sourceId = typeof d.source === "object" ? d.source.id : d.source;
//         const targetId = typeof d.target === "object" ? d.target.id : d.target;

//         if (errorServices.has(sourceId) || errorServices.has(targetId)) {
//           return "#F43F5E"; // Red color for error state
//         }

//         return "url(#link-gradient)";
//       })
//       .attr("stroke-width", (d) =>
//         Math.max(1, d.requestsPerSecond ? Math.log(d.requestsPerSecond) * 2 : 1)
//       )
//       .attr("stroke-dasharray", (d) => {
//         const sourceId = typeof d.source === "object" ? d.source.id : d.source;
//         const targetId = typeof d.target === "object" ? d.target.id : d.target;

//         // Dashed line for connections with errors
//         if (
//           (d.errorRate && d.errorRate > 0.05) ||
//           errorServices.has(sourceId) ||
//           errorServices.has(targetId)
//         ) {
//           return "5,5";
//         }
//         return "none";
//       })
//       .attr("fill", "none")
//       .attr("data-source", (d) =>
//         typeof d.source === "object" ? d.source.id : d.source
//       )
//       .attr("data-target", (d) =>
//         typeof d.target === "object" ? d.target.id : d.target
//       )
//       .on("mouseover", function () {
//         d3.select(this).attr("stroke-width", (d) =>
//           Math.max(
//             3,
//             d.requestsPerSecond ? Math.log(d.requestsPerSecond) * 3 : 3
//           )
//         );
//       })
//       .on("mouseout", function () {
//         d3.select(this).attr("stroke-width", (d) =>
//           Math.max(
//             1,
//             d.requestsPerSecond ? Math.log(d.requestsPerSecond) * 2 : 1
//           )
//         );
//       });

//     // Create the arrows
//     const arrow = arrowGroup
//       .selectAll("path")
//       .data(filteredTopology.connections)
//       .join("path")
//       .attr("fill", (d) => {
//         const sourceId = typeof d.source === "object" ? d.source.id : d.source;
//         const targetId = typeof d.target === "object" ? d.target.id : d.target;

//         if (errorServices.has(sourceId) || errorServices.has(targetId)) {
//           return "#F43F5E"; // Red for error
//         }
//         return "#2196F3";
//       })
//       .attr("stroke", "none");

//     // Create the nodes
//     const nodeGroup = g
//       .append("g")
//       .selectAll("g")
//       .data(filteredTopology.nodes)
//       .join("g")
//       .attr("class", "node")
//       .attr("data-id", (d) => d.id)
//       .call(
//         d3
//           .drag<SVGGElement, ServiceNode>()
//           .on("start", dragstarted)
//           .on("drag", dragged)
//           .on("end", dragended) as any
//       )
//       .on("click", (event, d) => {
//         event.stopPropagation(); // Prevent the click from propagating
//         handleNodeSelect(d);
//       });

//     // Add circles for the nodes
//     nodeGroup
//       .append("circle")
//       .attr("r", (d) => (d.podsCount > 1 ? 35 : 30))
//       .attr("fill", (d) => {
//         if (!d.isHealthy || errorServices.has(d.id)) {
//           return "#F44336"; // Red for error
//         }

//         // Service type based coloring
//         switch (d.type.toLowerCase()) {
//           case "deployment":
//           case "service":
//             return "#4CAF50"; // Green
//           case "statefulset":
//             return "#9C27B0"; // Purple
//           case "daemonset":
//             return "#FF9800"; // Orange
//           case "pod":
//             return "#03A9F4"; // Blue
//           default:
//             return "#607D8B"; // Gray
//         }
//       })
//       .attr("stroke", (d) =>
//         selectedNode && d.id === selectedNode.id ? "#FFF200" : "#fff"
//       )
//       .attr("stroke-width", (d) =>
//         selectedNode && d.id === selectedNode.id ? 4 : 2
//       );

//     // Add icon or text inside the circle
//     nodeGroup
//       .append("text")
//       .attr("text-anchor", "middle")
//       .attr("dy", ".3em")
//       .attr("fill", "white")
//       .attr("font-weight", "bold")
//       .text((d) => d.name.substring(0, 2).toUpperCase());

//     // Add service name below the circle if showLabels is true
//     if (showLabels) {
//       nodeGroup
//         .append("text")
//         .attr("text-anchor", "middle")
//         .attr("dy", 50)
//         .attr("fill", "#333")
//         .attr("font-size", "12px")
//         .text((d) => d.name);
//     }

//     // Add pod count badge
//     nodeGroup
//       .append("circle")
//       .attr("cx", 25)
//       .attr("cy", -25)
//       .attr("r", 12)
//       .attr("fill", "#673AB7");

//     nodeGroup
//       .append("text")
//       .attr("x", 25)
//       .attr("y", -25)
//       .attr("text-anchor", "middle")
//       .attr("dy", ".3em")
//       .attr("fill", "white")
//       .attr("font-size", "10px")
//       .attr("font-weight", "bold")
//       .text((d) => d.podsCount);

//     // Add request rate indicator if showStats is true
//     if (showStats) {
//       nodeGroup
//         .append("text")
//         .attr("text-anchor", "middle")
//         .attr("dy", 65)
//         .attr("fill", "#666")
//         .attr("font-size", "10px")
//         .text((d) => {
//           const outgoingConns = filteredTopology.connections.filter(
//             (c) => c.source === d.id
//           );
//           const totalRPS = outgoingConns.reduce(
//             (sum, conn) => sum + (conn.requestsPerSecond || 0),
//             0
//           );
//           return totalRPS > 0 ? `${totalRPS.toFixed(1)} req/s` : "";
//         });
//     }

//     // Update positions on simulation tick
//     simulation.on("tick", () => {
//       // Update link paths
//       link.attr("d", (d: any) => {
//         const sourceX = d.source.x;
//         const sourceY = d.source.y;
//         const targetX = d.target.x;
//         const targetY = d.target.y;

//         // Calculate distance
//         const dx = targetX - sourceX;
//         const dy = targetY - sourceY;
//         const dr = Math.sqrt(dx * dx + dy * dy);

//         // Create a curved path
//         return `M${sourceX},${sourceY}A${dr * 1.2},${
//           dr * 1.2
//         } 0 0,1 ${targetX},${targetY}`;
//       });

//       // Update arrow positions
//       arrow.attr("d", (d: any) => {
//         const sourceX = d.source.x;
//         const sourceY = d.source.y;
//         const targetX = d.target.x;
//         const targetY = d.target.y;

//         // Calculate the midpoint of the link
//         const dx = targetX - sourceX;
//         const dy = targetY - sourceY;
//         const dr = Math.sqrt(dx * dx + dy * dy);

//         // Calculate the target radius to stop the arrow before hitting it
//         const targetRadius = d.target.podsCount > 1 ? 35 : 30;

//         // Calculate the point on the curve near the target
//         const t = 1 - targetRadius / dr;
//         const curveX = sourceX + dx * t;
//         const curveY = sourceY + dy * t;

//         // Calculate the angle for the arrow
//         const angle = Math.atan2(targetY - sourceY, targetX - sourceX);

//         // Create triangle arrow
//         return `M${curveX},${curveY}
//                 L${curveX - 12 * Math.cos(angle - Math.PI / 6)},${
//           curveY - 12 * Math.sin(angle - Math.PI / 6)
//         } 
//                 L${curveX - 12 * Math.cos(angle + Math.PI / 6)},${
//           curveY - 12 * Math.sin(angle + Math.PI / 6)
//         }
//                 Z`;
//       });

//       // Update node positions
//       nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
//     });

//     function dragstarted(event: any, d: any) {
//       if (!event.active) simulation.alphaTarget(0.3).restart();
//       d.fx = d.x;
//       d.fy = d.y;
//     }

//     function dragged(event: any, d: any) {
//       d.fx = event.x;
//       d.fy = event.y;
//     }

//     function dragended(event: any, d: any) {
//       if (!event.active) simulation.alphaTarget(0);
//       // Don't release fixed position to keep the node where the user dragged it
//       // d.fx = null;
//       // d.fy = null;
//     }

//     // Close service details when clicking on the background
//     svg.on("click", () => {
//       setSelectedNode(null);
//       setSelectedNodeMetrics(null);
//     });

//     // Cleanup on component unmount
//     return () => {
//       if (simulationRef.current) {
//         simulationRef.current.stop();
//       }
//     };
//   }, [
//     filteredTopology,
//     loading,
//     errorServices,
//     showLabels,
//     showStats,
//     selectedNode,
//   ]);

//   // Function to handle node selection
//   const handleNodeSelect = useCallback(
//     async (node: ServiceNode) => {
//       setSelectedNode(node);

//       // Fetch detailed metrics for the selected node
//       try {
//         const response = await fetch(
//           `/api/v1/service-metrics/${namespace}?serviceId=${node.id}`
//         );
//         if (response.ok) {
//           const metricsData = await response.json();
//           setSelectedNodeMetrics(metricsData);
//         }
//       } catch (error) {
//         console.error("Failed to fetch service metrics:", error);
//       }
//     },
//     [namespace]
//   );

//   // Calculate connections for the selected node
//   const selectedNodeConnections = useMemo(() => {
//     if (!selectedNode || !topology) return { incoming: [], outgoing: [] };

//     const incoming = topology.connections
//       .filter((conn) => conn.target === selectedNode.id)
//       .map((conn) => {
//         const sourceNode = topology.nodes.find(
//           (node) => node.id === conn.source
//         );
//         return {
//           name: sourceNode?.name || "Unknown",
//           requestsPerSecond: conn.requestsPerSecond,
//           errorRate: conn.errorRate,
//         };
//       });

//     const outgoing = topology.connections
//       .filter((conn) => conn.source === selectedNode.id)
//       .map((conn) => {
//         const targetNode = topology.nodes.find(
//           (node) => node.id === conn.target
//         );
//         return {
//           name: targetNode?.name || "Unknown",
//           requestsPerSecond: conn.requestsPerSecond,
//           errorRate: conn.errorRate,
//         };
//       });

//     return { incoming, outgoing };
//   }, [selectedNode, topology]);

//   // Handle search input
//   const handleSearch = debounce((value: string) => {
//     setSearchQuery(value);
//   }, 300);

//   // Zoom controls
//   const handleZoomIn = () => {
//     if (zoomRef.current && svgRef.current) {
//       d3.select(svgRef.current)
//         .transition()
//         .call(zoomRef.current.scaleBy as any, 1.5);
//     }
//   };

//   const handleZoomOut = () => {
//     if (zoomRef.current && svgRef.current) {
//       d3.select(svgRef.current)
//         .transition()
//         .call(zoomRef.current.scaleBy as any, 0.67);
//     }
//   };

//   const handleZoomReset = () => {
//     if (zoomRef.current && svgRef.current) {
//       d3.select(svgRef.current)
//         .transition()
//         .call(zoomRef.current.transform as any, d3.zoomIdentity);
//     }
//   };

//   // Handle refresh
//   const handleRefresh = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`/api/v1/topology/${namespace}`);

//       if (!response.ok) {
//         throw new Error(`Failed to fetch topology: ${response.statusText}`);
//       }

//       const data = await response.json();

//       // Preserve node positions when refreshing
//       if (topology?.nodes) {
//         const positionMap = new Map(
//           topology.nodes.map((node) => [node.id, { x: node.x, y: node.y }])
//         );

//         data.nodes.forEach((node: ServiceNode) => {
//           const pos = positionMap.get(node.id);
//           if (pos) {
//             node.x = pos.x;
//             node.y = pos.y;
//           }
//         });
//       }

//       setTopology(data);
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "An unknown error occurred";
//       toast({
//         title: "Failed to refresh topology data",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <GlassCard>
//       <CardHeader className="pb-2">
//         <div className="flex justify-between items-center">
//           <div>
//             <CardTitle className="text-2xl font-medium text-gray-800">
//               Kubernetes Service Map
//             </CardTitle>
//             <CardDescription className="text-muted-foreground">
//               Real-time visualization of services in namespace:{" "}
//               <span className="font-semibold">{namespace}</span>
//             </CardDescription>
//           </div>
//           <div className="flex items-center gap-2">
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Badge
//                     variant={wsStatus === "open" ? "default" : "destructive"}
//                     className="gap-1"
//                   >
//                     <span
//                       className={`w-2 h-2 rounded-full ${
//                         wsStatus === "open" ? "bg-green-400" : "bg-red-400"
//                       }`}
//                     />
//                     {wsStatus === "open" ? "Live" : "Disconnected"}
//                   </Badge>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   {wsStatus === "open"
//                     ? "Connected to real-time updates"
//                     : "Not connected to real-time updates. Data may be stale."}
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleRefresh}
//               className="bg-white/50"
//               disabled={loading}
//             >
//               {loading ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <RefreshCw className="h-4 w-4" />
//               )}
//             </Button>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="p-0">
//         <div className="p-4 flex items-center justify-between bg-white/10 border-y">
//           <div className="relative w-64">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search services..."
//               className="pl-8 bg-white/50"
//               onChange={(e) => handleSearch(e.target.value)}
//             />
//           </div>

//           <div className="flex items-center gap-6">
//             <div className="flex items-center space-x-2">
//               <Switch
//                 id="show-labels"
//                 checked={showLabels}
//                 onCheckedChange={setShowLabels}
//               />
//               <Label htmlFor="show-labels">Labels</Label>
//             </div>

//             <div className="flex items-center space-x-2">
//               <Switch
//                 id="show-stats"
//                 checked={showStats}
//                 onCheckedChange={setShowStats}
//               />
//               <Label htmlFor="show-stats">Stats</Label>
//             </div>

//             <div className="flex items-center space-x-2">
//               <Switch
//                 id="auto-refresh"
//                 checked={autoRefresh}
//                 onCheckedChange={setAutoRefresh}
//               />
//               <Label htmlFor="auto-refresh">Auto-refresh</Label>
//             </div>

//             <Separator orientation="vertical" className="h-6" />

//             {/* Zoom Controls */}
//             <div className="flex items-center space-x-1">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={handleZoomIn}
//                 className="w-8 h-8 bg-white/50"
//               >
//                 <ZoomIn className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={handleZoomOut}
//                 className="w-8 h-8 bg-white/50"
//               >
//                 <ZoomOut className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={handleZoomReset}
//                 className="w-8 h-8 bg-white/50"
//               >
//                 <Maximize className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-12 gap-4 p-4">
//           {/* Main visualization area */}
//           <div className="col-span-12 lg:col-span-8 xl:col-span-9 relative">
//             <div
//               ref={containerRef}
//               className="w-full h-[calc(100vh-300px)] overflow-hidden rounded-xl border border-gray-100 bg-white/70 shadow-sm"
//             >
//               {error ? (
//                 <div className="flex items-center justify-center h-full text-red-500">
//                   {error}
//                 </div>
//               ) : loading ? (
//                 <div className="flex flex-col items-center justify-center h-full">
//                   <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
//                   <p className="mt-4 text-gray-500">
//                     Loading service topology...
//                   </p>
//                 </div>
//               ) : (
//                 <svg ref={svgRef} width="100%" height="100%" />
//               )}
//             </div>

//             {/* Service count summary */}
//             {filteredTopology && (
//               <div className="mt-2 text-sm text-gray-500 flex gap-4">
//                 <span>
//                   <span className="font-medium">
//                     {filteredTopology.nodes.length}
//                   </span>{" "}
//                   services
//                 </span>
//                 <span>
//                   <span className="font-medium">
//                     {filteredTopology.connections.length}
//                   </span>{" "}
//                   connections
//                 </span>
//                 {searchQuery && (
//                   <span className="text-blue-500">
//                     Filtered by: "{searchQuery}"
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Service Details Panel */}
//           <div className="col-span-12 lg:col-span-4 xl:col-span-3">
//             {selectedNode ? (
//               <ServiceDetailsPanel
//                 selectedNode={selectedNode}
//                 metrics={selectedNodeMetrics || undefined}
//                 connections={selectedNodeConnections}
//                 onClose={() => setSelectedNode(null)}
//               />
//             ) : (
//               <Card className="bg-white/80 h-full flex items-center justify-center p-6 text-center border-dashed border-2">
//                 <div className="space-y-3">
//                   <SlidersHorizontal className="mx-auto h-10 w-10 text-gray-400" />
//                   <h3 className="text-lg font-medium">No Service Selected</h3>
//                   <p className="text-sm text-gray-500">
//                     Click on any service in the visualization to view detailed
//                     metrics and information.
//                   </p>
//                 </div>
//               </Card>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </GlassCard>
//   );
// };

// export default KubernetesTopology;
