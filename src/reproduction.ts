import Behavior, { BehaviorProps } from "./behavior";
import Gene from "./gene";
import RealOrganism from "./realOrganism";

class Reproduction extends Behavior {
  timePassed: number;
  cycles: number;
  interval: number;
  maxCycles: number;

  constructor(args: BehaviorProps) {
    super(args);
    this.timePassed = 0;
    this.cycles = 0;
    this.interval = 100;
    this.maxCycles = 2;
  }

  call() {
    this.timePassed += 1;

    if (this.shouldReproduce()) {
      this.duplicate(this.obj);

      this.cycles += 1;
    }
  }

  private shouldReproduce() {
    return this.timePassed % this.interval === 0 && this.cycles < this.maxCycles;
  }

  private duplicate(obj: RealOrganism) {
    if (!obj.geneticCode) return;

    const { x, y } = obj.getAbsolutePosition();

    const conditionalMutation = (gene: Gene) => {
      const shouldMutate = Math.random() > 1 - 0.99 ? false : true;

      if (shouldMutate) {
        gene.mutate();
      }
    }

    const organism = obj.scene.createOrganism({
      x,
      y,
    });

    const geneticCode = obj.geneticCode.duplicate(organism);

    organism.energy = obj.energy / 2;
    obj.energy = obj.energy / 2;

    organism.geneticCode = geneticCode;

    organism.geneticCode.forEach(gene => gene.resolve());
    organism.geneticCode.forEach(conditionalMutation)
  }
}

export default Reproduction;