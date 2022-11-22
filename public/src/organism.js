import * as THREE from "three";
var Organism = /** @class */ (function () {
    function Organism(shape, scene) {
        this.scene = scene;
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
        var camera = this.scene.camera;
        var xDirection = 0.05;
        var yDirection = 0.02;
        this.scene.animate(this.shape, function (shape) {
            var frustum = new THREE.Frustum();
            var matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
            frustum.setFromProjectionMatrix(matrix);
            if (!frustum.containsPoint(shape.position)) {
                console.log(shape.position);
                console.log(frustum);
                console.log('Out of view');
                // function bounceLeft() {
                //   shape.position.setX(shape.position.x + direction * -1);
                //   shape.position.setY(shape.position.y + direction);
                // }
                // function bounceDown() {
                //   shape.position.setX(shape.position.x + direction);
                //   shape.position.setY(shape.position.y + direction * -1);
                // }
                xDirection *= -1;
                yDirection *= -1;
            }
            shape.position.setX(shape.position.x + xDirection);
            shape.position.setY(shape.position.y + yDirection);
        });
    };
    Organism.prototype.getCube = function () {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
        this.scene.cameraPosition.z = 5;
        return cube;
    };
    Organism.prototype.getSphere = function () {
        var geometry = new THREE.SphereGeometry(this.scene.size(1), 64, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        var sphere = new THREE.Mesh(geometry, material);
        this.scene.add(sphere);
        this.scene.cameraPosition.z = 5;
        return sphere;
    };
    return Organism;
}());
export default Organism;
