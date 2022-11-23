import * as THREE from "three";
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
        this.organismName = organismName;
        this.color = [Math.random(), Math.random(), Math.random()];
        this.shapeName = shape;
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
    // action() {
    //   this.scene.animate(this, function (organism: Organism, scene: Scene) {
    //     const intersection = scene.boundaries.map(boundary => new Intersection(organism, boundary))
    //       .find(intersection => intersection.collided());
    //     if (intersection) intersection.bounce();
    //     organism.shape.position.setX(organism.shape.position.x + organism.xDirection);
    //     organism.shape.position.setY(organism.shape.position.y + organism.yDirection);
    //   });
    // }
    Organism.prototype.getCube = function () {
        var geometry = new THREE.BoxGeometry(this.scene.size(this.width), this.scene.size(this.height), 1);
        return this.buildOrganism(geometry);
    };
    Organism.prototype.getSphere = function () {
        var geometry = new THREE.SphereGeometry(this.scene.size(this.height), 64, 32);
        return this.buildOrganism(geometry);
    };
    Organism.prototype.buildOrganism = function (geometry) {
        var _a = this.color, r = _a[0], g = _a[1], b = _a[2];
        var material = new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b) });
        var shape = new THREE.Mesh(geometry, material);
        shape.position.setX(this.positionX);
        shape.position.setY(this.positionY);
        // this.scene.add(shape);
        return shape;
    };
    return Organism;
}());
export default Organism;
