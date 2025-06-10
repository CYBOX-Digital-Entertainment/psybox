import { system, world, Entity, Vector3 } from "@minecraft/server";

export class VehiclePhysics {
  private static readonly GRAVITY = -0.08;
  private static readonly FRICTION = 0.98;
  private readonly overworld = world.getDimension("overworld");

  constructor() {
    system.runInterval(() => this.updatePhysics());
  }

  private updatePhysics() {
    for (const entity of this.overworld.getEntities({ type: "car:basic" })) {
      if (entity.isValid) this.applyVehiclePhysics(entity);
    }
  }

  private applyVehiclePhysics(entity: Entity) {
    const velocity = entity.getVelocity();
    const groundNormal = this.detectSlope(entity);
    const slopeFactor = 1 - Math.abs(groundNormal.y);
    
    const newVelocity: Vector3 = {
      x: velocity.x * VehiclePhysics.FRICTION * slopeFactor,
      y: velocity.y + VehiclePhysics.GRAVITY,
      z: velocity.z * VehiclePhysics.FRICTION * slopeFactor
    };

    entity.applyImpulse(newVelocity);
  }

  private detectSlope(entity: Entity): Vector3 {
    const location = entity.location;
    const block = this.overworld.getBlock(location);
    return block?.permutation.getState("ground_normal") as Vector3 || { x: 0, y: 1, z: 0 };
  }
}

new VehiclePhysics();
