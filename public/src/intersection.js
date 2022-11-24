import * as THREE from "three";
class Intersection {
    constructor(shapeA, shapeB) {
        this.shapeA = shapeA;
        this.shapeB = shapeB;
    }
    collided() {
        if (this.shapeA === this.shapeB)
            return false;
        const firstBB = new THREE.Box3().setFromObject(this.shapeA.shape);
        const secondBB = new THREE.Box3().setFromObject(this.shapeB.shape);
        return firstBB.intersectsBox(secondBB);
    }
    bounce() {
        if (!this.smaller())
            return;
        if (this.movingLeft()) {
            if (this.movingUp()) {
                this.negateDirection('y');
            }
            else {
                this.negateDirection('x');
            }
        }
        else {
            if (this.movingUp()) {
                this.negateDirection('x');
            }
            else {
                this.negateDirection('y');
            }
        }
    }
    negateDirection(direction, value) {
        this.shapeA[`${direction}Direction`] *= -1;
    }
    getXDirection() {
        return this.shapeA.xDirection;
    }
    getYDirection() {
        return this.shapeA.yDirection;
    }
    movingLeft() {
        return this.getXDirection() < 0;
    }
    movingRight() {
        return this.getXDirection() > 0;
    }
    movingUp() {
        return this.getYDirection() > 0;
    }
    smaller() {
        return this.shapeA.height * this.shapeA.width <= this.shapeB.height * this.shapeB.width;
    }
}
export default Intersection;
