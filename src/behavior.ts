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

  public static findBehavior<T>(organism: RealOrganism, cb: (current: Behavior) => boolean): T {
    const iterator = organism.behaviors.values();

    let current = iterator.next().value;

    const isBehavior = () => cb(current);

    while (current && !(isBehavior())) {
      current = iterator.next().value;
    }

    return current;
  }

  abstract call<T extends {}>(args?: T): void;

  getEnergy() {
    return this.energy!;
  }
}

export default Behavior;
