import { Entity, Vector3, system } from "@minecraft/server";

export class SlopePhysics {
  private readonly SLOPE_FRICTION = 0.3;

  applySlopePhysics(entity: Entity) {
    const eyePos = entity.getHeadLocation();
    const viewDir = entity.getViewDirection();
    
    const blockHit = entity.dimension.getBlockFromRay(
      eyePos, 
      viewDir, 
      { maxDistance: 5, includeLiquidBlocks: false }
    );

    if (blockHit?.block?.typeId.includes("stairs")) {
      const velocity = entity.getVelocity();
      entity.applyImpulse({
        x: velocity.x * this.SLOPE_FRICTION,
        y: -0.08,
        z: velocity.z * this.SLOPE_FRICTION
      });
    }
  }
}
