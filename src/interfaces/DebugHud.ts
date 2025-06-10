import { Entity, Player, system } from "@minecraft/server";

/**
 * 실시간 물리 상태 디버그 HUD
 * 엔티티의 물리 프로퍼티를 액션바에 표시
 */
export class DebugHUD {
    private debugEntities: Set<string> = new Set();
    private updateCounter: number = 0;

    constructor() {
        // 디버그 업데이트는 5틱마다 실행 (성능 최적화)
        system.runInterval(() => {
            this.updateDebugDisplay();
        }, 5);
    }

    /**
     * 엔티티 디버그 정보 업데이트
     */
    public updateEntityDebugInfo(entity: Entity): void {
        if (!entity.isValid) return;

        const entityId = this.getEntityId(entity);
        this.debugEntities.add(entityId);

        // 플레이어에게만 디버그 정보 표시
        if (entity instanceof Player) {
            this.displayDebugInfo(entity);
        }
    }

    /**
     * 디버그 정보 실시간 표시
     */
    private displayDebugInfo(player: Player): void {
        try {
            const velocity = player.getVelocity();
            const location = player.location;

            // 물리 프로퍼티 가져오기
            const velX = player.getDynamicProperty("physics:velx") as number || 0;
            const velY = player.getDynamicProperty("physics:vely") as number || 0;
            const velZ = player.getDynamicProperty("physics:velz") as number || 0;
            const isGrounded = player.getDynamicProperty("physics:isgrounded") as boolean || false;
            const isSliding = player.getDynamicProperty("physics:issliding") as boolean || false;
            const slopeAngle = player.getDynamicProperty("physics:slopeangle") as number || 0;
            const slopeStrength = player.getDynamicProperty("physics:slopestrength") as number || 0;
            const mass = player.getDynamicProperty("physics:mass") as number || 0;
            const friction = player.getDynamicProperty("physics:friction") as number || 0;

            // 업데이트 카운터 (성능 표시용)
            this.updateCounter++;

            // 디버그 메시지 구성
            const debugLines = [
                `§6=== Psybox Physics Debug ===`,
                `§7위치: §f${location.x.toFixed(1)}, ${location.y.toFixed(1)}, ${location.z.toFixed(1)}`,
                `§7실제속도: §f${velocity.x.toFixed(3)}, ${velocity.y.toFixed(3)}, ${velocity.z.toFixed(3)}`,
                `§7시뮬속도: §f${velX.toFixed(3)}, ${velY.toFixed(3)}, ${velZ.toFixed(3)}`,
                `§7상태: §f${isGrounded ? "지면" : "공중"} | ${isSliding ? "미끄러짐" : "안정"}`,
                `§7경사: §f${slopeAngle.toFixed(1)}° (강도: ${slopeStrength.toFixed(2)})`,
                `§7질량: §f${mass}kg | 마찰: §f${friction}`,
                `§8업데이트: ${this.updateCounter}`
            ];

            // 액션바에 표시 (여러 줄을 하나로 합치기)
            const displayText = debugLines.join("\n");
            player.onScreenDisplay.setActionBar(displayText);

        } catch (error) {
            console.error(`디버그 정보 표시 중 오류: ${error}`);
        }
    }

    /**
     * 모든 디버그 엔티티 업데이트
     */
    private updateDebugDisplay(): void {
        // 5틱마다 디버그 정보 갱신
        for (const player of world.getPlayers()) {
            if (player.isValid) {
                const entityId = this.getEntityId(player);
                if (this.debugEntities.has(entityId)) {
                    this.displayDebugInfo(player);
                }
            }
        }

        // 만료된 엔티티 ID 정리 (100번째 업데이트마다)
        if (this.updateCounter % 100 === 0) {
            this.cleanupExpiredEntities();
        }
    }

    /**
     * 만료된 엔티티 정리
     */
    private cleanupExpiredEntities(): void {
        const validEntityIds = new Set<string>();

        // 현재 유효한 엔티티들의 ID 수집
        for (const player of world.getPlayers()) {
            if (player.isValid) {
                validEntityIds.add(this.getEntityId(player));
            }
        }

        // 무효한 엔티티 ID 제거
        for (const entityId of this.debugEntities) {
            if (!validEntityIds.has(entityId)) {
                this.debugEntities.delete(entityId);
            }
        }
    }

    /**
     * 엔티티 고유 ID 생성
     */
    private getEntityId(entity: Entity): string {
        return `${entity.typeId}_${entity.id}`;
    }

    /**
     * 특정 엔티티의 디버그 비활성화
     */
    public disableDebugForEntity(entity: Entity): void {
        const entityId = this.getEntityId(entity);
        this.debugEntities.delete(entityId);

        // 플레이어라면 액션바 클리어
        if (entity instanceof Player && entity.isValid) {
            entity.onScreenDisplay.setActionBar("");
        }
    }

    /**
     * 모든 디버그 비활성화
     */
    public disableAllDebug(): void {
        // 모든 플레이어의 액션바 클리어
        for (const player of world.getPlayers()) {
            if (player.isValid) {
                player.onScreenDisplay.setActionBar("");
            }
        }

        this.debugEntities.clear();
        console.log("[DebugHUD] 모든 디버그 비활성화");
    }

    /**
     * 디버그 통계 정보
     */
    public getDebugStats(): DebugStats {
        return {
            activeEntities: this.debugEntities.size,
            updateCount: this.updateCounter,
            lastUpdate: Date.now()
        };
    }
}

// 디버그 통계 인터페이스
interface DebugStats {
    activeEntities: number;
    updateCount: number;
    lastUpdate: number;
}

// world import 추가
import { world } from "@minecraft/server";
