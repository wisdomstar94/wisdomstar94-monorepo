import { getTestInfo } from '@/functions';
import { Buttons } from './_components';

export default async function Page() {
  const info = getTestInfo({
    age: 11,
    name: '홍길동',
  });

  console.log('@info', info);

  return (
    <>
      <Buttons />
    </>
  );
}
