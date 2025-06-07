// components/PhysicsComponent.ts
interface PhysicsProfile {
  gravityMultiplier: number;
  mass: number;
  friction: number;
}

class PhysicsComponent {
  static registry = new Map<string, PhysicsProfile>();

  static registerEntity(
    identifier: string, 
    config: Partial<PhysicsProfile> = {}
  ) {
    this.registry.set(identifier, {
      gravityMultiplier: config.gravityMultiplier ?? 1.0,
      mass: config.mass ?? 1.0,
      friction: config.friction ?? 0.2
    });
  }
}
