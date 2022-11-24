import Gene from "../gene";
import Intersection from "../intersection";
class BounceOnCollisionGene extends Gene {
    // defines behavior of the organism
    animate(organism) {
        [...this.organisms(organism), ...organism.scene.boundaries].forEach(boundary => {
            const intersection = new Intersection(organism.obj, boundary);
            if (intersection.collided())
                intersection.bounce();
        });
    }
    // changes properties of the organism
    resolve(organism) { }
    increase(organism) { }
    organisms(organism) {
        return organism.scene.organisms.map(({ obj }) => obj);
    }
}
export default BounceOnCollisionGene;
