export function getPointerDownedCoordinate(event: MouseEvent | TouchEvent): [number, number] {
  let x = 0;
  let y = 0;

  if (event instanceof MouseEvent) {
    x = event.clientX;
    y = event.clientY;
  } else {
    x = event.touches[0].clientX;
    y = event.touches[0].clientY;
  }

  return [x, y];
}
