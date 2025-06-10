import { Entity, Vector3 } from "@minecraft/server";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data"; // BlockTypes로 변경

export class SlopePhysics {
    private readonly SLOPE_FRICTION = 0.3;

    applySlopePhysics(entity: Entity) {
        const eyePos = entity.getHeadLocation();
        const viewDir = entity.getViewDirection();
        
        const blockHit = entity.dimension.getBlockFromRay(
            eyePos, 
            viewDir, 
            { maxDistance: 5 }
        );

        // 블록 타입으로 경사면 판별
        if (blockHit?.block?.typeId === MinecraftBlockTypes.StoneStairs) {
            const velocity = entity.getVelocity();
            entity.applyImpulse({
                x: velocity.x * this.SLOPE_FRICTION,
                y: -0.08,
                z: velocity.z * this.SLOPE_FRICTION
            });
        }
    }
}
