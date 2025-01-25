import type ExcelJS from 'exceljs';
import type { IGenerageExcel } from '../generate-excel';

export type ProcessCellFnCommonProps = {
  cell: ExcelJS.Cell;
  cellItem: IGenerageExcel.CellItem;
};

export type ProcessCellMergeProps = ProcessCellFnCommonProps & {
  sheet: ExcelJS.Worksheet;
  cellRow: number;
  cellCol: number;
};

export type ProcessCellSizeProps = ProcessCellFnCommonProps & {
  sheet: ExcelJS.Worksheet;
  cellRow: number;
  cellCol: number;
};
