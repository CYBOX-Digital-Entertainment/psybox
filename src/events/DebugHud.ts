import { Entity, Player, system } from "@minecraft/server";

export class DebugHud {
    private static debugEntities: Set<Entity> = new Set();

    public static addEntity(entity: Entity): void {
        this.debugEntities.add(entity);
    }

    public static removeEntity(entity: Entity): void {
        this.debugEntities.delete(entity);
    }

    public static updateAll(): void {
        const entitiesToRemove: Entity[] = [];

        for (const entity of this.debugEntities) {
            if (!entity.isValid) {
                entitiesToRemove.push(entity);
                continue;
            }

            this.showEntityDebug(entity);
        }

        // 유효하지 않은 엔티티 제거
        for (const entity of entitiesToRemove) {
            this.debugEntities.delete(entity);
        }
    }

    private static showEntityDebug(entity: Entity): void {
        try {
            const location = entity.location;
            const velocity = entity.getVelocity();

            // 물리 프로퍼티 가져오기
            const velX = entity.getDynamicProperty("psybox:velx") as number || 0;
            const velY = entity.getDynamicProperty("psybox:vely") as number || 0;
            const velZ = entity.getDynamicProperty("psybox:velz") as number || 0;
            const isGrounded = entity.getDynamicProperty("psybox:isgrounded") as boolean || false;
            const isSliding = entity.getDynamicProperty("psybox:issliding") as boolean || false;
            const slopeAngle = entity.getDynamicProperty("psybox:slopeangle") as number || 0;

            const debugInfo = [
                "§e=== Psybox Physics Debug ===",
                `§7엔티티: ${entity.typeId}`,
                `§7위치: §f${location.x.toFixed(1)}, ${location.y.toFixed(1)}, ${location.z.toFixed(1)}`,
                `§7실제속도: §f${velocity.x.toFixed(2)}, ${velocity.y.toFixed(2)}, ${velocity.z.toFixed(2)}`,
                `§7시뮬속도: §f${velX.toFixed(2)}, ${velY.toFixed(2)}, ${velZ.toFixed(2)}`,
                `§7지면접촉: ${isGrounded ? "§a예" : "§c아니오"}`,
                `§7경사상태: ${isSliding ? "§6미끄러짐" : "§a평지"}`,
                `§7경사각도: §f${slopeAngle.toFixed(1)}°`
            ];

            // 근처 플레이어에게 표시
            const nearbyPlayers = entity.dimension.getEntitiesAtBlockLocation(entity.location);
            for (const nearbyEntity of nearbyPlayers) {
                if (nearbyEntity instanceof Player) {
                    nearbyEntity.runCommand(`title @s actionbar ${debugInfo.join("\n")}`);
                }
            }

        } catch (error) {
            console.warn(`[DebugHud] 디버그 표시 오류: ${error}`);
        }
    }
}

// 디버그 HUD 업데이트 루프 시작
system.runInterval(() => {
    DebugHud.updateAll();
}, 5); // 5틱마다 업데이트