'use client';

import { useState } from 'react';
import { Card, Title, Text, Button, Badge } from '@tremor/react';
import { Play, Database, Copy, CheckCircle } from 'lucide-react';

interface QueryResult {
  columns: string[];
  rows: any[];
  executionTime: number;
}

// Predefined query templates
const queryTemplates = [
  {
    name: 'Monthly Revenue',
    query: `SELECT 
  DATE_TRUNC('month', date) as month,
  SUM(revenue) as total_revenue,
  COUNT(*) as transactions
FROM financial_metrics
GROUP BY month
ORDER BY month DESC
LIMIT 12;`
  },
  {
    name: 'Top Expenses',
    query: `SELECT 
  category,
  SUM(amount) as total,
  AVG(amount) as average
FROM transactions
WHERE type = 'EXPENSE'
GROUP BY category
ORDER BY total DESC
LIMIT 10;`
  },
  {
    name: 'Profit Margins',
    query: `SELECT 
  date,
  revenue,
  expenses,
  (revenue - expenses) as profit,
  ((revenue - expenses) / revenue * 100) as margin_pct
FROM financial_metrics
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date DESC;`
  },
  {
    name: 'Cash Flow Analysis',
    query: `SELECT 
  DATE_TRUNC('week', date) as week,
  SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as inflow,
  SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as outflow,
  SUM(CASE WHEN type = 'INCOME' THEN amount ELSE -amount END) as net_flow
FROM transactions
GROUP BY week
ORDER BY week DESC;`
  }
];

export default function SQLQueryBuilder() {
  const [query, setQuery] = useState(queryTemplates[0].query);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Simulate SQL execution
  const executeQuery = async () => {
    setLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Mock result based on query content
        const mockResult: QueryResult = {
          columns: ['date', 'revenue', 'expenses', 'profit', 'margin'],
          rows: Array.from({ length: 5 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
            revenue: Math.floor(Math.random() * 100000) + 50000,
            expenses: Math.floor(Math.random() * 80000) + 30000,
            profit: Math.floor(Math.random() * 30000) + 10000,
            margin: (Math.random() * 30 + 10).toFixed(2) + '%'
          })),
          executionTime: Math.random() * 1000 + 100
        };
        
        setResult(mockResult);
        setLoading(false);
      } catch (err) {
        setError('Query execution failed. Please check your syntax.');
        setLoading(false);
      }
    }, 1500);
  };

  const copyQuery = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadTemplate = (template: typeof queryTemplates[0]) => {
    setQuery(template.query);
    setResult(null);
    setError(null);
  };

  return (
    <Card className="shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Title>SQL Query Builder</Title>
          <Text className="text-sm text-gray-600">Write custom SQL queries to analyze your data</Text>
        </div>
        <Badge color="blue">
          <Database className="h-3 w-3 mr-1" />
          Connected
        </Badge>
      </div>

      {/* Query Templates */}
      <div className="mb-4">
        <Text className="text-sm font-medium mb-2">Quick Templates:</Text>
        <div className="flex flex-wrap gap-2">
          {queryTemplates.map((template) => (
            <Button
              key={template.name}
              size="xs"
              variant="secondary"
              onClick={() => loadTemplate(template)}
            >
              {template.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Query Editor */}
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-48 p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          placeholder="Enter your SQL query here..."
          spellCheck={false}
        />
        <button
          onClick={copyQuery}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      {/* Execute Button */}
      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          variant="primary"
          icon={Play}
          loading={loading}
          onClick={executeQuery}
        >
          Execute Query
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setQuery('');
            setResult(null);
            setError(null);
          }}
        >
          Clear
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <Text className="text-red-600 text-sm">{error}</Text>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <Text className="font-medium">Query Results</Text>
            <div className="flex gap-2">
              <Badge color="emerald">{result.rows.length} rows</Badge>
              <Badge color="blue">{result.executionTime.toFixed(0)}ms</Badge>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {result.columns.map((col) => (
                    <th key={col} className="text-left py-2 px-4 font-medium text-gray-700">
                      {col.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {result.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {result.columns.map((col) => (
                      <td key={col} className="py-2 px-4">
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
}
