import RealOrganism from "./realOrganism";

const DEFAULT_ENERGY = 0.01;

export type BehaviorProps = {
  energy?: number;
  obj: RealOrganism
}

abstract class Behavior {
  energy!: BehaviorProps["energy"];
  obj: BehaviorProps["obj"];

  constructor({ obj, energy }: BehaviorProps) {
    this.obj = obj;
    this.energy = energy || DEFAULT_ENERGY;
  }

  abstract call<T extends {}>(args?: T): void;

  getEnergy() {
    return this.energy!;
  }
}

export default Behavior;
