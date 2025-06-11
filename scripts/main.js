import { world, system } from "@minecraft/server";
system.runInterval(() => {
    for (const e of world.getDimension("overworld").getEntities({ type: "car:basic" })) {
        const l = e.location;
        const b = e.dimension.getBlock({ x: l.x, y: l.y - 1, z: l.z });
        if (!b || !b.typeId.includes("stairs"))
            continue;
        const d = b.permutation.getAllStates()["weirdo_direction"];
        const v = e.getVelocity();
        let x = v.x, z = v.z;
        switch (d) {
            case 1:
                x += 0.1;
                break;
            case 2:
                z -= 0.1;
                break;
            case 3:
                z += 0.1;
                break;
            case 0:
                x -= 0.1;
                break;
        }
        e.applyImpulse({ x, y: -10, z });
    }
}, 2);
