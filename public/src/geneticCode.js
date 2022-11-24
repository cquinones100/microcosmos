class GeneticCode {
    constructor(genes = []) {
        this.genes = genes || [];
    }
    animate(organism) {
        this.forEach((gene) => gene.animate(organism));
    }
    forEach(cb) {
        this.genes.forEach(cb);
    }
}
export default GeneticCode;
