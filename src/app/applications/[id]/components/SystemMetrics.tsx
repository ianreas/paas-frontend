import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const MetricChart = ({ data, title, dataKey, color }) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(time) => format(new Date(time), 'HH:mm')}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => format(new Date(label), 'HH:mm:ss')}
            formatter={(value) => value.toFixed(2)}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const MonitoringDashboard = ({ appName }) => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - 3600000); // Last hour

      const response = await fetch('http://localhost:3005/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clusterName: 'paas-1',
          namespace: '3',
          appName,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    };

    const interval = setInterval(fetchMetrics, 60000); // Update every minute
    fetchMetrics(); // Initial fetch

    return () => clearInterval(interval);
  }, [appName]);

  if (!metrics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Monitoring - {appName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricChart
          data={metrics.cpuUtilization}
          title="CPU Utilization"
          dataKey="value"
          color="#0ea5e9"
        />
        <MetricChart
          data={metrics.memoryUtilization}
          title="Memory Utilization"
          dataKey="value"
          color="#10b981"
        />
        <MetricChart
          data={metrics.networkIn}
          title="Network In (bytes)"
          dataKey="value"
          color="#8b5cf6"
        />
        <MetricChart
          data={metrics.networkOut}
          title="Network Out (bytes)"
          dataKey="value"
          color="#f59e0b"
        />
      </div>
    </div>
  );
};

export default MonitoringDashboard;