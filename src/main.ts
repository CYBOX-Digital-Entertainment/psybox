import { system, world } from "@minecraft/server";
import { SlopePhysics } from "./physics/beta/SlopePhysics";
import { DebugHUD } from "./events/DebugHud";

class PsyboxPhysicsEngine {
    private static instance: PsyboxPhysicsEngine;
    private slopePhysics = new SlopePhysics();
    private debugHUD = new DebugHUD();

    private constructor() {
        system.runInterval(() => this.update());
        system.afterEvents.scriptEventReceive.subscribe((event) => {
            if (event.id === "psybox:debug_on") this.debugHUD.toggle(event.sourceEntity);
        });
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
