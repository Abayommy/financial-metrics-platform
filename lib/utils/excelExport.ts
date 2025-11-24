import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FinancialMetrics, Transaction, KPITarget } from '@/lib/types/financial';

export class ExcelExportService {
  static exportFinancialReport(
    metrics: FinancialMetrics[],
    transactions: Transaction[],
    kpiTargets: KPITarget[],
    fileName: string = 'financial-report'
  ) {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: Summary Dashboard
    const summaryData = this.createSummarySheet(metrics);
    const ws_summary = XLSX.utils.json_to_sheet(summaryData);
    this.styleSheet(ws_summary, summaryData.length);
    XLSX.utils.book_append_sheet(wb, ws_summary, 'Summary');

    // Sheet 2: Monthly Metrics
    const metricsData = metrics.map(m => ({
      'Date': new Date(m.date).toLocaleDateString(),
      'Revenue ($)': m.revenue.toFixed(2),
      'Expenses ($)': m.expenses.toFixed(2),
      'Net Income ($)': m.netIncome.toFixed(2),
      'Gross Margin (%)': m.grossMargin.toFixed(2),
      'Operating Margin (%)': m.operatingMargin.toFixed(2),
      'EBITDA ($)': m.ebitda.toFixed(2),
      'Cash Flow ($)': m.cashFlow.toFixed(2),
      'Current Ratio': m.currentRatio.toFixed(2),
      'Quick Ratio': m.quickRatio.toFixed(2),
      'ROA (%)': m.returnOnAssets.toFixed(2),
      'ROE (%)': m.returnOnEquity.toFixed(2),
    }));
    const ws_metrics = XLSX.utils.json_to_sheet(metricsData);
    this.styleSheet(ws_metrics, metricsData.length);
    XLSX.utils.book_append_sheet(wb, ws_metrics, 'Monthly Metrics');

    // Sheet 3: Transactions
    const transactionData = transactions.map(t => ({
      'Transaction ID': t.id,
      'Date': new Date(t.date).toLocaleDateString(),
      'Type': t.type,
      'Category': t.category,
      'Subcategory': t.subcategory,
      'Amount ($)': t.amount.toFixed(2),
      'Department': t.department,
      'Account': t.account,
      'Status': t.status,
      'Description': t.description,
    }));
    const ws_transactions = XLSX.utils.json_to_sheet(transactionData);
    this.styleSheet(ws_transactions, transactionData.length);
    XLSX.utils.book_append_sheet(wb, ws_transactions, 'Transactions');

    // Sheet 4: KPI Analysis
    const kpiData = kpiTargets.map(kpi => ({
      'Metric': kpi.metric,
      'Actual': kpi.actual,
      'Target': kpi.target,
      'Variance': kpi.variance,
      'Status': kpi.status,
      'Trend': kpi.trend,
      'Performance (%)': ((kpi.actual / kpi.target) * 100).toFixed(2),
    }));
    const ws_kpi = XLSX.utils.json_to_sheet(kpiData);
    this.styleSheet(ws_kpi, kpiData.length);
    XLSX.utils.book_append_sheet(wb, ws_kpi, 'KPI Analysis');

    // Sheet 5: Pivot Analysis
    const pivotData = this.createPivotAnalysis(transactions);
    const ws_pivot = XLSX.utils.json_to_sheet(pivotData);
    this.styleSheet(ws_pivot, pivotData.length);
    XLSX.utils.book_append_sheet(wb, ws_pivot, 'Pivot Analysis');

    // Generate Excel file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    
    // Save file
    const timestamp = new Date().toISOString().split('T')[0];
    saveAs(blob, `${fileName}-${timestamp}.xlsx`);
  }

  private static createSummarySheet(metrics: FinancialMetrics[]) {
    const currentMonth = metrics[metrics.length - 1];
    const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
    const totalExpenses = metrics.reduce((sum, m) => sum + m.expenses, 0);
    const avgMargin = (metrics.reduce((sum, m) => sum + m.grossMargin, 0) / metrics.length).toFixed(2);

    return [
      { 'Metric': 'Report Date', 'Value': new Date().toLocaleDateString() },
      { 'Metric': 'Period Covered', 'Value': '12 Months' },
      { 'Metric': 'Total Revenue', 'Value': `$${(totalRevenue / 1000000).toFixed(2)}M` },
      { 'Metric': 'Total Expenses', 'Value': `$${(totalExpenses / 1000000).toFixed(2)}M` },
      { 'Metric': 'Net Profit', 'Value': `$${((totalRevenue - totalExpenses) / 1000000).toFixed(2)}M` },
      { 'Metric': 'Current Month Revenue', 'Value': `$${(currentMonth.revenue / 1000000).toFixed(2)}M` },
      { 'Metric': 'Current Month Margin', 'Value': `${currentMonth.grossMargin.toFixed(2)}%` },
      { 'Metric': 'Average Margin', 'Value': `${avgMargin}%` },
      { 'Metric': 'Current Ratio', 'Value': currentMonth.currentRatio.toFixed(2) },
      { 'Metric': 'Cash Flow', 'Value': `$${(currentMonth.cashFlow / 1000000).toFixed(2)}M` },
    ];
  }

  private static createPivotAnalysis(transactions: Transaction[]) {
    const categoryTotals = new Map<string, { income: number; expense: number }>();
    
    transactions.forEach(t => {
      if (!categoryTotals.has(t.category)) {
        categoryTotals.set(t.category, { income: 0, expense: 0 });
      }
      const totals = categoryTotals.get(t.category)!;
      if (t.type === 'INCOME') {
        totals.income += t.amount;
      } else {
        totals.expense += t.amount;
      }
    });

    return Array.from(categoryTotals.entries()).map(([category, totals]) => ({
      'Category': category,
      'Total Income': totals.income.toFixed(2),
      'Total Expense': totals.expense.toFixed(2),
      'Net': (totals.income - totals.expense).toFixed(2),
      'Margin (%)': totals.income > 0 
        ? (((totals.income - totals.expense) / totals.income) * 100).toFixed(2) 
        : '0.00',
    }));
  }

  private static styleSheet(worksheet: XLSX.WorkSheet, rowCount: number) {
    // Set column widths
    const wscols = [
      { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 30 }
    ];
    worksheet['!cols'] = wscols;

    // Add basic styling (Note: Full styling requires Pro version)
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    
    // Style headers (first row)
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + '1';
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'E8F4FD' } },
        alignment: { horizontal: 'center' }
      };
    }
  }
}
