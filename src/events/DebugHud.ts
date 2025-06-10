import { Entity, Player } from "@minecraft/server";

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
            `X: ${velocity.x.toFixed(2)}`,
            `Y: ${velocity.y.toFixed(2)}`,
            `Z: ${velocity.z.toFixed(2)}`,
            `Grounded: ${entity.isOnGround}`
        ].join(' | ');

        for (const playerName of this.activePlayers) {
            const player = [...world.getPlayers()].find(p => p.name === playerName);
            player?.sendMessage(debugInfo);
        }
    }
}
