import Organism from "./organisms/organism";
const DEFAULT_ENERGY = 0.01;

export interface IBehavior {
  call: () => void;
  organism: Organism;
}

export type BehaviorProps = {
  energy?: number;
}

abstract class Behavior {
  energy!: BehaviorProps["energy"];

  constructor({ energy }: BehaviorProps = {}) {
    this.energy = energy || DEFAULT_ENERGY;
  }

  public static findBehavior<T>(organism: Organism, cb: (current: Behavior) => boolean): T {
    const iterator = organism.behaviors.values();

    let current = iterator.next().value;

    const isBehavior = () => cb(current);

    while (current && !(isBehavior())) {
      current = iterator.next().value;
    }

    return current;
  }

  public static for<T>(organism: Organism): T {
    return this.findBehavior(organism, (current) => current instanceof this);
  }

  abstract call<T extends {}>({ organism, ...args }: { organism: Organism, args?: T }): void;

  getEnergy() {
    return this.energy!;
  }

  duplicate() {
    return new (this.constructor as any)();
  }
}

export default Behavior;
