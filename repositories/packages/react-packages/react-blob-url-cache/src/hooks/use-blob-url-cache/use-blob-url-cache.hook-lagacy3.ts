'use client';

import { useEffect, useRef, useState } from 'react';
import type { IUseBlobUrlCache } from './use-blob-url-cache.interface';
import { IUseIndexeddbManager, useIndexeddbManager } from '@wisdomstar94/react-indexeddb-manager';
import { defineSchemas, getDbVersion } from './use-blob-url-cache.schema';

export function useBlobUrlCache(props?: IUseBlobUrlCache.Props) {
  const blobUrls = useRef<Set<string>>(new Set());
  const indexeddbManager = useIndexeddbManager({
    defineSchemas: defineSchemas,
    onDefineSchemasResult(result) {},
  });
  const isReady = indexeddbManager.isReady;
  const [box, setBox] = useState<IUseBlobUrlCache.BlobUrlInfoMap>(new Map());

  async function getCacheUrlInfo(originalUrl: string) {
    return new Promise<IUseIndexeddbManager.GetResult<IUseBlobUrlCache.BlobUrlCacheListItem>[]>(function (
      resolve,
      reject
    ) {
      indexeddbManager.getFromStore<IUseBlobUrlCache.BlobUrlCacheListItem>({
        dbName: 'blob-url-cache-database',
        storeName: 'blob-url-cache-list',
        keys: [originalUrl],
        version: getDbVersion('blob-url-cache-database'),
        onResult(result) {
          resolve(result);
        },
        onError(event) {
          reject(event);
        },
      });
    });
  }

  async function getBlobFromUrl(originalUrl: string) {
    const result = await fetch(originalUrl);
    const blob = result.blob();
    return blob;
  }

  async function saveCacheUrl(originalUrl: string) {
    return new Promise<{
      result: IUseIndexeddbManager.InsertResult<IUseBlobUrlCache.BlobUrlCacheListItem>[];
      blob: Blob;
    }>(async (resolve, reject) => {
      const blob = await getBlobFromUrl(originalUrl);
      indexeddbManager.insertToStore({
        dbName: 'blob-url-cache-database',
        storeName: 'blob-url-cache-list',
        isOverwrite: true,
        version: getDbVersion('blob-url-cache-database'),
        onSuccess(result) {
          resolve({ result, blob });
        },
        onError(event) {
          reject(event);
        },
        datas: [
          {
            key: originalUrl,
            blob,
          },
        ],
      });
    });
  }

  async function getBlobUrl(originalUrl: string) {
    if (typeof window === 'undefined') {
      return;
    }

    const t = box.get(originalUrl);
    if (t === undefined) {
      setBox((prev) => {
        const newMap = new Map(prev);
        newMap.set(originalUrl, { originalUrl, state: 'loading' });
        return newMap;
      });
    }

    const cacheUrlInfo = await getCacheUrlInfo(originalUrl);
    console.log('@cacheUrlInfo', cacheUrlInfo);

    const target = cacheUrlInfo.find((k) => k.key === originalUrl);
    if (target === undefined) {
      const { blob } = await saveCacheUrl(originalUrl);
      const objectUrl = window.URL.createObjectURL(blob);
      blobUrls.current.add(objectUrl);
      setBox((prev) => {
        const newMap = new Map(prev);
        const k = newMap.get(originalUrl);
        if (k !== undefined) {
          k.url = objectUrl;
          k.state = 'success';
          newMap.set(originalUrl, k);
        }
        return newMap;
      });
      return objectUrl;
    }

    const blob = target.data?.blob;
    if (blob === undefined) {
      setBox((prev) => {
        const newMap = new Map(prev);
        const k = newMap.get(originalUrl);
        if (k !== undefined) {
          k.url = originalUrl;
          k.state = 'error';
          newMap.set(originalUrl, k);
        }
        return newMap;
      });
      return originalUrl;
    }

    const objectUrl = window.URL.createObjectURL(blob);
    blobUrls.current.add(objectUrl);
    setBox((prev) => {
      const newMap = new Map(prev);
      const k = newMap.get(originalUrl);
      if (k !== undefined) {
        k.url = objectUrl;
        k.state = 'success';
        newMap.set(originalUrl, k);
      }
      return newMap;
    });
    return objectUrl;
  }

  function invokeUrls(urls: string[]) {
    if (typeof window === 'undefined') {
      return;
    }

    for (const url of urls) {
      window.URL.revokeObjectURL(url);
      blobUrls.current.delete(url);
    }
  }

  useEffect(() => {
    return () => {
      invokeUrls(Array.from(blobUrls.current));
    };
  }, []);

  return {
    isReady,
    box,
    getBlobUrl,
    invokeUrls,
  };
}
