import type ExcelJS from 'exceljs';

export type Props = {
  workbook: ExcelJS.Workbook;
  fileName: string;
};
