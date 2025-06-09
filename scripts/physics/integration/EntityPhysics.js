import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";
import { BlockCollision } from "./BlockCollision";
import { SlopeDetector } from "./SlopeDetector";
let physicsEnabled = true;
system.runInterval(() => {
    if (!physicsEnabled)
        return;
    try {
        const overworld = world.getDimension("overworld");
        const entities = overworld.getEntities({ type: "cybox:spirra" });
        for (const entity of entities) {
            try {
                if (!entity.isValid)
                    continue;
                const profile = PhysicsComponent.getProfile(entity.typeId);
                if (!profile)
                    continue;
                const body = new RigidBody(entity, profile);
                const isGrounded = BlockCollision.checkGroundCollision(entity);
                const slope = SlopeDetector.getSlopeInfo(entity);
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
                // 프로퍼티 동기화
                entity.setDynamicProperty("phys:isgrounded", isGrounded);
            }
            catch (entityError) {
                // 개별 엔티티 오류 무시
            }
        }
    }
    catch (systemError) {
        // 시스템 오류 시 물리 일시 중단
        physicsEnabled = false;
        system.runTimeout(() => {
            physicsEnabled = true;
        }, 100);
    }
}, 2); // 2틱마다 실행 (성능 최적화)
// Script 이벤트로 물리 토글
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id === "psybox:physics_toggle") {
        physicsEnabled = !physicsEnabled;
        world.sendMessage(physicsEnabled ? "§a물리 엔진 활성화" : "§c물리 엔진 비활성화");
    }
});
console.log("✅ 물리 엔진 시스템 초기화 완료");
