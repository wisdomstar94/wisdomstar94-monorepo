// 'use client';

// import { useEffect, use, useState } from 'react';
// import type { IUseBlobUrlCache } from './use-blob-url-cache.interface';
// import { IUseIndexeddbManager, useIndexeddbManager } from '@wisdomstar94/react-indexeddb-manager';
// import { defineSchemas, getDbVersion } from './use-blob-url-cache.schema';

// export function useBlobUrlCache(props?: IUseBlobUrlCache.Props) {
//   const setCacheUrls = function () {
//     return use(
//       new Promise(function (resolve, reject) {
//         setTimeout(() => {
//           resolve('하이용');
//         }, 1000);
//       })
//     );
//   };

//   return {
//     setCacheUrls,
//   };
// }

// const list = [];
// const blobUrlCache = useBlobUrlCache();

// blobUrlCache.setUrlCache({
//   urls: list.map((item) => item.fileUrl),
//   excludeUrls: [],
// });

// return (
//   <>
//     {
//       list.map((item) => {
//         return (
//           <Item
//             url={blobUrlCache.getUrlCache(item.fileUrl)}
//           />
//         )
//       })
//     }
//   </>
// )
