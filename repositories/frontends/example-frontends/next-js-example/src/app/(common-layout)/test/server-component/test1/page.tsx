import { ListClient } from '@/components/test/list-client/list-client.component';
import { Suspense } from 'react';
import { setTimeout } from 'timers/promises';

async function getList() {
  await setTimeout(3000);
  return [new Date().toString(), new Date().toString()];
}

async function List(props: { searchParam: Record<string, string | undefined> }) {
  const { searchParam } = props;
  console.log('@List.searchParam', searchParam);

  const list = await getList();
  return <ListClient list={list} />;
}

export default async function Page(props: { searchParams: Promise<Record<string, string | undefined>> }) {
  const searchParam = await props.searchParams;
  return (
    <div className="w-full">
      <Suspense fallback={<>loading...........</>}>
        <List searchParam={searchParam} />
      </Suspense>
    </div>
  );
}
