'use client';

import { Button } from '@tremor/react';
import { Download, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { ExcelExportService } from '@/lib/utils/excelExport';
import { FinancialMetrics, Transaction, KPITarget } from '@/lib/types/financial';

interface ExportButtonProps {
  metrics: FinancialMetrics[];
  transactions: Transaction[];
  kpiTargets: KPITarget[];
}

export default function ExportButton({ metrics, transactions, kpiTargets }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    
    try {
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Export to Excel
      ExcelExportService.exportFinancialReport(
        metrics,
        transactions,
        kpiTargets,
        'financial-metrics-report'
      );
      
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="primary"
        icon={exported ? CheckCircle : FileSpreadsheet}
        color={exported ? 'emerald' : 'blue'}
        loading={exporting}
        onClick={handleExport}
      >
        {exported ? 'Exported!' : 'Export to Excel'}
      </Button>
      
      {!exported && (
        <Button
          size="sm"
          variant="secondary"
          icon={Download}
          onClick={() => {
            // Quick CSV export alternative
            const csv = [
              ['Date', 'Revenue', 'Expenses', 'Net Income'],
              ...metrics.map(m => [
                new Date(m.date).toLocaleDateString(),
                m.revenue,
                m.expenses,
                m.netIncome
              ])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'financial-data.csv';
            a.click();
          }}
        >
          Quick CSV
        </Button>
      )}
    </div>
  );
}
