import { PhysicsProfile } from "./PhysicsComponent";

export interface PhysicsProfile {
  mass: number;
  gravityMultiplier: number;
  bounceFactor: number;
  airResistance: number;
  maxVelocity: { x: number, y: number, z: number };
}

export class PhysicsComponent {
  private static registry = new Map<string, PhysicsProfile>();

  static registerEntity(identifier: string, config: Partial<PhysicsProfile>) {
    this.registry.set(identifier, {
      mass: config.mass ?? 1.0,
      gravityMultiplier: config.gravityMultiplier ?? 1.0,
      bounceFactor: config.bounceFactor ?? 0.5,
      airResistance: config.airResistance ?? 0.98,
      maxVelocity: config.maxVelocity ?? { x: 3, y: 3, z: 3 }
    });
  }

  static getProfile(entityId: string): PhysicsProfile | undefined {
    return this.registry.get(entityId);
  }
}
