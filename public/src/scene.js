import * as THREE from "three";
var Scene = /** @class */ (function () {
    function Scene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.cameraPosition = this.camera.position;
        document.body.appendChild(this.renderer.domElement);
    }
    Scene.prototype.add = function (args) {
        this.scene.add(args);
    };
    Scene.prototype.animate = function (shape, cb) {
        var renderer = this.renderer;
        var scene = this.scene;
        var camera = this.camera;
        function animate() {
            requestAnimationFrame(animate);
            cb(shape);
            renderer.render(scene, camera);
        }
        animate();
    };
    return Scene;
}());
export default Scene;
