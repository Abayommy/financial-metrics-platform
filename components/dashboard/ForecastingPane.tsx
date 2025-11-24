'use client';

import React, { useState } from 'react';
import { TrendingUp, Activity } from 'lucide-react';

interface ForecastData {
  actual: number[];
  forecast: number[];
  lower: number[];
  upper: number[];
  months: string[];
}

export default function ForecastingPane() {
  const [selectedMetric, setSelectedMetric] = useState<string>('Revenue');
  const [forecastPeriod, setForecastPeriod] = useState<number>(3); // Changed to number
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModelActive] = useState(true);

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
    
    // Simulate forecast generation
    setTimeout(() => {
      const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
      
      // Use forecastPeriod as number directly
      const numMonths = forecastPeriod;
      
      setForecastData({
        actual: [500, 520, 540, 560, 580, 600, 620, 640],
        forecast: Array.from({ length: numMonths }, (_, i) => 650 + i * 30),
        lower: Array.from({ length: numMonths }, (_, i) => 600 + i * 25),
        upper: Array.from({ length: numMonths }, (_, i) => 700 + i * 35),
        months: months.slice(0, numMonths)
      });
      
      setIsGenerating(false);
    }, 1500);
  };

  const calculateGrowthRate = (): string => {
    if (!forecastData || forecastData.forecast.length === 0) return '0.0';
    const firstValue = forecastData.actual[forecastData.actual.length - 1] || 600;
    const lastValue = forecastData.forecast[forecastData.forecast.length - 1];
    const growth = ((lastValue - firstValue) / firstValue) * 100;
    return growth.toFixed(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">ML Forecasting</h3>
            <p className="text-sm text-gray-600 mt-1">AI-powered predictive analytics</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-green-200">
            <div className="relative">
              <div className={`w-2 h-2 rounded-full ${isModelActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              {isModelActive && (
                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              )}
            </div>
            <span className="text-xs font-medium text-green-700">ML Model Active</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Form Section - FIXED SELECT DROPDOWNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Select Metric - FIXED */}
          <div className="space-y-2">
            <label 
              htmlFor="metric-select" 
              className="block text-sm font-semibold text-gray-700"
            >
              Select Metric
            </label>
            <div className="relative">
              <select
                id="metric-select"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg 
                         text-gray-900 text-sm font-medium
                         hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                         appearance-none cursor-pointer transition-all duration-200
                         shadow-sm hover:shadow"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.875rem center',
                  backgroundSize: '1.25rem',
                  paddingRight: '3rem'
                }}
              >
                {metrics.map((metric) => (
                  <option key={metric.value} value={metric.value}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Forecast Period - FIXED with number type */}
          <div className="space-y-2">
            <label 
              htmlFor="period-select" 
              className="block text-sm font-semibold text-gray-700"
            >
              Forecast Period
            </label>
            <div className="relative">
              <select
                id="period-select"
                value={forecastPeriod}
                onChange={(e) => setForecastPeriod(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg 
                         text-gray-900 text-sm font-medium
                         hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                         appearance-none cursor-pointer transition-all duration-200
                         shadow-sm hover:shadow"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.875rem center',
                  backgroundSize: '1.25rem',
                  paddingRight: '3rem'
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
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateForecast}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                   text-white font-semibold rounded-lg shadow-md
                   hover:from-blue-700 hover:to-blue-800 hover:shadow-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <TrendingUp className="h-5 w-5" />
              <span>Generate Forecast</span>
            </>
          )}
        </button>

        {/* Forecast Results */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-gray-900">Forecast Results</h4>
            {forecastData && (
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="font-bold text-green-600">89.5%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-bold text-blue-600">85%</span>
                </div>
              </div>
            )}
          </div>

          {/* Chart Area */}
          <div className="relative h-80 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200 overflow-hidden">
            {!forecastData ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Activity className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-sm text-gray-500 font-medium">Select parameters and click "Generate Forecast"</p>
                <p className="text-xs text-gray-400 mt-1">to see AI-powered predictions</p>
              </div>
            ) : (
              <div className="absolute inset-0 p-6">
                {/* Simple bar chart visualization */}
                <div className="h-full flex items-end justify-around gap-2">
                  {forecastData.forecast.map((value, idx) => {
                    const maxValue = Math.max(...forecastData.forecast);
                    const height = (value / maxValue) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 shadow-md"
                          style={{ 
                            height: `${height}%`,
                            animationDelay: `${idx * 100}ms`
                          }}
                        />
                        <span className="text-xs text-gray-600 mt-2 font-medium">{forecastData.months[idx]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Model Insights */}
          {forecastData && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-blue-900 mb-1">Model Insights</h5>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Based on <span className="font-semibold">ARIMA × XGBoost Ensemble</span>, {selectedMetric.toLowerCase()} is 
                    expected to <span className="font-semibold">increase by {calculateGrowthRate()}%</span> over the next {forecastPeriod} months.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
