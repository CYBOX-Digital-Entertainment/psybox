import { world } from "@minecraft/server";
export class BlockCollision {
    static checkGroundCollision(entity) {
        const pos = entity.location;
        const feetPos = {
            x: pos.x,
            y: pos.y - 0.1,
            z: pos.z
        };
        try {
            const block = world.getDimension("overworld").getBlock(feetPos);
            return block ? this.SOLID_BLOCKS.has(block.typeId) : false;
        }
        catch (e) {
            return false;
        }
    }
    static isSolidBlock(pos) {
        try {
            const block = world.getDimension("overworld").getBlock(pos);
            return block ? this.SOLID_BLOCKS.has(block.typeId) : false;
        }
        catch (e) {
            return false;
        }
    }
}
BlockCollision.SOLID_BLOCKS = new Set([
    'minecraft:stone', 'minecraft:oak_stairs', 'minecraft:stone_slab',
    'minecraft:cobblestone_stairs', 'minecraft:birch_slab', 'minecraft:oak_slab',
    'minecraft:brick_stairs', 'minecraft:quartz_stairs', 'minecraft:cobblestone_slab',
    'minecraft:dirt', 'minecraft:cobblestone', 'minecraft:planks'
]);
