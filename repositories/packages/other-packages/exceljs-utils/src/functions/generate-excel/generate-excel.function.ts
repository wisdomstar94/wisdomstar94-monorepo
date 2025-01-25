import { IGenerageExcel } from './generate-excel.interface';
import ExcelJS from 'exceljs';
import { download } from '../download';
import {
  processCellStyleBgColor,
  processCellStyleBorderColor,
  processCellMerge,
  processCellValue,
  processCellSize,
  processCellAlignment,
} from '../cell-processor';

export async function generateExcel(props: IGenerageExcel.Props) {
  const { sheets } = props;

  const workbook = new ExcelJS.Workbook();

  for (const sheetItem of sheets) {
    const { sheetName, datas } = sheetItem;
    const sheet = workbook.addWorksheet(sheetName);
    for (let rowIndex = 0; rowIndex < datas.length; rowIndex++) {
      const row = rowIndex + 1;
      const rowCellItems = datas[rowIndex];
      for (let colIndex = 0; colIndex < rowCellItems.length; colIndex++) {
        const col = colIndex + 1;
        const cellRow = row;
        const cellCol = col;
        const cellItem = rowCellItems[colIndex];
        if (cellItem === null) {
          continue;
        }
        const cell = sheet.getCell(cellRow, cellCol);
        processCellStyleBgColor({ cell, cellItem });
        processCellStyleBorderColor({ cell, cellItem });
        processCellMerge({ cell, cellItem, cellRow, cellCol, sheet });
        processCellValue({ cell, cellItem });
        processCellSize({ cell, cellItem, cellRow, cellCol, sheet });
        processCellAlignment({ cell, cellItem });
      }
    }
  }

  await download({
    workbook,
    fileName: `test-${Date.now()}`,
  });
}
