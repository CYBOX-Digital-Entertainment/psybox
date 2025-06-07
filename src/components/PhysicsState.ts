// src/components/PhysicsState.ts
/**
 * 엔티티의 물리 상태를 Molang 변수로 변환하는 모듈
 * - velocityX/Y/Z: 현재 속도 벡터
 * - isGrounded: 바닥 접촉 여부
 */
export class PhysicsState {
  static update(entity: Entity) {
    const velocity = entity.getVelocity();
    const isGrounded = BlockCollision.checkGroundCollision(entity);
    
    // Molang 변수 설정 (애니메이션에서 사용)
    entity.setDynamicProperty("phys:velX", velocity.x.toFixed(2));
    entity.setDynamicProperty("phys:velY", velocity.y.toFixed(2));
    entity.setDynamicProperty("phys:velZ", velocity.z.toFixed(2));
    entity.setDynamicProperty("phys:isGrounded", isGrounded ? 1 : 0);
    
    // 디버그 로그
    console.log(`물리 상태 업데이트: ${entity.id}`, velocity);
  }
}
