import { system, world } from "@minecraft/server";

system.runInterval(() => {
  const overworld = world.getDimension("overworld");
  for (const entity of overworld.getEntities({ type: "cybox:spirra" })) {
    const velX = entity.getDynamicProperty("phys:velX") ?? 0;
    const velY = entity.getDynamicProperty("phys:velY") ?? 0;
    const isGrounded = entity.getDynamicProperty("phys:isGrounded") ?? 0;
    
    entity.nameTag = [
      `속도 X: ${velX}`,
      `속도 Y: ${velY}`,
      `땅 닿음: ${isGrounded ? '✔' : '✖'}`
    ].join('\n');
  }
}, 20); // 1초 주기
