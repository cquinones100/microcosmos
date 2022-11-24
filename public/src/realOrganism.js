export class Chemical {
}
class Organic {
}
class RealOrganism {
    constructor({ energySources, obj, geneticCode, scene }) {
        this.energySource = energySources;
        this.obj = obj;
        this.geneticCode = geneticCode;
        this.scene = scene;
        this.shape = obj.shape;
        this.width = obj.width;
        this.height = obj.height;
        this.behaviors = new Set();
    }
    animate() {
        this.geneticCode.animate(this);
        this.behaviors.forEach(behavior => behavior.call());
    }
    resolveGeneticCode() {
        this.geneticCode.forEach(gene => {
            gene.resolve(this);
        });
    }
    resolveBehavior() {
        this.geneticCode.forEach(gene => {
            gene.animate(this);
        });
    }
    setPosition({ x, y }) {
        this.shape.position.x = x;
        this.shape.position.y = y;
    }
    getPosition() {
        const { x, y } = this.shape.position;
        return { x, y };
    }
    setBehavior(behavior) {
        this.behaviors.add(behavior);
    }
    removeBehavior(behavior) {
        this.behaviors.delete(behavior);
    }
}
export default RealOrganism;
