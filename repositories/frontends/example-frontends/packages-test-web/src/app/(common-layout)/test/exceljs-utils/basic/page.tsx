'use client';

import { generateExcel } from '@wisdomstar94/exceljs-utils';

export default function Page() {
  return (
    <>
      <div className="w-full flex flex-wrap gap-2 relative">
        <button
          onClick={() => {
            generateExcel({
              sheets: [
                {
                  sheetName: '시트 1',
                  datas: [
                    [
                      {
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
                        value: 25390,
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
                        value: '4',
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
