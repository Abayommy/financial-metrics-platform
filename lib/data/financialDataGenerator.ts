import { 
  FinancialMetrics, 
  Transaction, 
  CashFlowData, 
  PLStatement,
  KPITarget,
  AnomalyAlert 
} from '../types/financial';

// Generate 12 months of financial metrics
export function generateFinancialMetrics(): FinancialMetrics[] {
  const metrics: FinancialMetrics[] = [];
  const baseRevenue = 5000000; // $5M monthly base
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    // Add some randomness and growth
    const growthRate = 1 + (0.05 * (11 - i) / 11); // 5% growth over year
    const randomFactor = 0.9 + Math.random() * 0.2; // ±10% variation
    
    const revenue = baseRevenue * growthRate * randomFactor;
    const expenses = revenue * (0.7 + Math.random() * 0.1); // 70-80% of revenue
    const netIncome = revenue - expenses;
    
    metrics.push({
      date,
      revenue,
      expenses,
      netIncome,
      grossMargin: (revenue - expenses * 0.6) / revenue * 100,
      operatingMargin: netIncome / revenue * 100,
      ebitda: netIncome + (expenses * 0.15), // Add back D&A
      cashFlow: netIncome * (0.8 + Math.random() * 0.4),
      workingCapital: revenue * 0.25,
      currentRatio: 1.5 + Math.random() * 0.5,
      quickRatio: 1.2 + Math.random() * 0.3,
      debtToEquity: 0.5 + Math.random() * 0.3,
      returnOnAssets: 8 + Math.random() * 4,
      returnOnEquity: 12 + Math.random() * 6,
    });
  }
  
  return metrics;
}

// Generate sample transactions
export function generateTransactions(count: number = 500): Transaction[] {
  const transactions: Transaction[] = [];
  const categories = {
    INCOME: ['Product Sales', 'Service Revenue', 'Subscriptions', 'Licensing'],
    EXPENSE: ['Salaries', 'Marketing', 'Operations', 'R&D', 'Infrastructure'],
  };
  
  for (let i = 0; i < count; i++) {
    const type = Math.random() > 0.4 ? 'INCOME' : 'EXPENSE';
    const category = categories[type][Math.floor(Math.random() * categories[type].length)];
    
    transactions.push({
      id: `TXN-${1000 + i}`,
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Last 90 days
      type: type as 'INCOME' | 'EXPENSE',
      category,
      subcategory: `${category}-Sub${Math.floor(Math.random() * 3) + 1}`,
      amount: Math.floor(Math.random() * 100000) + 1000,
      description: `${type} transaction for ${category}`,
      account: `ACC-${Math.floor(Math.random() * 10) + 1}`,
      department: ['Sales', 'Marketing', 'Engineering', 'Operations'][Math.floor(Math.random() * 4)],
      status: Math.random() > 0.1 ? 'COMPLETED' : 'PENDING',
    });
  }
  
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

// Generate KPI targets
export function generateKPITargets(): KPITarget[] {
  return [
    {
      metric: 'Revenue Growth',
      actual: 12.5,
      target: 10,
      variance: 2.5,
      status: 'ABOVE',
      trend: 'UP',
    },
    {
      metric: 'Gross Margin',
      actual: 42.3,
      target: 45,
      variance: -2.7,
      status: 'BELOW',
      trend: 'STABLE',
    },
    {
      metric: 'Customer Acquisition Cost',
      actual: 1250,
      target: 1000,
      variance: -25,
      status: 'BELOW',
      trend: 'UP',
    },
    {
      metric: 'Cash Runway (months)',
      actual: 18,
      target: 12,
      variance: 6,
      status: 'ABOVE',
      trend: 'STABLE',
    },
    {
      metric: 'EBITDA Margin',
      actual: 22.1,
      target: 20,
      variance: 2.1,
      status: 'ABOVE',
      trend: 'UP',
    },
  ];
}
