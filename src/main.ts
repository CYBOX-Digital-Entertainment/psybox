import { world, system } from "@minecraft/server";
import { PhysicsComponent } from "./components/PhysicsComponent";
import "./physics/integration/EntityPhysics";
import "./events/DebugHud"; // 디버그 HUD 모듈 추가
import { PhysicsState } from "./components/PhysicsState"; // 물리 상태 관리 추가

// 엔티티 물리 프로파일 등록 (메모리 항목 [3] 반영)
PhysicsComponent.registerEntity("cybox:spirra", {
  mass: 1.5,
  gravityMultiplier: 0.8,
  bounceFactor: 0.7,
  airResistance: 0.95,
  maxVelocity: { x: 5.0, y: 5.0, z: 5.0 }
});

// 물리 엔진 초기화 (메모리 항목 [1] 반영)
system.run(() => {
  console.log("물리 엔진 초기화 완료");
});

// 주기적 디버그 정보 업데이트 (메모리 항목 [6] 반영)
system.runInterval(() => {
  const overworld = world.getDimension("overworld");
  for (const entity of overworld.getEntities({ type: "cybox:spirra" })) {
    const velocity = entity.getVelocity();
    PhysicsState.update(entity); // 동적 프로퍼티 업데이트
    entity.setDynamicProperty("phys:velX", velocity.x.toFixed(2));
    entity.setDynamicProperty("phys:velY", velocity.y.toFixed(2));
    entity.setDynamicProperty("phys:velZ", velocity.z.toFixed(2));
  }
}, 10);
