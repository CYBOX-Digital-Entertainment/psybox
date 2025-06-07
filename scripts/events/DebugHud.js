import { world, system } from "@minecraft/server";
// 네임태그로 속도를 실시간 표시
system.runInterval(() => {
    const overworld = world.getDimension("overworld");
    const entities = overworld.getEntities({ type: "cybox:spirra" });
    if (entities.length === 0)
        return;
    for (const entity of entities) {
        const velocity = entity.getVelocity();
        entity.nameTag = `속도: X=${velocity.x.toFixed(2)} Y=${velocity.y.toFixed(2)} Z=${velocity.z.toFixed(2)}`;
        // 디버깅용 로그
        console.log("속도 업데이트 성공");
    }
}, 5); // 0.25초마다 갱신
