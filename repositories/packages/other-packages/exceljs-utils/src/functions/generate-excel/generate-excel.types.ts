import ExcelJS, { Borders, RichText } from 'exceljs';

export type CellItem = {
  width?: number;
  height?: number;
  value?: string | number | Date;
  numberFormat?: string;
  richText?: RichText[];
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
