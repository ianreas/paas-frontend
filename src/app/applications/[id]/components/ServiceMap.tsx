// components/ServiceMap.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import react-force-graph to avoid SSR issues
const ForceGraph2D = dynamic(
  () => import("react-force-graph").then((mod) => mod.ForceGraph2D),
  { ssr: false }
);

type NodeData = { id: string };
type EdgeData = {
  source: string;
  target: string;
  rps: number;
  latency: number;
};

export default function ServiceMap({ namespace }: { namespace: string }) {
  const [data, setData] = useState<{ nodes: NodeData[]; links: EdgeData[] }>({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    try {
      fetch(`/api/service-map?namespace=${namespace}`)
        .then((res) => {
          const response = res.json();
          console.log(`response was ${JSON.stringify(response)}`);
          return response;
        })
        .then((json) =>
          setData({
            nodes: json.nodes,
            links: json.edges, // Transform edges to links
          })
        );
    } catch (error) {
      console.error("Error fetching service map data:", error);
    }
  }, [namespace]);

  useEffect(() => {
    console.log(`the data set was ${JSON.stringify(data)}`);
  }, [data]);

  return (
    <div className="w-full h-96 border rounded">
      {data.nodes.length > 0 ? (
        <ForceGraph2D
          graphData={data}
          nodeAutoColorBy="id"
          linkDirectionalArrowLength={6}
          nodeLabel="id"
          linkLabel={(link: any) =>
            `RPS: ${link.rps}, Latency: ${link.latency}ms`
          }
        />
      ) : (
        <div className="p-4">Loading service map...</div>
      )}
    </div>
  );
}
