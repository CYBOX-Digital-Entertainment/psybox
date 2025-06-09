export interface PhysicsProfile {
  mass: number;
  gravityMultiplier: number;
  bounceFactor: number;
  airResistance: number;
  maxVelocity: { x: number, y: number, z: number };
  slopeForce: number;
  frictionCoefficient: number;
}

export class PhysicsComponent {
  private static registry = new Map<string, PhysicsProfile>();

  static registerEntity(identifier: string, config: Partial<PhysicsProfile>) {
    const profile: PhysicsProfile = {
      mass: config.mass ?? 1.0,
      gravityMultiplier: config.gravityMultiplier ?? 1.0,
      bounceFactor: config.bounceFactor ?? 0.5,
      airResistance: config.airResistance ?? 0.98,
      maxVelocity: config.maxVelocity ?? { x: 3, y: 3, z: 3 },
      slopeForce: config.slopeForce ?? 0.1,
      frictionCoefficient: config.frictionCoefficient ?? 0.3
    };

    this.registry.set(identifier, profile);
    console.log(`물리 프로파일 등록: ${identifier}`);
  }

  static getProfile(entityId: string): PhysicsProfile | undefined {
    return this.registry.get(entityId);
  }

  static getAllProfiles(): Map<string, PhysicsProfile> {
    return new Map(this.registry);
  }

  static updateProfile(entityId: string, updates: Partial<PhysicsProfile>): boolean {
    const existing = this.registry.get(entityId);
    if (!existing) return false;

    this.registry.set(entityId, { ...existing, ...updates });
    return true;
  }
}
