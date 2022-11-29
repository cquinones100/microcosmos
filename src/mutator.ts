import Gene from "./gene";

class Mutator {
  public static conditionallyMutate(gene: Gene) {
    const shouldMutate = Math.random() > 1 - 0.99 ? false : true;

    if (shouldMutate) {
      gene.mutate();
    }
  }
}

export default Mutator;