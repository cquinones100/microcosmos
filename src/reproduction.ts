import Behavior from "./behavior";
import Gene from "./gene";
import RealOrganism from "./realOrganism";

class Reproduction implements Behavior {
  obj: RealOrganism;
  timePassed: number;
  cycles: number;

  constructor({ obj }: { obj: RealOrganism }) {
    this.obj = obj;
    this.timePassed = 0;
    this.cycles = 0;
  }

  call() {
    this.timePassed += 1;

    if (this.shouldReproduce()) {
      this.duplicate(this.obj);

      this.cycles += 1;
    } 
  }

  private shouldReproduce() {
    return this.timePassed % 100 === 0 && this.cycles < 2;
  }

  private duplicate(obj: RealOrganism) {
    if (!obj.geneticCode) return;

    const { x, y } = obj.getAbsolutePosition();

    const conditionalMutation = (gene: Gene) => {
      const shouldMutate = Math.random() < 0.95 ? false : true;

      if (shouldMutate) gene.mutate();
    }

    const organism = obj.scene.createOrganism({
      x,
      y,
    });

    const geneticCode = obj.geneticCode.duplicate(organism);

    organism.geneticCode = geneticCode;

    organism.geneticCode.forEach(conditionalMutation)
  }
}

export default Reproduction;