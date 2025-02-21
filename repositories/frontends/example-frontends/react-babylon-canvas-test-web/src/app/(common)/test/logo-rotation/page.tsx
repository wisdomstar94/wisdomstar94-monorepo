'use client';

import { BabylonCanvas } from '@wisdomstar94/react-babylon-canvas';

export default function Page() {
  return (
    <div className="w-full relative">
      <BabylonCanvas
        className="w-[50%] aspect-square bg-slate-200"
        onLoaded={(params) => {
          const { engineInfo, canvas, scene } = params;
          console.log('#BabylonCanvas.onLoaded', { engineInfo, canvas, scene });
        }}
      />
    </div>
  );
}
