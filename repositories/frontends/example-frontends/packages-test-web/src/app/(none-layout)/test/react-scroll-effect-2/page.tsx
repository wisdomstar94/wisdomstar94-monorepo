"use client";

import { useScrollEffectManager } from "@wisdomstar94/react-scroll-effect";
import { classes } from "@wisdomstar94/example-next-library";

export default function Page() {
  const scrollEffectManager = useScrollEffectManager({
    onScroll(params) {
      const { wrapperElementMap } = params;
    },
  });

  return (
    <>
      <div className="w-full h-[400px] bg-orange-400">hi</div>
      <div className="w-full h-[300px] bg-green-600">hi 2</div>
      <div className="w-full relative bg-blue-300 h-auto flex flex-nowrap">
        <div className={classes("block relative flex-1")}>
          {scrollEffectManager.scrollEffectComponent({
            id: "title",
            wrapperClassName: classes("w-full sticky top-0"),
            child: () => <div className="inline-flex text-5xl font-bold">Title</div>,
          })}
        </div>
        <div className="flex flex-wrap gap-2 relative flex-1">
          <div className="w-full h-[300px] bg-slate-200">item 1</div>
          <div className="w-full h-[300px] bg-slate-300">item 2</div>
          <div className="w-full h-[300px] bg-slate-400">item 3</div>
          <div className="w-full h-[300px] bg-slate-500">item 4</div>
          <div className="w-full h-[300px] bg-slate-600 text-white">item 5</div>
          <div className="w-full h-[300px] bg-slate-700 text-white">item 6</div>
        </div>
      </div>
      <div className="w-full h-[400px] bg-pink-400">hi</div>
      <div className="w-full h-[400px] bg-red-400">hi 22</div>
      <div className="w-full h-[400px] bg-purple-400">hi 33</div>
    </>
  );
}
