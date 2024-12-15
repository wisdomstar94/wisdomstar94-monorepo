import { GridAutoHeightColumns, GridAutoHeightColumnsWithResponsive } from './_components';

export default function Page() {
  // 높이 가변적이면서 아래 레이아웃을 만족하는 코드!
  /**
   * [ 1 ] [ 3 ]
   * [ 2 ]
   */

  return (
    <div className="w-full relative flex flex-col gap-4">
      <GridAutoHeightColumns />
      <GridAutoHeightColumnsWithResponsive />
    </div>
  );
}
