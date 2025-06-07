import { world, system, Entity } from "@minecraft/server";

// 네임태그를 통한 실시간 속도 표시 (안정화 API만 사용)
system.runInterval(() => {
  const overworld = world.getDimension("overworld");
  const entities = overworld.getEntities({ type: "cybox:spirra" });
  if (entities.length === 0) return;

  for (const entity of entities) {
    const velocity = entity.getVelocity();
    entity.nameTag = `속도: ${velocity.y.toFixed(2)}m/s`;
    console.log("Y속도:", velocity.y); // Y축 속도만 집중 모니터링
  }
}, 10); // 0.5초 주기
