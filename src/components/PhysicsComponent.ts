// src/components/PhysicsComponent.ts
export interface PhysicsProfile {
  mass: number;
  gravityMultiplier: number;
  bounceFactor: number;
  airResistance: number;
  maxVelocity: { x: number, y: number, z: number };
}
