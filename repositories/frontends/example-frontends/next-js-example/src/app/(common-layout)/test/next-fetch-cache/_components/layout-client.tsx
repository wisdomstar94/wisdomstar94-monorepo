'use client';

import { customRevalidate } from '../_macros/custom-revalidate';

export function LayoutClient() {
  return (
    <div className="w-full flex flex-wrap gap-2 relative box-border">
      <button
        className="inline-flex px-2 py-0.5 border border-r-amber-400"
        onClick={() => {
          customRevalidate(['test1']);
        }}
      >
        test1 캐시 갱신하기
      </button>
      <button
        className="inline-flex px-2 py-0.5 border border-r-amber-400"
        onClick={() => {
          customRevalidate(['test2']);
        }}
      >
        test2 캐시 갱신하기
      </button>
      <button
        className="inline-flex px-2 py-0.5 border border-r-amber-400"
        onClick={() => {
          customRevalidate(['test3']);
        }}
      >
        test3 캐시 갱신하기
      </button>
      <button
        className="inline-flex px-2 py-0.5 border border-r-amber-400"
        onClick={() => {
          customRevalidate(['test4']);
        }}
      >
        test4 캐시 갱신하기
      </button>
      <button
        className="inline-flex px-2 py-0.5 border border-r-amber-400"
        onClick={() => {
          customRevalidate(['test']);
        }}
      >
        test 전체 캐시 갱신하기
      </button>
    </div>
  );
}
