export function GridAutoHeightColumns() {
  return (
    <div className="w-full p-4 box-border bg-white border border-slate-400 rounded-lg relative">
      <div className="w-full grid gird-cols-[auto_1fr] grid-rows-[auto_auto]">
        <div className="bg-blue-100 p-4 box-border col-[1] row-[1]">1</div>
        <div className="bg-blue-200 p-4 box-border col-[1] row-[2_/_span_2] min-h-0 overflow-auto">
          2<div className="w-full h-[200px]"></div>
        </div>
        <div className="bg-blue-300 p-4 box-border col-[2] row-[1_/_span_2]">
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
