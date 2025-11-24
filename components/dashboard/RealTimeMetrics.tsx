'use client';

import { useState, useEffect } from 'react';
import { Card, Title, Text, Metric, Badge, ProgressBar } from '@tremor/react';
import { Activity, Zap, RefreshCw } from 'lucide-react';

interface LiveMetric {
  label: string;
  value: number;
  change: number;
  timestamp: Date;
}

export default function RealTimeMetrics() {
  const [connected, setConnected] = useState(false);
  const [metrics, setMetrics] = useState<LiveMetric[]>([
    { label: 'Active Users', value: 1247, change: 0, timestamp: new Date() },
    { label: 'Transactions/sec', value: 23, change: 0, timestamp: new Date() },
    { label: 'Revenue/min', value: 4832, change: 0, timestamp: new Date() },
    { label: 'System Load', value: 67, change: 0, timestamp: new Date() },
  ]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate WebSocket connection
    setTimeout(() => setConnected(true), 1000);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + Math.floor(Math.random() * 20 - 10),
        change: Math.random() * 10 - 5,
        timestamp: new Date()
      })));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title>Real-Time Metrics</Title>
          <Text className="text-sm text-gray-600">Live data streaming</Text>
        </div>
        <div className="flex items-center gap-2">
          <Badge color={connected ? 'emerald' : 'gray'}>
            <Activity className="h-3 w-3 mr-1 animate-pulse" />
            {connected ? 'Connected' : 'Connecting...'}
          </Badge>
          <RefreshCw className={`h-4 w-4 text-gray-400 ${connected ? 'animate-spin' : ''}`} />
        </div>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Text className="text-sm text-gray-600">{metric.label}</Text>
                <Metric className="mt-1">
                  {metric.label.includes('Revenue') ? '$' : ''}{metric.value.toLocaleString()}
                </Metric>
              </div>
              <div className="text-right">
                <Badge color={metric.change > 0 ? 'emerald' : 'red'}>
                  <Zap className="h-3 w-3 mr-1" />
                  {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                </Badge>
                <Text className="text-xs text-gray-500 mt-1">
                  {new Date(metric.timestamp).toLocaleTimeString()}
                </Text>
              </div>
            </div>
            <ProgressBar 
              value={Math.min(100, (metric.value / 2000) * 100)} 
              color={idx % 2 === 0 ? 'blue' : 'amber'} 
              className="mt-2"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t flex justify-between text-xs text-gray-500">
        <Text>Update Frequency: 3s</Text>
        <Text>Last Update: {lastUpdate.toLocaleTimeString()}</Text>
      </div>
    </Card>
  );
}
