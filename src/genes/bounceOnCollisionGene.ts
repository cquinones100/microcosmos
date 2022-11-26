import Gene from "../gene";
import Intersection from "../intersection";
import NewOrganism from "../newOrganism";
import RealOrganism from "../realOrganism";

class BounceOnCollisionGene extends Gene {
  // defines behavior of the organism
  animate(): void {
    // [...this.organisms(organism), ...organism.scene.boundaries].forEach(boundary => {
    //   const intersection = new Intersection(organism.obj, boundary);

    //   if (intersection.collided()) intersection.bounce();
    // });
  }

  // changes properties of the organism
  resolve() {}

  increase() {}

  duplicate(newOrganism: RealOrganism): Gene {
    return new BounceOnCollisionGene(newOrganism);
  }

  mutate() {}

  private organisms(organism: RealOrganism) {
    // return organism.scene.organisms.map(({ obj }: { obj: NewOrganism }) => obj);
  }
}

export default BounceOnCollisionGene;
