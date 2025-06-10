import { Entity, Player, world, system } from "@minecraft/server";

// Observer 패턴으로 구현된 디버그 HUD 클래스
export class DebugHUD {
    private static instance: DebugHUD;
    private activeEntities: Set<string> = new Set();
    private updateInterval: number = 0;

    private constructor() {
        this.initializeHUD();
    }

    public static getInstance(): DebugHUD {
        if (!DebugHUD.instance) {
            DebugHUD.instance = new DebugHUD();
        }
        return DebugHUD.instance;
    }

    private initializeHUD(): void {
        // 5틱마다 업데이트 (1초에 4번)
        this.updateInterval = system.runInterval(() => {
            this.updateAllHUDs();
        }, 5);
    }

    public addEntity(entityId: string): void {
        this.activeEntities.add(entityId);
    }

    public removeEntity(entityId: string): void {
        this.activeEntities.delete(entityId);
    }

    public clear(): void {
        this.activeEntities.clear();
    }

    private updateAllHUDs(): void {
        try {
            const entitiesToRemove: string[] = [];

            for (const entityId of this.activeEntities) {
                const entity = world.getEntity(entityId);

                // isValid() 메서드가 아닌 isValid 프로퍼티 사용
                if (!entity || !entity.isValid) {
                    entitiesToRemove.push(entityId);
                    continue;
                }

                this.updateEntityHUD(entity);
            }

            // 유효하지 않은 엔티티 제거
            entitiesToRemove.forEach(entityId => {
                this.activeEntities.delete(entityId);
            });

        } catch (error) {
            console.error("§c[DebugHUD] HUD 업데이트 실패:", error);
        }
    }

    private updateEntityHUD(entity: Entity): void {
        try {
            // 주변 플레이어들에게 디버그 정보 표시
            const nearbyPlayers = entity.dimension.getPlayers({
                location: entity.location,
                maxDistance: 15
            });

            const debugInfo = this.getEntityDebugInfo(entity);

            nearbyPlayers.forEach(player => {
                this.displayHUDToPlayer(player, entity, debugInfo);
            });

        } catch (error) {
            console.error("§c[DebugHUD] 엔티티 HUD 업데이트 실패:", error);
        }
    }

    private getEntityDebugInfo(entity: Entity): any {
        try {
            const velocity = entity.getVelocity();
            const location = entity.location;

            // 물리 프로퍼티 가져오기
            const physicsData = {
                velx: entity.getDynamicProperty("physics:velx") || velocity.x,
                vely: entity.getDynamicProperty("physics:vely") || velocity.y,
                velz: entity.getDynamicProperty("physics:velz") || velocity.z,
                isgrounded: entity.getDynamicProperty("physics:isgrounded") || false,
                issliding: entity.getDynamicProperty("physics:issliding") || false,
                slopeangle: entity.getDynamicProperty("physics:slopeangle") || 0,
                mass: entity.getDynamicProperty("physics:mass") || 100,
                friction: entity.getDynamicProperty("physics:friction") || 0.7
            };

            return {
                id: entity.id,
                typeId: entity.typeId,
                location: {
                    x: location.x.toFixed(2),
                    y: location.y.toFixed(2),
                    z: location.z.toFixed(2)
                },
                velocity: {
                    x: velocity.x.toFixed(3),
                    y: velocity.y.toFixed(3),
                    z: velocity.z.toFixed(3)
                },
                physics: physicsData
            };

        } catch (error) {
            console.error("§c[DebugHUD] 디버그 정보 수집 실패:", error);
            return null;
        }
    }

    private displayHUDToPlayer(player: Player, entity: Entity, debugInfo: any): void {
        try {
            if (!debugInfo) return;

            const distance = this.calculateDistance(player.location, entity.location);

            // 거리 기반 상세도 조절
            if (distance < 5) {
                this.showDetailedHUD(player, debugInfo);
            } else if (distance < 10) {
                this.showBasicHUD(player, debugInfo);
            } else {
                this.showMinimalHUD(player, debugInfo);
            }

        } catch (error) {
            console.error("§c[DebugHUD] 플레이어 HUD 표시 실패:", error);
        }
    }

    private showDetailedHUD(player: Player, debugInfo: any): void {
        const hudText = [
            `§6=== Psybox Physics Debug ===`,
            `§7Entity: §f${debugInfo.typeId}`,
            `§7Location: §f${debugInfo.location.x}, ${debugInfo.location.y}, ${debugInfo.location.z}`,
            `§7Velocity: §f${debugInfo.velocity.x}, ${debugInfo.velocity.y}, ${debugInfo.velocity.z}`,
            `§7Physics Vel: §f${debugInfo.physics.velx.toFixed(3)}, ${debugInfo.physics.vely.toFixed(3)}, ${debugInfo.physics.velz.toFixed(3)}`,
            `§7Ground: §f${debugInfo.physics.isgrounded ? "§aYes" : "§cNo"}`,
            `§7Sliding: §f${debugInfo.physics.issliding ? "§eYes" : "§7No"}`,
            `§7Slope: §f${debugInfo.physics.slopeangle.toFixed(1)}°`,
            `§7Mass: §f${debugInfo.physics.mass}kg`,
            `§7Friction: §f${debugInfo.physics.friction}`
        ].join("\n");

        player.onScreenDisplay.setActionBar(hudText);
    }

    private showBasicHUD(player: Player, debugInfo: any): void {
        const hudText = [
            `§6Psybox Debug`,
            `§7Pos: §f${debugInfo.location.x}, ${debugInfo.location.y}, ${debugInfo.location.z}`,
            `§7Vel: §f${debugInfo.velocity.x}, ${debugInfo.velocity.y}, ${debugInfo.velocity.z}`,
            `§7Ground: §f${debugInfo.physics.isgrounded ? "§aYes" : "§cNo"} §7Slide: §f${debugInfo.physics.issliding ? "§eYes" : "§7No"}`
        ].join("\n");

        player.onScreenDisplay.setActionBar(hudText);
    }

    private showMinimalHUD(player: Player, debugInfo: any): void {
        const hudText = `§6Psybox §7Vel: §f${debugInfo.velocity.x}, ${debugInfo.velocity.y}, ${debugInfo.velocity.z}`;
        player.onScreenDisplay.setActionBar(hudText);
    }

    private calculateDistance(pos1: any, pos2: any): number {
        return Math.sqrt(
            Math.pow(pos1.x - pos2.x, 2) +
            Math.pow(pos1.y - pos2.y, 2) +
            Math.pow(pos1.z - pos2.z, 2)
        );
    }

    public destroy(): void {
        if (this.updateInterval !== 0) {
            system.clearRun(this.updateInterval);
            this.updateInterval = 0;
        }
        this.clear();
    }
}
