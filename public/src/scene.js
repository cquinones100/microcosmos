import * as THREE from "three";
import Organism from "./organism";
import { faker } from '@faker-js/faker';
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
    Scene.prototype.createOrganism = function (amount) {
        var currentAmount = 0;
        while (currentAmount < amount) {
            var index = Math.round(Math.random() * 2);
            var organism = new Organism({
                shape: ['square', 'sphere'][index],
                scene: this,
                organismName: faker.lorem.slug(),
                speed: Math.random() * 4,
                width: Math.random() * 2,
                height: Math.random() * 2,
                positionX: Math.random() * 200 * Math.round(Math.random()) ? 1 : -1,
                positionY: Math.random() * 200 * Math.round(Math.random()) ? 1 : -1
            });
            this.addBoundary(organism);
            organism.action();
            currentAmount += 1;
        }
    };
    return Scene;
}());
export default Scene;
