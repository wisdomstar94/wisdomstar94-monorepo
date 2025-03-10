export function getMaxScrollValues<T extends Element>(element: T) {
  const rect = element.getBoundingClientRect();

  const maxScrollTop = Math.ceil(element.scrollHeight - rect.height);
  const maxScrollLeft = Math.ceil(element.scrollWidth - rect.width);

  return {
    maxScrollTop,
    maxScrollLeft,
  };
}
