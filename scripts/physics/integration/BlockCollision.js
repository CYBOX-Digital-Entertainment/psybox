import { world } from "@minecraft/server";
export class BlockCollision {
    static isSolidBlock(pos) {
        const block = world.getDimension('overworld').getBlock(pos);
        return block ? this.SOLID_BLOCKS.has(block.typeId) : false;
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
