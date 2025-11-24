'use client';

import { Card, Title, Text, AreaChart, TabGroup, TabList, Tab, Badge } from '@tremor/react';
import { useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface ChartData {
  month: string;
  Revenue: number;
  Expenses: number;
  'Net Income': number;
}

interface Props {
  data: ChartData[];
}

export default function StyledRevenueChart({ data }: Props) {
  const [selectedView, setSelectedView] = useState('all');
  
  // Calculate trends
  const latestRevenue = data[data.length - 1].Revenue;
  const previousRevenue = data[data.length - 2].Revenue;
  const revenueGrowth = ((latestRevenue - previousRevenue) / previousRevenue * 100).toFixed(1);
  
  // Custom colors for each view
  const customColors = {
    all: ['emerald', 'rose', 'blue'],
    revenue: ['emerald'],
    profit: ['blue'],
  };

  const getCategories = () => {
    switch(selectedView) {
      case 'revenue':
        return ['Revenue'];
      case 'profit':
        return ['Net Income'];
      default:
        return ['Revenue', 'Expenses', 'Net Income'];
    }
  };

  // Calculate summary metrics
  const totalRevenue = data.reduce((sum, d) => sum + d.Revenue, 0);
  const totalExpenses = data.reduce((sum, d) => sum + d.Expenses, 0);
  const totalProfit = data.reduce((sum, d) => sum + d['Net Income'], 0);
  const avgMargin = (totalProfit / totalRevenue * 100).toFixed(1);

  return (
    <Card className="shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3">
            <Title>Revenue Trend</Title>
            <Badge color={parseFloat(revenueGrowth) > 0 ? 'emerald' : 'red'}>
              {parseFloat(revenueGrowth) > 0 ? (
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {revenueGrowth}%
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  {revenueGrowth}%
                </div>
              )}
            </Badge>
          </div>
          <Text className="text-sm text-gray-600 mt-1">12-month financial performance</Text>
        </div>
        <TabGroup defaultIndex={0} onIndexChange={(index) => 
          setSelectedView(['all', 'revenue', 'profit'][index])
        }>
          <TabList variant="solid" className="shadow-sm">
            <Tab>All Metrics</Tab>
            <Tab>Revenue</Tab>
            <Tab>Profit</Tab>
          </TabList>
        </TabGroup>
      </div>
      
      <div className="relative">
        {/* Enhanced Chart with colored months */}
        <AreaChart
          className="mt-4 h-72"
          data={data}
          index="month"
          categories={getCategories()}
          colors={customColors[selectedView as keyof typeof customColors]}
          valueFormatter={(value) => `$${(value / 1000000).toFixed(2)}M`}
          showLegend={true}
          showGridLines={true}
          showYAxis={true}
          showAnimation={true}
          curveType="monotone"
          connectNulls={true}
        />
        
        {/* Colored month indicators */}
        <div className="mt-4 flex justify-between px-2">
          {data.map((item, index) => (
            <div key={item.month} className="flex flex-col items-center">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: `hsl(${(index * 30) % 360}, 70%, 50%)` 
                }}
              />
              <Text 
                className="text-xs mt-1 font-medium"
                style={{ 
                  color: `hsl(${(index * 30) % 360}, 70%, 40%)` 
                }}
              >
                {item.month}
              </Text>
            </div>
          ))}
        </div>
      </div>
      
      {/* Summary metrics */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t">
        <div className="text-center">
          <Text className="text-xs text-gray-600 uppercase tracking-wide">Avg Revenue</Text>
          <Text className="text-lg font-semibold text-emerald-600 mt-1">
            ${(totalRevenue / data.length / 1000000).toFixed(2)}M
          </Text>
        </div>
        <div className="text-center">
          <Text className="text-xs text-gray-600 uppercase tracking-wide">Total Expenses</Text>
          <Text className="text-lg font-semibold text-rose-600 mt-1">
            ${(totalExpenses / 1000000).toFixed(1)}M
          </Text>
        </div>
        <div className="text-center">
          <Text className="text-xs text-gray-600 uppercase tracking-wide">Net Profit</Text>
          <Text className="text-lg font-semibold text-blue-600 mt-1">
            ${(totalProfit / 1000000).toFixed(1)}M
          </Text>
        </div>
        <div className="text-center">
          <Text className="text-xs text-gray-600 uppercase tracking-wide">Avg Margin</Text>
          <div className="flex items-center justify-center mt-1">
            <Activity className="h-4 w-4 text-violet-600 mr-1" />
            <Text className="text-lg font-semibold text-violet-600">
              {avgMargin}%
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
