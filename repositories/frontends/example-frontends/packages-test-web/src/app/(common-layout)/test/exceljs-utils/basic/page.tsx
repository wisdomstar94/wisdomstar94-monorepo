'use client';

import { generateExcel } from '@wisdomstar94/exceljs-utils';

export default function Page() {
  return (
    <>
      <div className="w-full flex flex-wrap gap-2 relative">
        <button
          onClick={() => {
            // https://github.com/exceljs/exceljs/issues/486#issuecomment-2165556667
            const date = new Date();
            const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);

            generateExcel({
              sheets: [
                {
                  sheetName: '시트 1',
                  datas: [
                    [
                      {
                        width: 60,
                        value: 10000,
                        numberFormat: '#,##원',
                        style: {
                          bgColor: 'FFEEEEEE',
                          border: {
                            bottom: {
                              style: 'thin',
                              color: {
                                argb: 'FF999999',
                              },
                            },
                            right: {
                              style: 'thin',
                              color: {
                                argb: 'FF999999',
                              },
                            },
                          },
                        },
                      },
                      {
                        // value: 25390,
                        richText: [
                          {
                            text: '25',
                          },
                          {
                            text: '390',
                            font: {
                              bold: true,
                              color: {
                                argb: 'FFFF0000',
                              },
                            },
                          },
                        ],
                        numberFormat: '#,##',
                        merge: {
                          colSpan: 3,
                        },
                        style: {
                          bgColor: 'FFEEEEEE',
                          border: {
                            bottom: {
                              style: 'thin',
                              color: {
                                argb: 'FF999999',
                              },
                            },
                            right: {
                              style: 'thin',
                              color: {
                                argb: 'FF999999',
                              },
                            },
                          },
                        },
                      },
                      null,
                      null,
                      {
                        value: '3',
                        style: {
                          bgColor: 'FFEEEEEE',
                          border: {
                            bottom: {
                              style: 'thin',
                              color: {
                                argb: 'FF999999',
                              },
                            },
                            right: {
                              style: 'thin',
                              color: {
                                argb: 'FF999999',
                              },
                            },
                          },
                        },
                      },
                    ],
                    [
                      {
                        value: utcDate,
                        numberFormat: `yyyy-mm-dd hh:mm:ss`,
                      },
                      {
                        value: 15000,
                        numberFormat: '#,##',
                      },
                      {
                        value: 4900,
                        numberFormat: '#,##',
                      },
                    ],
                  ],
                },
              ],
            });
          }}
        >
          generateExcel!!!
        </button>
      </div>
    </>
  );
}
