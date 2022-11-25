import Gene from "../gene";
import Intersection from "../intersection";
import NewOrganism from "../newOrganism";
import RealOrganism from "../realOrganism";

class BounceOnCollisionGene extends Gene {
  // defines behavior of the organism
  animate(organism: RealOrganism): void {
    [...this.organisms(organism), ...organism.scene.boundaries].forEach(boundary => {
      const intersection = new Intersection(organism.obj, boundary);

      if (intersection.collided()) intersection.bounce();
    });
  }

  // changes properties of the organism
  resolve(organism: RealOrganism) {}

  increase(organism: RealOrganism) {}

  duplicate(): Gene {
    return new BounceOnCollisionGene();
  }

  private organisms(organism: RealOrganism) {
    return organism.scene.organisms.map(({ obj }: { obj: NewOrganism }) => obj);
  }
}

export default BounceOnCollisionGene;
