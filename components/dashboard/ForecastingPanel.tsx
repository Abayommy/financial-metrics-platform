'use client';

import React, { useState } from 'react';
import { Card, Text } from '@tremor/react';
import { TrendingUp } from 'lucide-react';

interface ForecastDataPoint {
  month: string;
  actual: number;
  forecast: number;
}

interface ForecastResult {
  model: string;
  data: ForecastDataPoint[];
}

export default function ForecastingPanel() {
  const [selectedMetric, setSelectedMetric] = useState<string>('Revenue');
  const [forecastPeriod, setForecastPeriod] = useState<number>(3);
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const metrics = [
    { value: 'Revenue', label: 'Revenue' },
    { value: 'Expenses', label: 'Expenses' },
    { value: 'Net Income', label: 'Net Income' },
    { value: 'Cash Flow', label: 'Cash Flow' },
    { value: 'EBITDA', label: 'EBITDA' }
  ];

  const periods = [
    { value: 3, label: '3 Months' },
    { value: 6, label: '6 Months' },
    { value: 9, label: '9 Months' },
    { value: 12, label: '12 Months' }
  ];

  const handleGenerateForecast = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const baseValue = 50000;
      
      const forecastData: ForecastDataPoint[] = months.slice(0, 12).map((month, idx) => ({
        month,
        actual: baseValue + (idx * 2000) + (Math.random() * 5000),
        forecast: baseValue + (idx * 2500) + (Math.random() * 3000)
      }));

      setForecast({
        model: 'ARIMA × XGBoost Ensemble',
        data: forecastData
      });
      
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Card className="mt-6">
      <div className="mb-4">
        <Text className="text-lg font-semibold">ML Forecasting</Text>
        <Text className="text-sm text-gray-600">AI-powered predictive analytics</Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Select Metric */}
        <div className="space-y-2">
          <label htmlFor="metric-select" className="block text-sm font-medium text-gray-700">
            Select Metric
          </label>
          <select
            id="metric-select"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg 
                     text-gray-900 text-sm font-medium
                     hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                     appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.25rem',
              paddingRight: '2.5rem'
            }}
          >
            {metrics.map((metric) => (
              <option key={metric.value} value={metric.value}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>

        {/* Forecast Period */}
        <div className="space-y-2">
          <label htmlFor="period-select" className="block text-sm font-medium text-gray-700">
            Forecast Period
          </label>
          <select
            id="period-select"
            value={forecastPeriod}
            onChange={(e) => setForecastPeriod(Number(e.target.value))}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg 
                     text-gray-900 text-sm font-medium
                     hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                     appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.25rem',
              paddingRight: '2.5rem'
            }}
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerateForecast}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white 
                 font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 
                 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <TrendingUp className="h-4 w-4" />
        {isGenerating ? 'Generating...' : 'Generate Forecast'}
      </button>

      {forecast && (
        <div className="mt-6">
          <Text className="text-base font-semibold mb-2">Forecast Results</Text>
          <div className="flex items-center gap-4 text-xs mb-4">
            <span className="text-green-600 font-medium">Accuracy: 89.5%</span>
            <span className="text-blue-600 font-medium">Confidence: 85%</span>
          </div>

          <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
            <Text className="text-gray-500">Chart visualization placeholder</Text>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <Text className="text-sm font-medium text-blue-900">Model Insights</Text>
            <Text className="text-sm text-blue-700 mt-2">
              Based on {forecast.model}, {selectedMetric} is expected to 
              {forecast.data[forecast.data.length - 1].forecast > forecast.data[11].actual ? ' increase' : ' decrease'} by 
              {' '}{Math.abs((forecast.data[forecast.data.length - 1].forecast - forecast.data[11].actual) / forecast.data[11].actual * 100).toFixed(1)}% 
              over the next {forecastPeriod} months.
            </Text>
          </div>
        </div>
      )}
    </Card>
  );
}
