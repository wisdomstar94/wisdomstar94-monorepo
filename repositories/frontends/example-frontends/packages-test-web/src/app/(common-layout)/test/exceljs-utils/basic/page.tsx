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
                        value: '1',
                      },
                      {
                        value: '2',
                        merge: {
                          colSpan: 3,
                        },
                      },
                      null,
                      null,
                      {
                        value: '3',
                      },
                    ],
                    [
                      {
                        value: '4',
                      },
                      {
                        value: '5',
                      },
                      {
                        value: '6',
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
