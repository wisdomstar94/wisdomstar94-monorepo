import { ICellProcessor } from './cell-processor.interface';

export function processCellStyleBgColor(props: ICellProcessor.ProcessCellFnCommonProps) {
  const { cell, cellItem } = props;
  if (cellItem.style?.bgColor === undefined) return;
  cell.style.fill = {
    fgColor: { argb: cellItem.style.bgColor },
    pattern: 'solid',
    type: 'pattern',
  };
}

export function processCellStyleBorderColor(props: ICellProcessor.ProcessCellFnCommonProps) {
  const { cell, cellItem } = props;
  if (cellItem.style?.border === undefined) return;
  cell.style.border = cellItem.style.border;
}

export function processCellMerge(props: ICellProcessor.ProcessCellMergeProps) {
  const { cellItem, cellRow, cellCol, sheet } = props;
  if (cellItem.merge === undefined) return;

  const { rowSpan, colSpan } = cellItem.merge;

  if (rowSpan !== undefined) {
    sheet.mergeCells(cellRow, cellCol, cellRow + (rowSpan - 1), cellCol);
  }

  if (colSpan !== undefined) {
    sheet.mergeCells(cellRow, cellCol, cellRow, cellCol + (colSpan - 1));
  }
}

export function processCellValue(props: ICellProcessor.ProcessCellFnCommonProps) {
  const { cell, cellItem } = props;
  if (cellItem.value === undefined) return;
  cell.value = cellItem.value;
}

export function processCellSize(props: ICellProcessor.ProcessCellSizeProps) {
  const { cellItem, cellRow, cellCol, sheet } = props;

  if (cellItem.width !== undefined) {
    const c = sheet.getColumn(cellCol);
    c.width = cellItem.width;
  }

  if (cellItem.height !== undefined) {
    const r = sheet.getRow(cellRow);
    r.height = cellItem.height;
  }
}

export function processCellAlignment(props: ICellProcessor.ProcessCellFnCommonProps) {
  const { cell, cellItem } = props;
  if (cellItem.alignment === undefined) return;
  cell.alignment = cellItem.alignment;
}
