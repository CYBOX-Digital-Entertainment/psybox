import { world } from "@minecraft/server";
// 블록 충돌 검출 유틸리티
export class BlockCollision {
    static isSolidBlock(pos) {
        try {
            const block = world.getDimension('overworld').getBlock(pos);
            return block?.typeId ? this.SOLID_BLOCKS.has(block.typeId) : false;
        }
        catch (e) {
            console.error("BlockCollision Error:", e);
            return false;
        }
    }
    static checkGroundCollision(entity) {
        const feetPos = {
            x: entity.location.x,
            y: entity.location.y - 0.5,
            z: entity.location.z
        };
        return this.isSolidBlock(feetPos);
    }
}
BlockCollision.SOLID_BLOCKS = new Set([
    'minecraft:stone', 'minecraft:dirt', 'minecraft:cobblestone',
    'minecraft:planks', 'minecraft:bedrock', 'minecraft:glass'
]);
