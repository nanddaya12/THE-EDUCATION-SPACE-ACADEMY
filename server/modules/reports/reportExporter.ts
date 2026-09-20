export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'print';

export class ReportExporter {
  public generateExport(reportData: any, format: ExportFormat) {
    switch (format) {
      case 'csv':
        return {
          contentType: 'text/csv',
          filename: `report-${reportData.domain}-${Date.now()}.csv`,
          content: this.generateCSV(reportData)
        };

      case 'excel':
        return {
          contentType: 'application/vnd.ms-excel',
          filename: `report-${reportData.domain}-${Date.now()}.xls`,
          content: this.generateExcelXML(reportData)
        };

      case 'pdf':
        return {
          contentType: 'application/pdf',
          filename: `report-${reportData.domain}-${Date.now()}.pdf`,
          content: Buffer.from(this.generatePDFMock(reportData))
        };

      case 'print':
        return {
          contentType: 'text/html',
          filename: `report-${reportData.domain}-${Date.now()}.html`,
          content: this.generatePrintHTML(reportData)
        };

      default:
        throw new Error(`Unsupported export format '${format}'`);
    }
  }

  private generateCSV(reportData: any): string {
    const columns: string[] = reportData.columns;
    const rows: any[] = reportData.rows;

    let csvStr = columns.join(',') + '\n';
    rows.forEach((r) => {
      const line = columns.map((col) => {
        const val = r[col] !== undefined ? String(r[col]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',');
      csvStr += line + '\n';
    });

    return csvStr;
  }

  private generateExcelXML(reportData: any): string {
    const columns: string[] = reportData.columns;
    const rows: any[] = reportData.rows;

    let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="${reportData.domain.toUpperCase()}">
<Table>
<Row>`;

    columns.forEach((col) => {
      xml += `<Cell><Data ss:Type="String">${col.toUpperCase()}</Data></Cell>`;
    });
    xml += `</Row>`;

    rows.forEach((r) => {
      xml += `<Row>`;
      columns.forEach((col) => {
        const val = r[col] !== undefined ? String(r[col]) : '';
        xml += `<Cell><Data ss:Type="String">${val}</Data></Cell>`;
      });
      xml += `</Row>`;
    });

    xml += `</Table></Worksheet></Workbook>`;
    return xml;
  }

  private generatePDFMock(reportData: any): string {
    // Generate valid PDF document buffer text header
    return `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /Resources <<>> /Contents 4 0 R>> endobj
4 0 obj <</Length 68>> stream
BT /F1 12 Tf 50 700 TD (Official Report: ${reportData.domain.toUpperCase()}) Tj ET
endstream endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000200 00000 n
trailer <</Size 5 /Root 1 0 R>>
startxref
318
%%EOF`;
  }

  private generatePrintHTML(reportData: any): string {
    const columns: string[] = reportData.columns;
    const rows: any[] = reportData.rows;

    let html = `<!DOCTYPE html>
<html>
<head>
  <title>Report - ${reportData.domain.toUpperCase()}</title>
  <style>
    body { font-family: sans-serif; padding: 20px; color: #1e293b; }
    h1 { color: #0284c7; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 12px; }
    th { background: #f1f5f9; font-weight: bold; }
    .summary { display: flex; gap: 15px; margin-top: 15px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 15px; rounded: 8px; font-size: 12px; }
  </style>
</head>
<body onload="window.print()">
  <h1>The Education Space Academy</h1>
  <h2>Official Domain Report: ${reportData.domain.toUpperCase()}</h2>
  <p>Generated Date: ${new Date().toISOString()}</p>
  <table>
    <thead>
      <tr>${columns.map(c => `<th>${c.toUpperCase()}</th>`).join('')}</tr>
    </thead>
    <tbody>
      ${rows.map(r => `<tr>${columns.map(c => `<td>${r[c] !== undefined ? r[c] : ''}</td>`).join('')}</tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`;
    return html;
  }
}
