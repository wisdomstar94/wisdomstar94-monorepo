import { IDownload } from './download.interface';

export async function download(props: IDownload.Props) {
  const { workbook, fileName } = props;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName + '.xlsx';
  anchor.click();
  window.URL.revokeObjectURL(url);
}
