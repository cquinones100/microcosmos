import * as THREE from "three";
import NewOrganism from "./newOrganism";

type IntersectionShape = NewOrganism;

class Intersection {
  private shapeA: IntersectionShape;
  private shapeB: IntersectionShape;

  constructor(shapeA: IntersectionShape, shapeB: IntersectionShape) {
    this.shapeA = shapeA;
    this.shapeB = shapeB;
  }

  collided() {
    if (this.shapeA === this.shapeB) return false;

    const firstBB = new THREE.Box3().setFromObject(this.shapeA.shape);
    const secondBB = new THREE.Box3().setFromObject(this.shapeB.shape);

    return firstBB.intersectsBox(secondBB);
  }

  bounce() {
    if (!this.smaller()) return;

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

  private negateDirection(direction: "y" | "x", value?: number) {
    this.shapeA[`${direction}Direction`] *= -1;
  }

  private getXDirection() {
    return this.shapeA.xDirection;
  }

  private getYDirection() {
    return this.shapeA.yDirection;
  }

  private movingLeft() {
    return this.getXDirection() < 0;
  }

  private movingRight() {
    return this.getXDirection() > 0;
  }

  private movingUp() {
    return this.getYDirection() > 0;
  }

  private smaller() {
    return this.shapeA.height * this.shapeA.width <= this.shapeB.height * this.shapeB.width;
  }
}

export default Intersection;
