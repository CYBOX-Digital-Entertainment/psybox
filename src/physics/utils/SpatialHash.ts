export class SpatialHash {
  static hash(x: number, y: number, z: number, cellSize = 4): string {
    const cx = Math.floor(x / cellSize);
    const cy = Math.floor(y / cellSize);
    const cz = Math.floor(z / cellSize);
    return `${cx},${cy},${cz}`;
  }
}
