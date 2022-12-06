import IBehavior from "./behavior";

class Mutator {
  public static conditionallyMutate(behavior: IBehavior) {
    const shouldMutate = Math.random() > 1 - 0.7 ? false : true;

    if (shouldMutate) {
      console.log('mutating: ', behavior);
      behavior.mutate();
    }
  }
}

export default Mutator;