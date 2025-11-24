'use client';

import { useState, useEffect } from 'react';
import { Card, Title, Text, Metric, Grid, BarChart, DonutChart, Badge } from '@tremor/react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  PieChart,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  generateFinancialMetrics, 
  generateTransactions,
  generateKPITargets 
} from '@/lib/data/financialDataGenerator';
import { FinancialMetrics, Transaction, KPITarget } from '@/lib/types/financial';
import StyledRevenueChart from '@/components/charts/StyledRevenueChart';
import SQLQueryBuilder from '@/components/dashboard/SQLQueryBuilder';
import RealTimeMetrics from '@/components/dashboard/RealTimeMetrics';
import ForecastingPanel from '@/components/dashboard/ForecastingPanel';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<FinancialMetrics[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [kpiTargets, setKpiTargets] = useState<KPITarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12m');

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setMetrics(generateFinancialMetrics());
      setTransactions(generateTransactions(100));
      setKpiTargets(generateKPITargets());
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <Text className="mt-4">Loading Financial Data...</Text>
        </div>
      </div>
    );
  }

  // Calculate current month metrics
  const currentMonth = metrics[metrics.length - 1];
  const previousMonth = metrics[metrics.length - 2];
  const revenueChange = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);
  const profitMargin = (currentMonth.netIncome / currentMonth.revenue * 100).toFixed(1);

  // Prepare chart data
  const revenueData = metrics.map(m => ({
    month: new Date(m.date).toLocaleDateString('en', { month: 'short' }),
    Revenue: m.revenue,
    Expenses: m.expenses,
    'Net Income': m.netIncome,
  }));

  const cashFlowData = metrics.map(m => ({
    month: new Date(m.date).toLocaleDateString('en', { month: 'short' }),
    'Cash Flow': m.cashFlow,
    'Working Capital': m.workingCapital,
  }));

  const expenseBreakdown = [
    { name: 'Operations', value: currentMonth.expenses * 0.35, color: 'blue' },
    { name: 'Sales & Marketing', value: currentMonth.expenses * 0.25, color: 'cyan' },
    { name: 'R&D', value: currentMonth.expenses * 0.20, color: 'indigo' },
    { name: 'Administration', value: currentMonth.expenses * 0.15, color: 'violet' },
    { name: 'Other', value: currentMonth.expenses * 0.05, color: 'gray' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <Title className="text-2xl">Financial Metrics Dashboard</Title>
              <Text className="mt-2">Real-time financial analytics with AI-powered insights</Text>
            </div>
            <div className="flex gap-2">
              <Badge color="emerald">Live Data</Badge>
              <Badge color="violet">ML Enhanced</Badge>
              <Badge color="blue">{new Date().toLocaleDateString()}</Badge>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <Grid numItemsLg={4} className="gap-6 mb-8">
          <Card decoration="top" decorationColor="emerald" className="shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Text>Monthly Revenue</Text>
                <Metric className="mt-2">${(currentMonth.revenue / 1000000).toFixed(2)}M</Metric>
                <div className="flex items-center mt-3">
                  {parseFloat(revenueChange) > 0 ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 text-emerald-600 mr-1" />
                      <Text className="text-emerald-600 font-medium">
                        {revenueChange}% vs last month
                      </Text>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                      <Text className="text-red-600 font-medium">
                        {revenueChange}% vs last month
                      </Text>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-full">
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card decoration="top" decorationColor="blue" className="shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Text>Profit Margin</Text>
                <Metric className="mt-2">{profitMargin}%</Metric>
                <Text className="mt-3 text-sm text-gray-600">
                  ${(currentMonth.netIncome / 1000000).toFixed(2)}M Net Income
                </Text>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <PieChart className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card decoration="top" decorationColor="amber" className="shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Text>Cash Flow</Text>
                <Metric className="mt-2">${(currentMonth.cashFlow / 1000000).toFixed(2)}M</Metric>
                <Text className="mt-3 text-sm text-gray-600">
                  Current Ratio: {currentMonth.currentRatio.toFixed(2)}
                </Text>
              </div>
              <div className="bg-amber-50 p-3 rounded-full">
                <Activity className="h-8 w-8 text-amber-600" />
              </div>
            </div>
          </Card>

          <Card decoration="top" decorationColor="violet" className="shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Text>EBITDA</Text>
                <Metric className="mt-2">${(currentMonth.ebitda / 1000000).toFixed(2)}M</Metric>
                <Text className="mt-3 text-sm text-gray-600">
                  Margin: {(currentMonth.ebitda / currentMonth.revenue * 100).toFixed(1)}%
                </Text>
              </div>
              <div className="bg-violet-50 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-violet-600" />
              </div>
            </div>
          </Card>
        </Grid>

        {/* Charts Row 1 - Using the new StyledRevenueChart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <StyledRevenueChart data={revenueData} />

          <Card className="shadow-md">
            <Title>Expense Breakdown</Title>
            <Text className="text-sm text-gray-600 mb-4">Current month distribution</Text>
            <DonutChart
              className="mt-4 h-72"
              data={expenseBreakdown}
              category="value"
              index="name"
              valueFormatter={(value) => `$${(value / 1000000).toFixed(2)}M`}
              colors={['blue', 'cyan', 'indigo', 'violet', 'gray']}
              showAnimation={true}
            />
            <div className="grid grid-cols-2 gap-4 mt-6">
              {expenseBreakdown.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-${item.color}-500 mr-2`}></div>
                    <Text className="text-sm">{item.name}</Text>
                  </div>
                  <Text className="text-sm font-medium">
                    {((item.value / currentMonth.expenses) * 100).toFixed(0)}%
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-md">
            <Title>Cash Flow & Working Capital</Title>
            <Text className="text-sm text-gray-600 mb-4">12-month trend analysis</Text>
            <BarChart
              className="mt-4 h-72"
              data={cashFlowData}
              index="month"
              categories={['Cash Flow', 'Working Capital']}
              colors={['amber', 'orange']}
              valueFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              showAnimation={true}
            />
          </Card>

          <Card className="shadow-md">
            <Title>KPI Performance</Title>
            <Text className="text-sm text-gray-600 mb-4">Target vs Actual</Text>
            <div className="mt-4 space-y-4 max-h-72 overflow-y-auto">
              {kpiTargets.map((kpi) => (
                <div key={kpi.metric} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <Text className="font-medium">{kpi.metric}</Text>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      kpi.status === 'ABOVE' ? 'bg-green-100 text-green-800' : 
                      kpi.status === 'ON_TARGET' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {kpi.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <Text>Actual: <span className="font-medium">{kpi.actual}</span></Text>
                    <Text>Target: <span className="font-medium">{kpi.target}</span></Text>
                    <Text className={`font-medium ${kpi.variance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.variance > 0 ? '+' : ''}{kpi.variance}
                    </Text>
                  </div>
                  <div className="mt-2 flex items-center">
                    {kpi.trend === 'UP' ? (
                      <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    ) : kpi.trend === 'DOWN' ? (
                      <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                    ) : null}
                    <Text className="text-xs text-gray-500">
                      Trend: {kpi.trend}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* New Advanced Features Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SQLQueryBuilder />
          <RealTimeMetrics />
        </div>

        {/* ML Forecasting Panel */}
        <div className="mb-6">
          <ForecastingPanel />
        </div>

        {/* Recent Transactions */}
        <Card className="shadow-md">
          <div className="flex justify-between items-center mb-4">
            <Title>Recent Transactions</Title>
            <Badge color="blue">{transactions.length} Total</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.slice(0, 10).map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{new Date(txn.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        txn.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{txn.category}</td>
                    <td className="py-3 px-4">{txn.department}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${txn.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        txn.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
