import * as THREE from "three";
import NewOrganism from "./newOrganism";
var BOUNDARY = 5;
var Scene = /** @class */ (function () {
    function Scene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.boundaries = [];
        this.organisms = [];
        console.log(window.innerWidth / window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }
    Scene.prototype.draw = function () {
        var topBoundary = new NewOrganism({
            height: 100,
            width: 0.1,
            depth: 0.25,
            y: BOUNDARY - 1.5,
            scene: this
        });
        this.scene.add(topBoundary.shape);
        this.boundaries.push(topBoundary);
        var rightBoundary = new NewOrganism({
            height: 0.1,
            width: 100,
            depth: 0.25,
            x: BOUNDARY,
            scene: this
        });
        this.scene.add(rightBoundary.shape);
        this.boundaries.push(rightBoundary);
        var bottomBoundary = new NewOrganism({
            height: 100,
            width: 0.1,
            depth: 0.25,
            y: BOUNDARY * -1 + 1,
            scene: this
        });
        this.scene.add(bottomBoundary.shape);
        this.boundaries.push(bottomBoundary);
        var leftBoundary = new NewOrganism({
            height: 0.1,
            width: 100,
            depth: 0.25,
            x: BOUNDARY * -1,
            scene: this
        });
        this.scene.add(leftBoundary.shape);
        this.boundaries.push(leftBoundary);
        this.createOrganism(150);
        this.camera.position.z = 5;
    };
    Scene.prototype.add = function (organism) {
        this.organisms.push(organism);
        this.scene.add(organism.shape);
    };
    Scene.prototype.animate = function () {
        var renderer = this.renderer;
        var scene = this;
        var camera = this.camera;
        function animate() {
            requestAnimationFrame(animate);
            scene.organisms.forEach(function (organism) { return organism.animate(); });
            renderer.render(scene.scene, camera);
        }
        animate();
    };
    Scene.prototype.createOrganism = function (amount) {
        var currentAmount = 0;
        while (currentAmount < amount) {
            var negatableRandom = function (max) { return Math.round(Math.random()) ? Math.random() * max : Math.random() * max * -1; };
            var organism = new NewOrganism({
                height: Math.random() * 0.1,
                width: Math.random() * 0.1,
                depth: Math.random() * 0.1,
                scene: this,
                x: negatableRandom(3),
                y: negatableRandom(3),
                xDirection: negatableRandom(0.01),
                yDirection: negatableRandom(0.01),
                shapeType: ["square", "sphere", "other"][Math.round(Math.random() * 2)],
                speed: Math.random() * 0.6,
            });
            console.log(organism.xDirection, organism.yDirection);
            this.add(organism);
            currentAmount += 1;
        }
    };
    return Scene;
}());
export default Scene;
