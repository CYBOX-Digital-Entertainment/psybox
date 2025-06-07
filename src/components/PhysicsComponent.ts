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
  private static isInitialized = false;

  static registerEntity(identifier: string, config: Partial<PhysicsProfile>) {
    const profile: PhysicsProfile = {
      mass: config.mass ?? 1.0,
      gravityMultiplier: config.gravityMultiplier ?? 1.0,
      bounceFactor: config.bounceFactor ?? 0.5,
      airResistance: config.airResistance ?? 0.98,
      maxVelocity: config.maxVelocity ?? { x: 3, y: 3, z: 3 },
      slopeForce: config.slopeForce ?? 0.1,
      frictionCoefficient: config.frictionCoefficient ?? 0.1
    };

    this.registry.set(identifier, profile);
    console.log(`🔧 Physics Profile Registered: ${identifier}`);
    console.log(`   Mass: ${profile.mass}, Gravity: ${profile.gravityMultiplier}x`);
    console.log(`   Max Velocity: ${JSON.stringify(profile.maxVelocity)}`);

    this.isInitialized = true;
  }

  static getProfile(entityId: string): PhysicsProfile | undefined {
    return this.registry.get(entityId);
  }

  static getAllProfiles(): Map<string, PhysicsProfile> {
    return new Map(this.registry);
  }

  static isProfileRegistered(entityId: string): boolean {
    return this.registry.has(entityId);
  }

  static getRegisteredCount(): number {
    return this.registry.size;
  }

  static isSystemInitialized(): boolean {
    return this.isInitialized;
  }
}