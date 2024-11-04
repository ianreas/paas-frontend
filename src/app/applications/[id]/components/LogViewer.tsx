"use client";

import { GlassCard } from "@/app/components/ui/CustomCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";

interface LogViewerProps {
  appName: string;
}

export default function LogViewer({ appName }: LogViewerProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Replace with your backend URL if needed
    const eventSource = new EventSource(
      `http://localhost:3005/logs/${appName}`
    );

    eventSource.addEventListener("log", (e: MessageEvent) => {
      setLogs((prevLogs) => [...prevLogs, e.data]);
    });

    eventSource.addEventListener("error", (e: MessageEvent) => {
      console.error("Error event received:", e.data);
      toast({
        title: "Log Streaming Error",
        description: e.data,
        variant: "destructive",
      });
      eventSource.close();
    });

    eventSource.onerror = (e) => {
      console.error("EventSource encountered an error:", e);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the log stream.",
        variant: "destructive",
      });
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [appName, toast]);

  // Auto-scroll to the bottom when new logs are added
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <GlassCard>
      <CardHeader>
        <CardTitle>Application Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <ScrollArea className="h-64 rounded-lg border border-white/20 bg-white/90">
            <div className="text-sm font-mono whitespace-pre-wrap">
              {logs.length === 0 && (
                <p className="text-center text-sm text-gray-500 mt-24">
                  No logs yet...
                </p>
              )}
              {logs.map((log, index) => (
                <p key={index}>{log}</p>
              ))}
              <div ref={logsEndRef} />
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </GlassCard>
  );
}
