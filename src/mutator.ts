import IBehavior from "./behavior";

class Mutator {
  public static conditionallyMutate(behavior: IBehavior) {
    const shouldMutate = Math.random() > 1 - 0.99 ? false : true;

    if (shouldMutate) {
      behavior.mutate();
    }
  }
}

export default Mutator;