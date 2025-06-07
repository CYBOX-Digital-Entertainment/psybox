import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";
import { BlockCollision } from "./BlockCollision";
// 1초에 20번(1틱마다) 물리 업데이트
system.runInterval(() => {
    const overworld = world.getDimension("overworld");
    for (const entity of overworld.getEntities()) {
        const profile = PhysicsComponent.getProfile(entity.typeId);
        if (!profile)
            continue;
        const body = new RigidBody(entity, profile);
        ForceManager.applyPhysics(body);
        if (BlockCollision.checkGroundCollision(entity)) {
            body.setVelocity({ x: 0, y: 0, z: 0 });
            ForceManager.handleGroundCollision(body);
        }
    }
}, 1);
