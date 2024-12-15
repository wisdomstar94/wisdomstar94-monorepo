export function GridAutoHeightColumnsWithResponsive() {
  return (
    <div className="w-full p-4 box-border bg-white border border-slate-400 rounded-lg relative">
      <div className="w-full flex flex-col lg:grid grid-cols-[1fr_200px] grid-rows-[auto_auto] gap-2">
        <div className="bg-blue-100 p-4 box-border col-[1] row-[1] order-1">1</div>
        <div className="bg-blue-200 p-4 box-border col-[1] row-[2_/_span_2] min-h-0 overflow-auto order-3 lg:order-2">
          2<div className="w-full h-[200px]"></div>
        </div>
        <div className="bg-blue-300 p-4 box-border col-[2] row-[1_/_span_2] order-2 lg:order-3">
          3
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
}
