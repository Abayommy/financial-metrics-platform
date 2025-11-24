export interface FinancialMetrics {
  date: Date;
  revenue: number;
  expenses: number;
  netIncome: number;
  grossMargin: number;
  operatingMargin: number;
  ebitda: number;
  cashFlow: number;
  workingCapital: number;
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  returnOnAssets: number;
  returnOnEquity: number;
}

export interface Transaction {
  id: string;
  date: Date;
  type: 'INCOME' | 'EXPENSE' | 'ASSET' | 'LIABILITY';
  category: string;
  subcategory: string;
  amount: number;
  description: string;
  account: string;
  department: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface CashFlowData {
  period: string;
  operating: number;
  investing: number;
  financing: number;
  netCashFlow: number;
  beginningCash: number;
  endingCash: number;
}

export interface PLStatement {
  period: string;
  revenue: {
    productSales: number;
    serviceSales: number;
    otherIncome: number;
    total: number;
  };
  cogs: {
    materials: number;
    labor: number;
    overhead: number;
    total: number;
  };
  operatingExpenses: {
    sales: number;
    marketing: number;
    administrative: number;
    rd: number;
    total: number;
  };
  ebitda: number;
  depreciation: number;
  interestExpense: number;
  taxExpense: number;
  netIncome: number;
}

export interface KPITarget {
  metric: string;
  actual: number;
  target: number;
  variance: number;
  status: 'ABOVE' | 'ON_TARGET' | 'BELOW';
  trend: 'UP' | 'STABLE' | 'DOWN';
}

export interface AnomalyAlert {
  id: string;
  date: Date;
  metric: string;
  expectedValue: number;
  actualValue: number;
  deviation: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}
