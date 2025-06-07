import { world } from "@minecraft/server";
export class BlockCollision {
    // 블록 ID 검사 메서드
    static isSolidBlock(pos) {
        const block = world.getDimension('overworld').getBlock(pos);
        return block ? this.SOLID_BLOCKS.has(block.typeId) : false; // id → typeId로 수정
    }
    // 바닥 충돌 검출 메서드 (정적 메서드로 명시)
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
