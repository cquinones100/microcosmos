import * as THREE from "three";
import Boundary from "./boundary";
import Organism from "./organism";

type IntersectionShape = Organism | Boundary;

class Intersection {
  shapeA: IntersectionShape;
  shapeB: IntersectionShape;

  constructor(shapeA: IntersectionShape, shapeB: IntersectionShape) {
    this.shapeA = shapeA;
    this.shapeB = shapeB;
  }

  collided() {
    const firstBB = new THREE.Box3().setFromObject(this.shapeA.shape);
    const secondBB = new THREE.Box3().setFromObject(this.shapeB.shape);

    return firstBB.intersectsBox(secondBB);
  }

  bounce() {
    if (this.movingLeft()) {
      if (this.movingUp()) {
        this.negateDirection('y');
      } else {
        this.negateDirection('x');
      }
    } else {
      if (this.movingUp()) {
        this.negateDirection('x');
      } else {
        this.negateDirection('y');
      }
    }
  }

  negateDirection(direction: "y" | "x") {
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
}

export default Intersection;