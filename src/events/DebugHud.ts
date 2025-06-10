import { Entity, Player, world } from "@minecraft/server"; // world 추가 임포트

export class DebugHUD {
    private activePlayers = new Set<string>();

    public toggle(entity?: Entity) {
        if (entity instanceof Player) {
            const username = entity.name;
            this.activePlayers[this.activePlayers.has(username) ? 'delete' : 'add'](username);
        }
    }

    public update(entity: Entity) {
        if (this.activePlayers.size === 0) return;
        
        const velocity = entity.getVelocity();
        const debugInfo = [
            `VelX: ${velocity.x.toFixed(2)}`,
            `VelY: ${velocity.y.toFixed(2)}`,
            `VelZ: ${velocity.z.toFixed(2)}`,
            `Grounded: ${entity.isOnGround}`
        ].join(' | ');

        for (const playerName of this.activePlayers) {
            const player = [...world.getPlayers()].find(p => p.name === playerName);
            player?.sendMessage(`§a[Psybox] ${debugInfo}`);
        }
    }
}
