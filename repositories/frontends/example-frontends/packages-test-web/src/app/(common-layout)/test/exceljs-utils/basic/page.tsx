'use client';

import { generateExcel } from '@wisdomstar94/exceljs-utils';

export default function Page() {
  return (
    <>
      <div className="w-full flex flex-wrap gap-2 relative">
        <button
          onClick={() => {
            generateExcel({});
          }}
        >
          generateExcel!!!
        </button>
      </div>
    </>
  );
}
