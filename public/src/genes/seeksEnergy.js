import Gene from "../gene";
import Movement from "../movement";
class SeeksEnergy extends Gene {
    animate(organism) {
        this.resolve(organism);
    }
    resolve(organism) {
        const iterator = organism.behaviors.values();
        let current = iterator.next().value;
        const isMovement = current instanceof Movement;
        console.log(isMovement);
        while (current && !(isMovement)) {
            current = iterator.next().value;
        }
        if (current) {
            if (current.speed === 0)
                current.speed = Movement.DEFAULT_SPEED;
            if (current.xDirection === 0)
                current.xDirection = [1, -1][Math.round(Math.random())];
            if (current.yDirection === 0)
                current.yDirection = [1, -1][Math.round(Math.random())];
        }
    }
    increase(organism) { }
}
export default SeeksEnergy;
