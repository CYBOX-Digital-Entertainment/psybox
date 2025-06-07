// 벡터 및 수학 유틸리티
export class PhysicsMath {
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    static vectorLength(v) {
        return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
    }
}
