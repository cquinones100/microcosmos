import Gene from "../gene";
import Movement from "../movement";
class MovementGene extends Gene {
    animate(organism) {
        this.resolve(organism);
    }
    resolve(organism) {
        this.movement || (this.movement = new Movement({ obj: organism }));
        organism.setBehavior(this.movement);
    }
    increase(organism) { }
}
export default MovementGene;
