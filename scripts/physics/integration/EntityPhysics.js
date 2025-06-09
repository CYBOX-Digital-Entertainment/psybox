import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";
import { BlockCollision } from "./BlockCollision";
import { SlopeDetector } from "./SlopeDetector";
/**
 * Script API 2.0.0-beta 호환 통합 물리 엔진 메인 루프
 */
// 메인 루프 제어 변수
let physicsEnabled = true;
let entityProcessCounter = 0;
// 분산 처리를 위한 물리 엔진 주요 로직
system.runInterval(() => {
    if (!physicsEnabled)
        return;
    try {
        const overworld = world.getDimension("overworld");
        const entities = overworld.getEntities({ type: "cybox:spirra" });
        // 각 틱마다 하나의 엔티티만 처리 (분산 처리)
        if (entities.length > 0) {
            entityProcessCounter = (entityProcessCounter + 1) % entities.length;
            const entity = entities[entityProcessCounter];
            if (entity && entity.isValid()) {
                processEntityPhysics(entity);
            }
        }
    }
    catch (systemError) {
        // 시스템 오류 시 물리 일시 중단 후 복구
        physicsEnabled = false;
        console.warn("물리 시스템 오류:", systemError);
        system.runTimeout(() => {
            physicsEnabled = true;
            console.log("물리 시스템 복구 완료");
        }, 100);
    }
}, 1); // 매 틱마다 실행
/**
 * 개별 엔티티 물리 처리 함수
 */
function processEntityPhysics(entity) {
    try {
        const profile = PhysicsComponent.getProfile(entity.typeId);
        if (!profile)
            return;
        const body = new RigidBody(entity, profile);
        // 경사면 검출
        const slope = SlopeDetector.getSlopeInfo(entity);
        const isGrounded = BlockCollision.checkGroundCollision(entity);
        // 경사면 물리 우선 적용
        if (slope.strength > 0.1 && isGrounded) {
            ForceManager.applySlopePhysics(body, slope);
        }
        else {
            // 일반 중력과 공기저항
            ForceManager.applyGravity(body);
            ForceManager.applyAirResistance(body);
        }
        // 지면 충돌 처리
        if (isGrounded && entity.getVelocity().y <= 0) {
            ForceManager.handleGroundCollision(body);
        }
        // 물리 상태 동기화
        const velocity = entity.getVelocity();
        entity.setDynamicProperty("phys:velx", parseFloat(velocity.x.toFixed(3)));
        entity.setDynamicProperty("phys:vely", parseFloat(velocity.y.toFixed(3)));
        entity.setDynamicProperty("phys:velz", parseFloat(velocity.z.toFixed(3)));
        entity.setDynamicProperty("phys:isgrounded", isGrounded);
    }
    catch (entityError) {
        // 개별 엔티티 처리 오류는 무시
    }
}
