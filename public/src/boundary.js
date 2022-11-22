import * as THREE from "three";
var Boundary = /** @class */ (function () {
    function Boundary(_a) {
        var scene = _a.scene, width = _a.width, height = _a.height, positionX = _a.positionX, positionY = _a.positionY;
        this.width = width;
        this.height = height;
        this.scene = scene;
        this.positionX = positionX;
        this.positionY = positionY;
        var geometry = new THREE.BoxGeometry(this.scene.size(width), this.scene.size(height), 1);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var boundary = new THREE.Mesh(geometry, material);
        boundary.position.setX(positionX);
        boundary.position.setY(positionY);
        this.scene.add(boundary);
    }
    return Boundary;
}());
export default Boundary;
