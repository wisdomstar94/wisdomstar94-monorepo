import { IGenerageExcel } from './generate-excel.interface';
import ExcelJS from 'exceljs';
import { download } from '../download';

export async function generateExcel(props: IGenerageExcel.Props) {
  console.log('hi2!!!');

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('tab_1');

  const cell = sheet.getCell(1, 1);
  cell.value = '하이욤';
  cell.alignment = {
    vertical: 'top',
    horizontal: 'left',
  };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {
      argb: `FFEEEEEE`,
    },
  };
  cell.border = {
    bottom: { style: 'thin', color: { argb: `FFFFFFFF` } },
  };

  const column = sheet.getColumn(1);
  column.width = 32;

  sheet.mergeCells(1, 1, 1, 2);

  await download({
    workbook,
    fileName: `test-${Date.now()}`,
  });
}
