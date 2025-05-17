import { ListClient } from '@/components/test/list-client/list-client.component';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { Suspense } from 'react';
import { setTimeout } from 'timers/promises';

async function getList() {
  'use cache';
  cacheTag('articles');

  await setTimeout(3000);
  return [new Date().toString(), new Date().toString()];
}

async function List(props: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { searchParams } = props;
  const searchParamsStore = await searchParams;

  const myId = searchParamsStore.myId;
  console.log('@List.myId', myId);

  const list = await getList();
  return <ListClient list={list} />;
}

export default async function Page(props: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { searchParams } = props;
  // const searchParam = await props.searchParams;
  // const myId = searchParam.myId;

  return (
    <div className="w-full">
      <Suspense fallback={<>loading...........</>}>
        <List searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
