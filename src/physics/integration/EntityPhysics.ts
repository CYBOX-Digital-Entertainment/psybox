// src/physics/integration/EntityPhysics.ts
import { BlockCollision } from "./BlockCollision";

// 기존 틱 이벤트 내부 추가
if (BlockCollision.checkGroundCollision(entity)) {
  velocity.y = 0; // 바닥에 서있을 때 중력 초기화
}
