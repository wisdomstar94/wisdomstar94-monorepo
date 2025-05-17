import { ClientComp } from './_components';

export default function Page() {
  const dataPromise = new Promise(function (resolve, reject) {
    setTimeout(() => {
      // resolve({
      //   name: 'test',
      //   age: 10,
      //   timestamp: Date.now(),
      // });

      reject(new Error('test error'));
    }, 1000);
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="border border-slate-400 p-2 box-border">this server comp content. (1)</div>
      <div className="border border-slate-400 p-2 box-border">
        <ClientComp dataPromise={dataPromise} />
      </div>
    </div>
  );
}
