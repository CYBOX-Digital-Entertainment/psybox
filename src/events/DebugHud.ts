import { world, system, Entity } from "@minecraft/server";
import { BlockCollision } from "../physics/integration/BlockCollision";

system.runInterval(() => {
  const overworld = world.getDimension("overworld");
  const entities = overworld.getEntities({ type: "cybox:spirra" });
  if (entities.length === 0) return;

  for (const entity of entities) {
    const velocity = entity.getVelocity();
    entity.nameTag = `속도 Y: ${velocity.y.toFixed(2)}m/s\n` +
                     `땅 충돌: ${BlockCollision.checkGroundCollision(entity) ? "O" : "X"}`;
  }
}, 10);
