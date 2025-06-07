import { system, world } from "@minecraft/server";
import { SlopeDetector } from "../physics/integration/SlopeDetector";
import { BlockCollision } from "../physics/integration/BlockCollision";

system.runInterval(() => {
  const overworld = world.getDimension("overworld");
  
  for (const entity of overworld.getEntities({ type: "cybox:spirra" })) {
    const velocity = entity.getVelocity();
    const slope = SlopeDetector.getSlopeInfo(entity);
    const isGrounded = BlockCollision.checkGroundCollision(entity);
    
    // 네임태그에 실시간 정보 표시
    entity.nameTag = [
      `속도: ${Math.sqrt(velocity.x*velocity.x + velocity.z*velocity.z).toFixed(2)}m/s`,
      `경사: ${(slope.angle * 180/Math.PI).toFixed(1)}°`,
      `미끄러짐: ${slope.strength > 0.1 ? "O" : "X"}`,
      `지면: ${isGrounded ? "O" : "X"}`
    ].join('\n');
    
    // 콘솔 디버깅 (필요시)
    if (slope.strength > 0.1) {
      console.log(`Spirra 경사 감지: ${(slope.angle * 180/Math.PI).toFixed(1)}°, 강도: ${slope.strength.toFixed(2)}`);
    }
  }
}, 20); // 1초마다 업데이트
