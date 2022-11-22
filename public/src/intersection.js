import * as THREE from "three";
var Intersection = /** @class */ (function () {
    function Intersection(shapeA, shapeB) {
        this.shapeA = shapeA;
        this.shapeB = shapeB;
    }
    Intersection.prototype.collided = function () {
        if (this.shapeA === this.shapeB)
            return false;
        var firstBB = new THREE.Box3().setFromObject(this.shapeA.shape);
        var secondBB = new THREE.Box3().setFromObject(this.shapeB.shape);
        return firstBB.intersectsBox(secondBB);
    };
    Intersection.prototype.bounce = function () {
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
    };
    Intersection.prototype.negateDirection = function (direction, value) {
        this.shapeA["".concat(direction, "Direction")] *= -1;
    };
    Intersection.prototype.getXDirection = function () {
        return this.shapeA.xDirection;
    };
    Intersection.prototype.getYDirection = function () {
        return this.shapeA.yDirection;
    };
    Intersection.prototype.movingLeft = function () {
        return this.getXDirection() < 0;
    };
    Intersection.prototype.movingRight = function () {
        return this.getXDirection() > 0;
    };
    Intersection.prototype.movingUp = function () {
        return this.getYDirection() > 0;
    };
    Intersection.prototype.smaller = function () {
        return this.shapeA.height * this.shapeA.width < this.shapeB.height * this.shapeB.width;
    };
    return Intersection;
}());
export default Intersection;
