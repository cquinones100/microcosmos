import * as THREE from "three";
import Intersection from "./intersection";
var Organism = /** @class */ (function () {
    function Organism(_a) {
        var shape = _a.shape, scene = _a.scene, organismName = _a.organismName, speed = _a.speed, width = _a.width, height = _a.height, positionX = _a.positionX, positionY = _a.positionY;
        this.scene = scene;
        this.xDirection = speed;
        this.yDirection = speed;
        this.width = width;
        this.height = height;
        this.positionX = positionX;
        this.positionY = positionY;
        this.speed = speed;
        switch (shape) {
            case "square":
                this.shape = this.getCube();
                break;
            case "sphere":
                this.shape = this.getSphere();
                break;
            default: {
                this.shape = this.getCube();
            }
        }
    }
    Organism.prototype.action = function () {
        this.scene.animate(this, function (organism, scene) {
            var intersection = scene.boundaries.map(function (boundary) { return new Intersection(organism, boundary); })
                .find(function (intersection) { return intersection.collided(); });
            if (intersection)
                intersection.bounce();
            organism.shape.position.setX(organism.shape.position.x + organism.xDirection);
            organism.shape.position.setY(organism.shape.position.y + organism.yDirection);
        });
    };
    Organism.prototype.getCube = function () {
        var geometry = new THREE.BoxGeometry(this.scene.size(this.width), this.scene.size(this.height), 1);
        return this.buildOrganism(geometry);
    };
    Organism.prototype.getSphere = function () {
        var geometry = new THREE.SphereGeometry(this.scene.size(1), 64, 32);
        return this.buildOrganism(geometry);
    };
    Organism.prototype.buildOrganism = function (geometry) {
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        var shape = new THREE.Mesh(geometry, material);
        shape.position.setX(this.positionX);
        shape.position.setY(this.positionY);
        this.scene.add(shape);
        return shape;
    };
    return Organism;
}());
export default Organism;
