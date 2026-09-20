// Utility for exporting JSON data arrays to downloadable CSV files

export const exportToCSV = (arg1, arg2, headers) => {
  let filename = 'export';
  let rows = [];

  if (Array.isArray(arg1)) {
    rows = arg1;
    filename = typeof arg2 === 'string' ? arg2 : 'export';
  } else {
    filename = typeof arg1 === 'string' ? arg1 : 'export';
    rows = Array.isArray(arg2) ? arg2 : [];
  }

  if (!rows || !rows.length) return;
  
  const separator = ',';
  const keys = Object.keys(rows[0]);
  
  let csvContent = '';

  if (headers && headers.length) {
    csvContent += headers.join(separator) + '\n';
  } else {
    csvContent += keys.join(separator) + '\n';
  }

  rows.forEach(row => {
    const rowValues = keys.map(k => {
      let val = row[k] === null || row[k] === undefined ? '' : row[k];
      val = val.toString().replace(/"/g, '""');
      if (val.search(/("|,|\n)/g) >= 0) {
        val = `"${val}"`;
      }
      return val;
    });
    csvContent += rowValues.join(separator) + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
