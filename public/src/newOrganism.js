var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as THREE from "three";
import Intersection from "./intersection";
var NewOrganism = /** @class */ (function () {
    function NewOrganism(_a) {
        var height = _a.height, width = _a.width, depth = _a.depth, x = _a.x, y = _a.y, color = _a.color, scene = _a.scene, _b = _a.speed, speed = _b === void 0 ? 1 : _b, _c = _a.xDirection, xDirection = _c === void 0 ? 0.01 : _c, _d = _a.yDirection, yDirection = _d === void 0 ? 0.01 : _d, _e = _a.shapeType, shapeType = _e === void 0 ? "square" : _e;
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.x = x;
        this.y = y;
        this.color = [Math.random(), Math.random(), Math.random()];
        this.scene = scene;
        this.xDirection = xDirection * speed;
        this.yDirection = yDirection * speed;
        var geometry;
        if (shapeType === "square") {
            geometry = new THREE.BoxGeometry(height, width, depth);
        }
        else if (shapeType === "sphere") {
            geometry = new THREE.SphereGeometry(height, 64, 32);
        }
        else {
            var basis = Math.random() * height + width;
            geometry = new THREE.SphereGeometry(height, basis * 2, basis);
        }
        var _f = this.color, r = _f[0], g = _f[1], b = _f[2];
        var material = new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b) });
        this.shape = new THREE.Mesh(geometry, material);
        if (x)
            this.shape.position.x = x;
        if (y)
            this.shape.position.y = y;
    }
    NewOrganism.prototype.animate = function () {
        var _this = this;
        this.shape.position.x += this.xDirection;
        this.shape.position.y += this.yDirection;
        __spreadArray(__spreadArray([], this.scene.organisms, true), this.scene.boundaries, true).forEach(function (boundary) {
            var intersection = new Intersection(_this, boundary);
            if (intersection.collided())
                intersection.bounce();
        });
    };
    return NewOrganism;
}());
export default NewOrganism;
