// 벡터 및 수학 유틸리티
export class PhysicsMath {
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  static vectorLength(v: { x: number, y: number, z: number }): number {
    return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
  }
}
