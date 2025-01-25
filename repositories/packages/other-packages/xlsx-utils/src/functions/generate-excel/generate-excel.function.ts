import { IGenerageExcel } from './generate-excel.interface';
import XLSX from 'xlsx';

export function generateExcel(props: IGenerageExcel.Props) {
  console.log('hi!!!');

  const rows = [
    { name: 'aaa', birthday: '2000-02-02' },
    { name: 'bbb', birthday: '1988-10-10' },
    // ... one row per President
  ];
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dates');
  workbook.Sheets['Dates'].A1.s = { font: { bold: true } };
  // XLSX.writeFile(workbook, 'Presidents.xlsx', { compression: true });
}
