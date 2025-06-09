import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";
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
                if (!entity.isValid())
                    continue;
                const profile = PhysicsComponent.getProfile(entity.typeId);
                if (!profile)
                    continue;
                const body = new RigidBody(entity, profile);
                const slope = SlopeDetector.getSlopeInfo(entity);
                // 경사면 물리 우선 적용
                if (slope.strength > 0.1) {
                    ForceManager.applySlopePhysics(body, slope);
                }
                else {
                    // 일반 물리 적용
                    ForceManager.applyGravity(body);
                    ForceManager.applyAirResistance(body);
                }
                // 지면 충돌 간단 체크
                const velocity = entity.getVelocity();
                if (velocity.y <= 0 && entity.location.y <= 2) {
                    ForceManager.handleGroundCollision(body);
                }
                // 프로퍼티 동기화
                entity.setDynamicProperty("phys:velx", velocity.x.toFixed(2));
                entity.setDynamicProperty("phys:vely", velocity.y.toFixed(2));
                entity.setDynamicProperty("phys:velz", velocity.z.toFixed(2));
            }
            catch (entityError) {
                console.warn("엔티티 물리 처리 오류:", entityError);
            }
        }
    }
    catch (systemError) {
        console.warn("물리 시스템 오류:", systemError);
        // 시스템 오류 시 물리 일시 중단
        physicsEnabled = false;
        system.runTimeout(() => {
            physicsEnabled = true;
        }, 100);
    }
}, 2); // 2틱마다 실행 (성능 최적화)
