// 벡터 연산 등 물리 수학 유틸리티
export class PhysicsMath {
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  static vectorLength(v: { x: number, y: number, z: number }): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }
}
