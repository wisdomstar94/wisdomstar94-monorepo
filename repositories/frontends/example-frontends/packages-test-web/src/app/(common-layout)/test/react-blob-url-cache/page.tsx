'use client';

import { useBlobUrlCache } from '@wisdomstar94/react-blob-url-cache';
import { useEffect } from 'react';

export default function Page() {
  const blobUrlCache = useBlobUrlCache();

  blobUrlCache.getBlobUrl('https://cdn.pixabay.com/photo/2021/11/15/14/50/lake-6798400_1280.jpg');

  console.log('@blobUrlCache.box', blobUrlCache.box);

  return (
    <>
      {blobUrlCache.isReady ? (
        <>
          <div className={'flex flex-col gap-2 relative'}>
            하이!
            <img
              src={blobUrlCache.box.get('https://cdn.pixabay.com/photo/2021/11/15/14/50/lake-6798400_1280.jpg')?.url}
            />
          </div>
        </>
      ) : (
        <>로딩중..</>
      )}
    </>
  );
}
