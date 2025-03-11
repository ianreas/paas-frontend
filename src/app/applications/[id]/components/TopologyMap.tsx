import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { GlassCard } from '@/app/components/ui/CustomCards';

// Types
type ServiceNode = {
  id: string;
  name: string;
  namespace: string;
  type: string;
  podsCount: number;
  isHealthy: boolean;
  x?: number;
  y?: number;
};

type ServiceConnection = {
  source: string;
  target: string;
  requestsPerSecond?: number;
  errorRate?: number;
};

type TopologyData = {
  nodes: ServiceNode[];
  connections: ServiceConnection[];
};

const ClusterVisualizer = () => {
  const svgRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [topology, setTopology] = useState<TopologyData | null>(null);
  const [selectedNamespace, setSelectedNamespace] = useState('default');
  const [namespaces, setNamespaces] = useState(['default']);
  const [error, setError] = useState<string | null>(null);

  // Fetch namespaces (this would be a real API call)
  useEffect(() => {
    // Simulate fetching namespaces
    const fetchNamespaces = async () => {
      try {
        // In a real app, this would be an API call
        const mockNamespaces = ['default', 'user1', 'user2', 'user3'];
        setNamespaces(mockNamespaces);
      } catch (err) {
        setError('Failed to fetch namespaces');
      }
    };

    fetchNamespaces();
  }, []);

  // Fetch topology data when namespace changes
  useEffect(() => {
    const fetchTopology = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call to your backend
        // const response = await fetch(`/api/v1/topology/${selectedNamespace}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData: TopologyData = {
          nodes: [
            { id: '1', name: 'frontend', namespace: selectedNamespace, type: 'service', podsCount: 2, isHealthy: true },
            { id: '2', name: 'api-gateway', namespace: selectedNamespace, type: 'service', podsCount: 1, isHealthy: true },
            { id: '3', name: 'auth-service', namespace: selectedNamespace, type: 'service', podsCount: 1, isHealthy: true },
            { id: '4', name: 'user-service', namespace: selectedNamespace, type: 'service', podsCount: 1, isHealthy: false },
            { id: '5', name: 'payment-service', namespace: selectedNamespace, type: 'service', podsCount: 1, isHealthy: true },
            { id: '6', name: 'database', namespace: selectedNamespace, type: 'statefulset', podsCount: 1, isHealthy: true },
          ],
          connections: [
            { source: '1', target: '2', requestsPerSecond: 15.2, errorRate: 0.01 },
            { source: '2', target: '3', requestsPerSecond: 8.7, errorRate: 0.02 },
            { source: '2', target: '4', requestsPerSecond: 12.3, errorRate: 0.15 },
            { source: '2', target: '5', requestsPerSecond: 5.8, errorRate: 0.0 },
            { source: '3', target: '6', requestsPerSecond: 3.2, errorRate: 0.0 },
            { source: '4', target: '6', requestsPerSecond: 4.6, errorRate: 0.05 },
            { source: '5', target: '6', requestsPerSecond: 2.1, errorRate: 0.0 },
          ]
        };
        
        setTopology(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch topology data');
      } finally {
        setLoading(false);
      }
    };

    fetchTopology();
  }, [selectedNamespace]);

  // Create the visualization
  useEffect(() => {
    if (!topology || loading || !svgRef.current) return;
  
    const width = 800;
    const height = 600;
    
    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto; font: 12px sans-serif;');
    
    // Add a gradient definition for links
    const defs = svg.append('defs');
    
    const gradient = defs.append('linearGradient')
      .attr('id', 'link-gradient')
      .attr('gradientUnits', 'userSpaceOnUse');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4CAF50');
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#2196F3');
  
    // Create a simulation
    const simulation = d3.forceSimulation(topology.nodes)
      .force('link', d3.forceLink(topology.connections)
        .id((d: any) => d.id)
        .distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60));
  
    // Create container for links
    const linkGroup = svg.append('g').attr('class', 'links');
    
    // Create container for arrows
    const arrowGroup = svg.append('g').attr('class', 'arrows');
  
    // Create the links
    const link = linkGroup.selectAll('path')
      .data(topology.connections)
      .join('path')
      .attr('stroke', 'url(#link-gradient)')
      .attr('stroke-width', d => Math.max(1, d.requestsPerSecond ? Math.log(d.requestsPerSecond) * 2 : 1))
      .attr('fill', 'none')
      .attr('data-source', d => d.source)
      .attr('data-target', d => d.target);
    
    // Create the arrows 
    const arrow = arrowGroup.selectAll('path')
      .data(topology.connections)
      .join('path')
      .attr('fill', '#2196F3')
      .attr('stroke', 'none');
  
    // Create the nodes
    const nodeGroup = svg.append('g')
      .selectAll('g')
      .data(topology.nodes)
      .join('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);
    
    // Add circles for the nodes
    nodeGroup.append('circle')
      .attr('r', d => d.podsCount > 1 ? 35 : 30)
      .attr('fill', d => d.isHealthy ? '#4CAF50' : '#F44336')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    // Add icon or text inside the circle
    nodeGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .text(d => d.name.substring(0, 2).toUpperCase());
  
    // Add service name below the circle
    nodeGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 50)
      .attr('fill', '#333')
      .text(d => d.name);
  
    // Add pod count badge
    nodeGroup.append('circle')
      .attr('cx', 25)
      .attr('cy', -25)
      .attr('r', 12)
      .attr('fill', '#673AB7');
    
    nodeGroup.append('text')
      .attr('x', 25)
      .attr('y', -25)
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text(d => d.podsCount);
  
    // Update positions on simulation tick
    simulation.on('tick', () => {
      // Update link paths
      link.attr('d', (d: any) => {
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        
        // Calculate distance
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const dr = Math.sqrt(dx * dx + dy * dy);
        
        // Create a curved path
        return `M${sourceX},${sourceY}A${dr*1.2},${dr*1.2} 0 0,1 ${targetX},${targetY}`;
      });
  
      // Update arrow positions
      arrow.attr('d', (d: any) => {
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        
        // Calculate the midpoint of the link
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const dr = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate the target radius to stop the arrow before hitting it
        const targetRadius = d.target.podsCount > 1 ? 35 : 30;
        
        // Calculate the point on the curve near the target
        const t = 1 - (targetRadius / dr);
        const curveX = sourceX + dx * t;
        const curveY = sourceY + dy * t;
        
        // Calculate the angle for the arrow
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
        
        // Create triangle arrow
        return `M${curveX},${curveY}
                L${curveX - 12 * Math.cos(angle - Math.PI/6)},${curveY - 12 * Math.sin(angle - Math.PI/6)} 
                L${curveX - 12 * Math.cos(angle + Math.PI/6)},${curveY - 12 * Math.sin(angle + Math.PI/6)}
                Z`;
      });
  
      // Update node positions
      nodeGroup.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });
  
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
  
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
  
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  
    // Cleanup on component unmount
    return () => {
      simulation.stop();
    };
  }, [topology, loading]);

  const handleRefresh = () => {
    setLoading(true);
    // This would trigger a new fetch in the useEffect
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <GlassCard>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-medium text-gray-800">
            Cluster Visualization
          </CardTitle>
          <div className="flex gap-2 items-center">
            <Select
              value={selectedNamespace}
              onValueChange={setSelectedNamespace}
            >
              <SelectTrigger className="w-[180px] bg-white/50">
                <SelectValue placeholder="Select namespace" />
              </SelectTrigger>
              <SelectContent>
                {namespaces.map(ns => (
                  <SelectItem key={ns} value={ns}>{ns}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline"
              onClick={handleRefresh}
              className="bg-white/50"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center justify-center h-96 text-red-500">
            {error}
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="mt-4 text-gray-500">Loading cluster topology...</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white/70 shadow-sm">
            <svg ref={svgRef} width="100%" height="600" />
          </div>
        )}
      </CardContent>
    </GlassCard>
  );
};

export default ClusterVisualizer;