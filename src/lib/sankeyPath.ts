export function ribbonPath(x1: number, y1: number, x2: number, y2: number, thickness: number): string {
  const h = thickness / 2
  const midX = (x1 + x2) / 2
  return [
    `M ${x1},${y1 - h}`,
    `C ${midX},${y1 - h} ${midX},${y2 - h} ${x2},${y2 - h}`,
    `L ${x2},${y2 + h}`,
    `C ${midX},${y2 + h} ${midX},${y1 + h} ${x1},${y1 + h}`,
    'Z',
  ].join(' ')
}
