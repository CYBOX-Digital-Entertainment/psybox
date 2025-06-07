import { world, system } from "@minecraft/server";
class PhysicsDebugger {
    static showVelocity(entity) {
        const velocity = entity.getVelocity();
        // 네임태그에 속도 정보 표시 (안정화 API 지원)
        entity.nameTag = `속도: X=${velocity.x.toFixed(2)} Y=${velocity.y.toFixed(2)} Z=${velocity.z.toFixed(2)}`;
    }
}
system.runInterval(() => {
    const overworld = world.getDimension("overworld");
    for (const entity of overworld.getEntities({ type: "cybox:spirra" })) {
        PhysicsDebugger.showVelocity(entity);
    }
}, 10); // 10틱(0.5초) 주기
// 초기 소환 시 기본 이름 설정 유지
world.afterEvents.entitySpawn.subscribe(({ entity }) => {
    if (entity.typeId === "cybox:spirra") {
        entity.nameTag = "물리 엔진 테스트 엔티티"; // 기본값
    }
});
