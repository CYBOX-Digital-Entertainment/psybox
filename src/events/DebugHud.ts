import { world, system, Entity } from "@minecraft/server";
import { BlockCollision } from "../physics/integration/BlockCollision";

// 네임태그로 실시간 속도 및 충돌 상태 표시
system.runInterval(() => {
  const overworld = world.getDimension("overworld");
  const entities = overworld.getEntities({ type: "cybox:spirra" });
  if (entities.length === 0) return;

  for (const entity of entities) {
    const velocity = entity.getVelocity();
    entity.nameTag = `속도 Y: ${velocity.y.toFixed(2)}m/s\n` +
                     `땅 충돌: ${BlockCollision.checkGroundCollision(entity) ? "O" : "X"}`;
    console.log("Y속도:", velocity.y, "충돌:", BlockCollision.checkGroundCollision(entity));
  }
}, 10); // 0.5초마다 갱신
