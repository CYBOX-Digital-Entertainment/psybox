import { system, world } from "@minecraft/server";
import { SlopePhysics } from "./physics/beta/SlopePhysics";
import { DebugHUD } from "./events/DebugHud"; // 경로 확인 완료
import { SteeringSystem } from "./physics/SteeringSystem";
import { InputHandler } from "./events/InputHandler";

class PsyboxPhysicsEngine {
    private static instance: PsyboxPhysicsEngine;
    private slopePhysics = new SlopePhysics();
    private debugHUD = new DebugHUD();

    private constructor() {
        system.runInterval(() => this.update());
    }

    private update() {
        for (const entity of world.getDimension("overworld").getEntities({ type: "car:basic" })) {
            this.slopePhysics.applySlopePhysics(entity);
            this.debugHUD.update(entity);
        }
    }

    public static getInstance(): PsyboxPhysicsEngine {
        if (!PsyboxPhysicsEngine.instance) {
            PsyboxPhysicsEngine.instance = new PsyboxPhysicsEngine();
        }
        return this.instance;
    }
}

PsyboxPhysicsEngine.getInstance();

const steeringSystem = new SteeringSystem();
const inputHandler = new InputHandler();