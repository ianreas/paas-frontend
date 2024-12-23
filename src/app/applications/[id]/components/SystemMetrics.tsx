import { useState, useEffect } from "react";
import { format, subHours, subDays } from "date-fns";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RefreshCw, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/app/components/ui/CustomCards";

const timeRanges = [
  { value: "1h", label: "Last Hour", duration: () => subHours(new Date(), 1) },
  {
    value: "3h",
    label: "Last 3 Hours",
    duration: () => subHours(new Date(), 3),
  },
  {
    value: "12h",
    label: "Last 12 Hours",
    duration: () => subHours(new Date(), 12),
  },
  {
    value: "24h",
    label: "Last 24 Hours",
    duration: () => subDays(new Date(), 1),
  },
  { value: "7d", label: "Last 7 Days", duration: () => subDays(new Date(), 7) },
];

export const MetricChart = ({ data, title, description, dataKey, color }: { data: any, title: string, description: string, dataKey: string, color: string }) => {
  const formattedData = data?.map((item: any  ) => ({
    ...item,
    value: Number((item.value * 100).toFixed(1)),
  }));

  const currentValue = formattedData?.[formattedData.length - 1]?.value || 0;
  const previousValue = formattedData?.[formattedData.length - 2]?.value || 0;
  const trend = currentValue - previousValue;

  return (
    <div className="space-y-4 ">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-zinc-800">{title}</h3>
          <p className="text-sm text-zinc-600">{description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-zinc-800">
            {currentValue.toFixed(1)}%
          </div>
          <div
            className={`text-sm ${
              trend >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="h-[250px] bg-white/20 rounded-lg p-4 backdrop-blur-sm w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-zinc-700/10"
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(time) => format(new Date(time), "HH:mm")}
              stroke="#374151"
              tick={{ fill: "#374151" }}
              tickLine={{ stroke: "#374151" }}
            />
            <YAxis
              stroke="#374151"
              tick={{ fill: "#374151" }}
              tickLine={{ stroke: "#374151" }}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                border: "1px solid rgba(164, 251, 173, 0.5)",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              labelFormatter={(label) =>
                format(new Date(label), "MMM dd, HH:mm:ss")
              }
              formatter={(value) => [`${value}%`, title]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 6,
                style: {
                  fill: color,
                  filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))",
                },
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const MonitoringDashboard = ({ appName = "Test App" }) => {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [timeRange, setTimeRange] = useState("1h");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = async () => {
    setIsLoading(true);
    const endTime = new Date();
    const startTime = timeRanges.find((r) => r.value === timeRange)?.duration();

    if (!startTime) {
      console.error("Invalid time range:", timeRange);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3005/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clusterName: "paas-1",
          namespace: "3",
          appName,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, [timeRange, appName]);

  return (
    <GlassCard>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            {/* <CardTitle className="text-2xl font-semibold text-zinc-800">
              System Monitoring - {appName}
            </CardTitle> */}
            {/* {lastUpdated && (
              <CardDescription className="flex items-center gap-1 mt-1">
                <Clock className="w-4 h-4" />
                Last updated: {format(lastUpdated, "HH:mm:ss")}
              </CardDescription>
            )} */}
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-white/30">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchMetrics}
              className="bg-white/30 hover:bg-white/40"
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!metrics ? (
          <div className="flex items-center justify-center h-64">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg text-zinc-600"
            >
              Loading metrics...
            </motion.div>
          </div>
        ) : (
          <div className="space-y-8">
            <MetricChart
              data={metrics.cpuUtilization}
              title="CPU Utilization"
              description="Processor usage across all cores"
              dataKey="value"
              color="#2B9348" // Darker green that complements #A4FBAD
            />
            <MetricChart
              data={metrics.memoryUtilization}
              title="Memory Utilization"
              description="Total memory consumption"
              dataKey="value"
              color="#55A630" // Medium green that complements #A4FBAD
            />
          </div>
        )}
      </CardContent>
    </GlassCard>
  );
};

export default MonitoringDashboard;
