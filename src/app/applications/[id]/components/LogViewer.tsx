// import React, { useEffect, useRef, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { useToast } from '@/hooks/use-toast';
// import { Badge } from '@/components/ui/badge';
// import { Terminal, Clock, Box } from 'lucide-react';

// interface LogEntry {
//   time: string;
//   stream: string;
//   log: string;
//   kubernetes: {
//     pod_name: string;
//     namespace_name: string;
//     container_name: string;
//     host: string;
//   };
// }

// interface LogViewerProps {
//   appName: string;
// }

// export default function LogViewer({ appName }: LogViewerProps) {
//   const [logs, setLogs] = useState<LogEntry[]>([]);
//   const { toast } = useToast();
//   const logsEndRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     let retryCount = 0;
//     const maxRetries = 3;

//     function connect() {
//         const eventSource = new EventSource(
//             `http://localhost:3005/logs/${appName}`
//         );

//         eventSource.addEventListener("log", (e: MessageEvent) => {
//             try {
//                 const parsedLog = JSON.parse(e.data) as LogEntry;
//                 setLogs((prevLogs) => [...prevLogs, parsedLog]);
//             } catch (error) {
//                 console.error("Failed to parse log:", error);
//             }
//         });

//         eventSource.addEventListener("error", (e: MessageEvent) => {
//             console.error("Error event received:", e);
//             eventSource.close();

//             if (retryCount < maxRetries) {
//                 retryCount++;
//                 setTimeout(() => {
//                     console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
//                     connect();
//                 }, 1000 * retryCount); // Exponential backoff
//             } else {
//                 toast({
//                     title: "Log Streaming Error",
//                     description: "Failed to receive logs after multiple attempts",
//                     variant: "destructive",
//                 });
//             }
//         });

//         return eventSource;
//     }

//     const eventSource = connect();

//     return () => {
//         eventSource.close();
//     };
// }, [appName, toast]);

//   useEffect(() => {
//     if (logsEndRef.current) {
//       logsEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [logs]);

//   const formatTime = (timestamp: string) => {
//     return new Date(timestamp).toLocaleTimeString();
//   };

//   return (
//     <Card className="w-full bg-white/95 backdrop-blur-sm shadow-lg">
//       <CardHeader className="border-b">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Terminal className="w-5 h-5" />
//             <CardTitle>Application Logs</CardTitle>
//           </div>
//           <Badge variant="outline" className="text-xs">
//             {appName}
//           </Badge>
//         </div>
//       </CardHeader>
//       <CardContent className="p-4">
//         <ScrollArea className="h-[500px] rounded-lg border bg-black/95 p-4">
//           {logs.length === 0 ? (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-gray-400">No logs available...</p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {logs.map((log, index) => (
//                 <div
//                   key={index}
//                   className="border border-gray-800 rounded-lg p-3 bg-gray-900/50 hover:bg-gray-900/80 transition-colors"
//                 >
//                   <div className="flex items-center gap-2 mb-2">
//                     <Clock className="w-4 h-4 text-gray-400" />
//                     <span className="text-xs text-gray-400">
//                       {formatTime(log.time)}
//                     </span>
//                     <Badge
//                       variant={log.stream === 'stdout' ? 'default' : 'destructive'}
//                       className="text-xs"
//                     >
//                       {log.stream}
//                     </Badge>
//                   </div>

//                   <div className="flex gap-2 mb-2">
//                     <Box className="w-4 h-4 text-gray-400" />
//                     <div className="text-xs text-gray-400">
//                       <span className="font-semibold">Pod:</span> {log.kubernetes.pod_name}
//                       <span className="mx-2">|</span>
//                       <span className="font-semibold">Container:</span> {log.kubernetes.container_name}
//                       <span className="mx-2">|</span>
//                       <span className="font-semibold">Namespace:</span> {log.kubernetes.namespace_name}
//                     </div>
//                   </div>

//                   <div className="font-mono text-sm text-gray-200 pl-6">
//                     {log.log}
//                   </div>
//                 </div>
//               ))}
//               <div ref={logsEndRef} />
//             </div>
//           )}
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   );
// }

