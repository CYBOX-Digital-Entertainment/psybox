import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";
import { SlopeDetector } from "./SlopeDetector";
import { BetaSlopePhysics } from "../beta/SlopePhysics";

// 물리 시스템 상태
let physicsEnabled = true;
let systemInitialized = false;

// GameTest 등록 (한 번만 실행)
if (!systemInitialized) {
  BetaSlopePhysics.registerTests();
  systemInitialized = true;
}

// 메인 물리 루프 (2틱마다 실행)
system.runInterval(() => {
  if (!physicsEnabled) return;

  try {
    const overworld = world.getDimension("overworld");
    const entities = overworld.getEntities({ type: "cybox:spirra" });

    for (const entity of entities) {
      try {
        if (!entity.isValid()) continue;

        const profile = PhysicsComponent.getProfile(entity.typeId);
        if (!profile) continue;

        const body = new RigidBody(entity, profile);
        const slope = SlopeDetector.getSlopeInfo(entity);

        // 지면 접촉 확인 (간단한 Y 좌표 체크)
        const location = entity.location;
        const isGrounded = location.y <= Math.floor(location.y) + 1.1;

        // 물리 효과 적용
        if (slope.strength > 0.05 && isGrounded) {
          // 경사면 물리 우선 적용
          ForceManager.applySlopePhysics(body, slope);
        } else {
          // 일반 중력과 공기저항
          ForceManager.applyGravity(body);
          ForceManager.applyAirResistance(body);
        }

        // 지면 충돌 처리
        if (isGrounded && entity.getVelocity().y <= 0) {
          ForceManager.handleGroundCollision(body);
        }

        // 프로퍼티 동기화
        const velocity = entity.getVelocity();
        body.setDynamicProperty("phys:velx", parseFloat(velocity.x.toFixed(3)));
        body.setDynamicProperty("phys:vely", parseFloat(velocity.y.toFixed(3)));
        body.setDynamicProperty("phys:velz", parseFloat(velocity.z.toFixed(3)));
        body.setDynamicProperty("phys:isgrounded", isGrounded);

        // 물리 프로파일 값 동기화
        body.setDynamicProperty("phys:mass", profile.mass);
        body.setDynamicProperty("phys:friction", profile.frictionCoefficient);

      } catch (entityError) {
        // 개별 엔티티 오류 무시
        console.warn("엔티티 물리 처리 오류:", entityError);
      }
    }
  } catch (systemError) {
    // 시스템 오류 시 물리 일시 중단
    console.warn("물리 시스템 오류:", systemError);
    physicsEnabled = false;

    // 5초 후 재시작
    system.runTimeout(() => {
      physicsEnabled = true;
      console.log("물리 시스템 재시작됨");
    }, 100);
  }
}, 2); // 2틱마다 실행

console.log("✅ 엔티티 물리 시스템 초기화 완료");
