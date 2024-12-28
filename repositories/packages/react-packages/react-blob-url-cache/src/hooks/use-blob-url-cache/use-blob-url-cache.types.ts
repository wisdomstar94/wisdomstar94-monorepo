export type Props = {};

export type BlobUrlCacheListItem = {
  key: string;
  blob: Blob;
  createdAt?: number;
};

export type BlobUrlState = 'loading' | 'error' | 'success';

export type BlobUrlInfo = {
  originalUrl: string;
  url?: string;
  state: BlobUrlState;
};

export type BlobUrlInfoMap = Map<string, BlobUrlInfo>;