// import React, { useEffect, useRef, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { useToast } from '@/hooks/use-toast';
// import { Badge } from '@/components/ui/badge';
// import { Terminal, Clock, Box } from 'lucide-react';

// interface LogEntry {
//   time: string;
//   stream: string;
//   log: string;
//   kubernetes: {
//     pod_name: string;
//     namespace_name: string;
//     container_name: string;
//     host: string;
//   };
// }

// interface LogViewerProps {
//   appName: string;
// }

// export default function LogViewer({ appName }: LogViewerProps) {
//   const [logs, setLogs] = useState<LogEntry[]>([]);
//   const { toast } = useToast();
//   const logsEndRef = useRef<HTMLDivElement | null>(null);
//   const seenLogsRef = useRef<Set<string>>(new Set());

//   useEffect(() => {
//     let retryCount = 0;
//     const maxRetries = 3;

//     function connect() {
//         const eventSource = new EventSource(
//             `http://localhost:3005/logs/${appName}`
//         );

//         eventSource.addEventListener("log", (e: MessageEvent) => {
//             try {
//                 const parsedLog = JSON.parse(e.data) as LogEntry;
//                 const logId = `${parsedLog.time}-${parsedLog.log}`; // Create unique identifier

//                 // Only add if we haven't seen this log before
//                 if (!seenLogsRef.current.has(logId)) {
//                     seenLogsRef.current.add(logId);
//                     setLogs(prevLogs => [...prevLogs, parsedLog]);
//                 }
//             } catch (error) {
//                 console.error("Failed to parse log:", error);
//             }
//         });

//         eventSource.addEventListener("error", (e: MessageEvent) => {
//             console.error("Error event received:", e);
//             eventSource.close();

//             if (retryCount < maxRetries) {
//                 retryCount++;
//                 setTimeout(() => {
//                     console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
//                     connect();
//                 }, 1000 * retryCount);
//             } else {
//                 toast({
//                     title: "Log Streaming Error",
//                     description: "Failed to receive logs after multiple attempts",
//                     variant: "destructive",
//                 });
//             }
//         });

//         return eventSource;
//     }

//     const eventSource = connect();

//     return () => {
//         eventSource.close();
//     };
// }, [appName, toast]);

//   useEffect(() => {
//     if (logsEndRef.current) {
//       logsEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [logs]);

//   const formatTime = (timestamp: string) => {
//     return new Date(timestamp).toLocaleTimeString();
//   };

//   return (
//     <Card className="w-full bg-white/95 backdrop-blur-sm shadow-lg">
//     <CardHeader className="border-b">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Terminal className="w-5 h-5" />
//           <CardTitle>Application Logs</CardTitle>
//         </div>
//         <Badge variant="outline" className="text-xs">
//           {appName}
//         </Badge>
//       </div>
//     </CardHeader>
//     <CardContent className="p-4">
//       <ScrollArea className="h-[500px] rounded-lg border bg-black/95 p-4">
//         {logs.length === 0 ? (
//           <div className="flex items-center justify-center h-full">
//             <p className="text-gray-400">No logs available...</p>
//           </div>
//         ) : (
//           <div className="space-y-2">
//             {logs.map((log, index) => (
//               <div
//                 key={`${log.time}-${log.log}`}
//                 className="border border-gray-800 rounded-lg p-3 bg-gray-900/50 hover:bg-gray-900/80 transition-colors"
//               >
//                   <div className="flex items-center gap-2 mb-2">
//                     <Clock className="w-4 h-4 text-gray-400" />
//                     <span className="text-xs text-gray-400">
//                       {formatTime(log.time)}
//                     </span>
//                     <Badge
//                       variant={log.stream === 'stdout' ? 'default' : 'destructive'}
//                       className="text-xs"
//                     >
//                       {log.stream}
//                     </Badge>
//                   </div>

//                   <div className="flex gap-2 mb-2">
//                     <Box className="w-4 h-4 text-gray-400" />
//                     <div className="text-xs text-gray-400">
//                       <span className="font-semibold">Pod:</span> {log.kubernetes.pod_name}
//                       <span className="mx-2">|</span>
//                       <span className="font-semibold">Container:</span> {log.kubernetes.container_name}
//                       <span className="mx-2">|</span>
//                       <span className="font-semibold">Namespace:</span> {log.kubernetes.namespace_name}
//                     </div>
//                   </div>

