export type IsContainCoordinateTargetAreaOptions = {
  draw: {
    uniqueDomId: string;
    bgColor: string;
  };
};

export type IsContainCoordinateTargetArea = {
  x: number;
  y: number;
  width: number;
  height: number;
  options?: IsContainCoordinateTargetAreaOptions;
};

export function isContainCoordinate(coordinate: [number, number], targetArea: IsContainCoordinateTargetArea) {
  const { x, y, width, height } = targetArea;

  const condition1 = coordinate[0] >= x && coordinate[0] <= x + width;
  const condition2 = coordinate[1] >= y && coordinate[1] <= y + height;

  if (targetArea.options?.draw !== undefined) {
    const { uniqueDomId, bgColor } = targetArea.options.draw;
    const element = document.querySelector<HTMLElement>(`#${uniqueDomId}`);
    if (element === null) {
      // dom 에 없으면
      const div = document.createElement('div');
      div.id = uniqueDomId;
      div.style.backgroundColor = bgColor;
      div.style.position = 'fixed';
      div.style.top = `${y}px`;
      div.style.left = `${x}px`;
      div.style.width = `${width}px`;
      div.style.height = `${height}px`;
      div.style.zIndex = '100000';
      document.body.appendChild(div);
    } else {
      // dom 에 있으면
      element.style.backgroundColor = bgColor;
      element.style.position = 'fixed';
      element.style.top = `${y}px`;
      element.style.left = `${x}px`;
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
    }
  }

  return condition1 && condition2;
}
