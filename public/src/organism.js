import * as THREE from "three";
var Organism = /** @class */ (function () {
    function Organism(shape, scene) {
        this.scene = scene;
        switch (shape) {
            case "square":
                this.shape = this.getCube();
            default: {
                this.shape = this.getCube();
            }
        }
    }
    Organism.prototype.getCube = function () {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
        this.scene.cameraPosition.z = 5;
        return cube;
    };
    Organism.prototype.action = function () {
        this.scene.animate(this.shape, function (shape) {
            shape.rotation.x += 0.01;
            shape.rotation.y += 0.01;
        });
    };
    return Organism;
}());
export default Organism;
