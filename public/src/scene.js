import * as THREE from "three";
var Scene = /** @class */ (function () {
    function Scene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
        this.camera.zoom = 10;
        this.renderer = new THREE.WebGLRenderer;
        this.renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);
        this.cameraPosition = this.camera.position;
        this.boundaries = [];
        document.body.appendChild(this.renderer.domElement);
    }
    Scene.prototype.add = function (args) {
        this.scene.add(args);
    };
    Scene.prototype.size = function (value) {
        return this.camera.zoom * value;
    };
    Scene.prototype.getLeft = function () {
        return this.camera.left;
    };
    Scene.prototype.getRight = function () {
        return this.camera.right;
    };
    Scene.prototype.getTop = function () {
        return this.camera.top;
    };
    Scene.prototype.getBottom = function () {
        return this.camera.bottom;
    };
    Scene.prototype.getHeight = function () {
        return this.camera.top - this.camera.bottom;
    };
    Scene.prototype.getWidth = function () {
        return this.camera.right - this.camera.left;
    };
    Scene.prototype.animate = function (shape, cb) {
        var renderer = this.renderer;
        var scene = this;
        var camera = this.camera;
        function animate() {
            requestAnimationFrame(animate);
            cb(shape, scene);
            renderer.render(scene.scene, camera);
        }
        animate();
    };
    Scene.prototype.setCameraPosition = function (_a) {
        var z = _a.z;
        if (z) {
            this.cameraPosition.z = this.size(z);
        }
    };
    Scene.prototype.addBoundary = function (boundary) {
        this.boundaries.push(boundary);
    };
    return Scene;
}());
export default Scene;
