// 엔티티별 물리 프로파일을 관리하는 클래스와 인터페이스
export interface PhysicsProfile {
  mass: number;
  gravityMultiplier: number;
  bounceFactor: number;
  airResistance: number;
  maxVelocity: { x: number, y: number, z: number };
}

export class PhysicsComponent {
  private static registry = new Map<string, PhysicsProfile>();

  // 엔티티 식별자별로 물리 프로파일 등록
  static registerEntity(identifier: string, config: Partial<PhysicsProfile>) {
    this.registry.set(identifier, {
      mass: config.mass ?? 1.0,
      gravityMultiplier: config.gravityMultiplier ?? 1.0,
      bounceFactor: config.bounceFactor ?? 0.5,
      airResistance: config.airResistance ?? 0.98,
      maxVelocity: config.maxVelocity ?? { x: 3, y: 3, z: 3 }
    });
  }

  // 엔티티 식별자로 물리 프로파일 조회
  static getProfile(entityId: string): PhysicsProfile | undefined {
    return this.registry.get(entityId);
  }
}
