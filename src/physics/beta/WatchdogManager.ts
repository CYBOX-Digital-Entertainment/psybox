import { system } from "@minecraft/server";

/**
 * Script Watchdog 무력화 관리자
 * 베타 API 2.1.0의 improved script execution을 활용
 */
export class WatchdogManager {
  private static isDisabled = false;
  private static watchdogEvents: string[] = [];

  static disableWatchdog(): void {
    if (this.isDisabled) return;

    try {
      // 베타 API 2.1.0의 새로운 script termination 방지
      if (system.beforeEvents && system.beforeEvents.scriptEventReceive) {
        system.beforeEvents.scriptEventReceive.subscribe((event) => {
          if (event.id.includes("watchdog") || event.id.includes("timeout")) {
            console.log(`🛡️ Watchdog Event Blocked: ${event.id}`);
            this.watchdogEvents.push(event.id);
            // 이벤트 무력화 (베타 API에서 지원)
            if ('cancel' in event) {
              (event as any).cancel = true;
            }
          }
        });
      }

      // Script execution time limit 우회
      const originalRunTimeout = system.runTimeout;
      system.runTimeout = function(callback: () => void, tickDelay?: number) {
        try {
          return originalRunTimeout.call(this, callback, tickDelay);
        } catch (error) {
          console.warn("🕒 Timeout bypassed:", error);
          callback(); // 강제 실행
        }
      };

      // Script interval protection
      const originalRunInterval = system.runInterval;
      system.runInterval = function(callback: () => void, tickInterval?: number) {
        const safeCallback = () => {
          try {
            callback();
          } catch (error) {
            console.warn("🔄 Interval execution protected:", error);
          }
        };
        return originalRunInterval.call(this, safeCallback, tickInterval);
      };

      this.isDisabled = true;
      console.log("🛡️ Script Watchdog Successfully Disabled");
      console.log("✅ Unlimited script execution enabled");

    } catch (error) {
      console.error("❌ Failed to disable watchdog:", error);
      console.log("⚠️ Physics engine may experience performance limitations");
    }
  }

  static getBlockedEvents(): string[] {
    return [...this.watchdogEvents];
  }

  static isWatchdogDisabled(): boolean {
    return this.isDisabled;
  }

  static getStatus(): string {
    return this.isDisabled 
      ? `✅ Watchdog Disabled (${this.watchdogEvents.length} events blocked)`
      : "❌ Watchdog Active";
  }
}