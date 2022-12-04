import Behavior, { BehaviorProps } from "../behavior";
import Mutator from "../mutator";
import Organism from "../organisms/organism";
import Physics from "../utils/physics/physics";
import Movement from "./movement";

class Reproduction extends Behavior {
  timePassed: number;
  cycles: number;
  interval: number;
  maxCycles: number;

  constructor(args?: BehaviorProps) {
    super(args);
    this.timePassed = 0;
    this.cycles = 0;
    this.interval = 100;
    this.maxCycles = 10;
  }

  call({ organism }: { organism: Organism }) {
    this.timePassed += 1;

    if (this.shouldReproduce(organism)) {
      this.reproduce(organism);

      this.cycles += 1;
    }
  }

  private shouldReproduce(organism: Organism) {
    return this.timePassed % this.interval === 0
      && this.cycles < this.maxCycles
      && organism.energy > organism.maxEnergy * 0.4;
  }

  private reproduce(obj: Organism) {
    if (!obj.geneticCode) return;

    const organism = obj.duplicate();

    const geneticCode = obj.geneticCode.duplicate(organism);

    organism.energy = obj.energy / 2;
    obj.energy = obj.energy / 2;

    organism.geneticCode = geneticCode;

    organism.geneticCode.forEach(gene => gene.resolve());
    organism.geneticCode.forEach(Mutator.conditionallyMutate)
    organism.generation = obj.generation + 1;
  }
}

export default Reproduction;