//                   <div className="font-mono text-sm text-gray-200 pl-6">
//                     {log.log}
//                   </div>
//                 </div>
//               ))}
//               <div ref={logsEndRef} />
//             </div>
//           )}
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Terminal, Clock, Box, Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, formatDate } from "date-fns";

interface LogEntry {
  time: string;
  stream: string;
  log: string;
  kubernetes: {
    pod_name: string;
    namespace_name: string;
    container_name: string;
    host: string;
  };
}

interface LogViewerProps {
  appName: string;
}

export default function LogViewer({ appName }: LogViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() - 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isFiltering, setIsFiltering] = useState(false);
  const { toast } = useToast();
  const logsEndRef = useRef<HTMLDivElement | null>(null);
  const seenLogsRef = useRef<Set<string>>(new Set());
  const eventSourceRef = useRef<EventSource | null>(null);

  const connectToEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const params = new URLSearchParams({
      searchText,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    });

    const eventSource = new EventSource(
      `http://localhost:3005/logs/${appName}?${params.toString()}`
    );

    eventSource.addEventListener("log", (e: MessageEvent) => {
      try {
        const parsedLog = JSON.parse(e.data) as LogEntry;
        const logId = `${parsedLog.time}-${parsedLog.log}`;

        if (!seenLogsRef.current.has(logId)) {
          seenLogsRef.current.add(logId);
          setLogs((prevLogs) => [...prevLogs, parsedLog]);
        }
      } catch (error) {
        console.error("Failed to parse log:", error);
      }
    });

    eventSource.addEventListener("error", (e: MessageEvent) => {
      console.error("Error event received:", e);
      eventSource.close();

      toast({
        title: "Log Streaming Error",
        description: "Failed to receive logs",
        variant: "destructive",
      });
    });

    eventSourceRef.current = eventSource;
    return eventSource;
  };

  useEffect(() => {
    const eventSource = connectToEventSource();
    return () => {
      eventSource.close();
    };
  }, [appName, searchText, startDate, endDate]);

  const handleApplyFilters = () => {
    setIsFiltering(true);
    seenLogsRef.current.clear();
    setLogs([]);
    connectToEventSource();
  };

  const clearFilters = () => {
    setSearchText("");
    setStartDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
    setEndDate(new Date());
    setIsFiltering(false);
    seenLogsRef.current.clear();
    setLogs([]);
    connectToEventSource();
  };

  return (
    <Card className="w-full bg-white/95 backdrop-blur-sm shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            <CardTitle>Application Logs</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              {appName}
            </Badge>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search logs..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10" // Added left padding to make room for the icon
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                {format(startDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                {format(endDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={(date: any) => date && setEndDate(date)}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
          {isFiltering && (
            <Button variant="ghost" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[500px] rounded-lg border bg-black/95 p-4">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No logs available...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div
                  key={`${log.time}-${log.log}`}
                  className="border border-gray-800 rounded-lg p-3 bg-gray-900/50 hover:bg-gray-900/80 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {format(new Date(log.time), "HH:mm:ss")}
                    </span>
                    <Badge
                      variant={
                        log.stream === "stdout" ? "default" : "destructive"
                      }
                      className="text-xs"
                    >
                      {log.stream}
                    </Badge>
                  </div>

                  <div className="flex gap-2 mb-2">
                    <Box className="w-4 h-4 text-gray-400" />
                    <div className="text-xs text-gray-400">
                      <span className="font-semibold">Pod:</span>{" "}
                      {log.kubernetes.pod_name}
                      <span className="mx-2">|</span>
                      <span className="font-semibold">Container:</span>{" "}
                      {log.kubernetes.container_name}
                      <span className="mx-2">|</span>
                      <span className="font-semibold">Namespace:</span>{" "}
                      {log.kubernetes.namespace_name}
                    </div>
                  </div>

                  <div className="font-mono text-sm text-gray-200 pl-6">
                    {log.log}
                  </div>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
