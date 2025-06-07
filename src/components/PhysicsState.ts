// src/components/PhysicsState.ts
import { Entity } from "@minecraft/server"; // Entity 임포트 추가
import { BlockCollision } from "../physics/integration/BlockCollision"; // 경로 수정

export class PhysicsState {
  static update(entity: Entity) {
    const velocity = entity.getVelocity();
    const isGrounded = BlockCollision.checkGroundCollision(entity);
    
    // Molang 변수 설정 (애니메이션에서 사용)
    entity.setDynamicProperty("phys:velX", velocity.x.toFixed(2));
    entity.setDynamicProperty("phys:velY", velocity.y.toFixed(2));
    entity.setDynamicProperty("phys:velZ", velocity.z.toFixed(2));
    entity.setDynamicProperty("phys:isGrounded", isGrounded ? 1 : 0);
  }
}
