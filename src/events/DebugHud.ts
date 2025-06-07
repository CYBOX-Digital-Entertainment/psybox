import { system, world } from "@minecraft/server";
import { SlopeDetector } from "../physics/integration/SlopeDetector";

system.runInterval(() => {
  const overworld = world.getDimension("overworld");
  for (const entity of overworld.getEntities({ type: "cybox:spirra" })) {
    const velocity = entity.getVelocity();
    const slope = SlopeDetector.getSlopeInfo(entity);
    entity.nameTag = [
      `각도: ${(slope.angle * 180 / Math.PI).toFixed(1)}°`,
      `속도 X: ${velocity.x.toFixed(2)}`,
      `속도 Z: ${velocity.z.toFixed(2)}`
    ].join('\n');
  }
}, 10);
