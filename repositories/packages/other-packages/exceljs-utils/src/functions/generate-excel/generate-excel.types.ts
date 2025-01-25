import ExcelJS, { Borders } from 'exceljs';

export type CellItem = {
  width?: number;
  height?: number;
  value?: string;
  style?: {
    bgColor?: string;
    border?: Partial<Borders>;
  };
  merge?: {
    rowSpan?: number;
    colSpan?: number;
  };
  alignment?: Partial<ExcelJS.Alignment>;
};

export type SheetItem = {
  sheetName: string;
  datas: Array<Array<CellItem | null>>;
};

export type Props = {
  sheets: Array<SheetItem>;
};
