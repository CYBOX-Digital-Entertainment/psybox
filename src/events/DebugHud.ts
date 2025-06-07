import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { WatchdogManager } from "../physics/beta/WatchdogManager";
import { BetaPhysicsEngine } from "../physics/beta/BetaPhysicsEngine";

/**
 * 실시간 물리 디버그 시스템
 * 엔티티별 상세 정보와 시스템 상태 표시
 */
export class DebugHud {
  private static isEnabled = true;
  private static updateCounter = 0;

  static initialize(): void {
    console.log("🐛 Debug HUD Initialized");

    // 엔티티별 디버그 정보 업데이트 (2초마다)
    system.runInterval(() => {
      if (!this.isEnabled) return;
      this.updateEntityDebugInfo();
    }, 40);

    // 시스템 상태 디버그 (5초마다)
    system.runInterval(() => {
      if (!this.isEnabled) return;
      this.updateSystemDebugInfo();
    }, 100);
  }

  private static updateEntityDebugInfo(): void {
    try {
      const overworld = world.getDimension("overworld");
      const entities = overworld.getEntities({ type: "cybox:spirra" });

      for (const entity of entities) {
        try {
          const velocity = entity.getVelocity();
          const isSliding = entity.getDynamicProperty("phys:issliding") || false;
          const slopeAngle = entity.getDynamicProperty("phys:slopeangle") || 0;
          const speed = Math.sqrt(velocity.x**2 + velocity.z**2);

          // 컬러풀한 네임태그 생성
          const debugInfo = [
            `§6🚗 Cybox Spirra Physics`,
            `§f속도: §e${speed.toFixed(2)}§7m/s`,
            `§f미끄러짐: ${isSliding ? "§a✓" : "§c✗"}`,
            `§f경사: §b${Number(slopeAngle).toFixed(1)}§7°`,
            `§f상태: ${this.getMotionState(velocity)}`,
            `§8Y: ${velocity.y.toFixed(2)}m/s`
          ].join("\n");

          entity.nameTag = debugInfo;

        } catch (entityError) {
          // 개별 엔티티 오류 무시
        }
      }
    } catch (systemError) {
      // 시스템 오류 무시
    }
  }

  private static updateSystemDebugInfo(): void {
    this.updateCounter++;

    if (this.updateCounter % 5 === 0) { // 25초마다 상세 로그
      const status = [
        "📊 Physics Engine Status Report:",
        `   🛡️ Watchdog: ${WatchdogManager.getStatus()}`,
        `   🚀 Engine: ${BetaPhysicsEngine.isEngineRunning() ? "✅ Running" : "❌ Stopped"}`,
        `   🎯 Entities: ${BetaPhysicsEngine.getEntityCount()} active`,
        `   🔧 Profiles: ${PhysicsComponent.getRegisteredCount()} registered`,
        `   ⏱️ Uptime: ${this.updateCounter * 5} seconds`
      ].join("\n");

      console.log(status);
    }
  }

  private static getMotionState(velocity: { x: number, y: number, z: number }): string {
    const speed = Math.sqrt(velocity.x**2 + velocity.z**2);
    const isAirborne = Math.abs(velocity.y) > 0.01;

    if (isAirborne && velocity.y > 0) return "§e🚀 상승중";
    if (isAirborne && velocity.y < 0) return "§c⬇️ 낙하중";
    if (speed > 1.0) return "§a🏃 빠름";
    if (speed > 0.1) return "§2🚶 보통";
    return "§8🛑 정지";
  }

  static toggle(): void {
    this.isEnabled = !this.isEnabled;
    console.log(`🐛 Debug HUD ${this.isEnabled ? "Enabled" : "Disabled"}`);
  }

  static isDebugEnabled(): boolean {
    return this.isEnabled;
  }
}

// 자동 초기화
DebugHud.initialize();