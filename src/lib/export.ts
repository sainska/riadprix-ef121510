/**
 * Export Utilities for CSV and PDF generation
 */

import { logger } from './monitoring';

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
}

// CSV Export
export function exportToCSV(data: ExportData, filename: string = 'export.csv') {
  try {
    const csvContent = [
      data.headers.join(','),
      ...data.rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    logger.info('CSV export completed', { filename });
  } catch (error) {
    logger.error('CSV export failed', error as Error);
    throw error;
  }
}

// PDF Export (using browser print or a library like jsPDF)
export async function exportToPDF(data: {
  title: string;
  content: string | HTMLElement;
  filename?: string;
}) {
  try {
    // Simple approach: Use browser print dialog
    if (typeof data.content === 'string') {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${data.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>${data.title}</h1>
            ${data.content}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      // If HTML element, clone and print
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }
      const clonedContent = data.content.cloneNode(true);
      printWindow.document.body.appendChild(clonedContent);
      printWindow.print();
    }
    
    logger.info('PDF export initiated', { title: data.title });
  } catch (error) {
    logger.error('PDF export failed', error as Error);
    throw error;
  }
}

// Helper to format data for export
export function formatBenchmarkDataForExport(benchmarks: Array<{
  property_type: string;
  min_price: number | null;
  median_price: number | null;
  max_price: number | null;
  period_start: string;
  period_end: string;
}>) {
  return {
    headers: ['Property Type', 'Min Price', 'Median Price', 'Max Price', 'Period Start', 'Period End'],
    rows: benchmarks.map(b => [
      b.property_type,
      b.min_price || 0,
      b.median_price || 0,
      b.max_price || 0,
      b.period_start,
      b.period_end,
    ]),
  };
}

