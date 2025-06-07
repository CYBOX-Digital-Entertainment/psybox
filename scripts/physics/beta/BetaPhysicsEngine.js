import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { SlopeDetector } from "./SlopeDetector";
import { ForceApplicator } from "./ForceApplicator";
/**
 * 베타 API 2.1.0 기반 고성능 물리엔진
 * MACHINE_BUILDER + MajestikButter 스타일 구현
 */
export class BetaPhysicsEngine {
    static initialize() {
        if (this.isRunning) {
            console.log("⚠️ Physics engine already running");
            return;
        }
        console.log("🚀 Initializing Beta Physics Engine v2.1.0");
        // 고주파 물리 루프 (매 틱 실행)
        this.physicsLoopId = system.runInterval(() => {
            this.processPhysics();
        }, 1);
        // 저주파 상태 업데이트 (20틱마다)
        system.runInterval(() => {
            this.updateSystemStatus();
        }, 20);
        this.isRunning = true;
        console.log("✅ Beta Physics Engine Started");
    }
    static processPhysics() {
        try {
            const overworld = world.getDimension("overworld");
            const entities = overworld.getEntities({ type: "cybox:spirra" });
            this.entityCount = entities.length;
            for (const entity of entities) {
                this.processEntityPhysics(entity);
            }
        }
        catch (error) {
            console.warn("⚠️ Physics loop error:", error);
        }
    }
    static processEntityPhysics(entity) {
        try {
            if (!entity || !entity.isValid())
                return;
            const profile = PhysicsComponent.getProfile(entity.typeId);
            if (!profile)
                return;
            const body = new RigidBody(entity, profile);
            const slopeInfo = SlopeDetector.detectSlope(entity);
            // 경사면 물리 적용
            if (slopeInfo.isOnSlope) {
                ForceApplicator.applySlopePhysics(body, slopeInfo);
                entity.setDynamicProperty("phys:issliding", true);
                entity.setDynamicProperty("phys:slopeangle", slopeInfo.angle * 180 / Math.PI);
            }
            else {
                // 일반 중력 물리
                ForceApplicator.applyGravity(body);
                ForceApplicator.applyAirResistance(body);
                entity.setDynamicProperty("phys:issliding", false);
                entity.setDynamicProperty("phys:slopeangle", 0);
            }
            // 속도 동기화
            const velocity = entity.getVelocity();
            entity.setDynamicProperty("phys:velx", velocity.x.toFixed(3));
            entity.setDynamicProperty("phys:vely", velocity.y.toFixed(3));
            entity.setDynamicProperty("phys:velz", velocity.z.toFixed(3));
        }
        catch (error) {
            // 개별 엔티티 오류 무시 (시스템 안정성)
        }
    }
    static updateSystemStatus() {
        console.log(`📊 Physics Status: ${this.entityCount} entities processed`);
    }
    static stop() {
        if (this.physicsLoopId !== undefined) {
            system.clearRun(this.physicsLoopId);
            this.physicsLoopId = undefined;
        }
        this.isRunning = false;
        console.log("🛑 Beta Physics Engine Stopped");
    }
    static isEngineRunning() {
        return this.isRunning;
    }
    static getEntityCount() {
        return this.entityCount;
    }
}
BetaPhysicsEngine.isRunning = false;
BetaPhysicsEngine.entityCount = 0;
