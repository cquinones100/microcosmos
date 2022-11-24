import * as THREE from "three";
class NewOrganism {
    constructor({ height, width, depth, x, y, color, scene, speed = 1, xDirection = 0.01, yDirection = 0.01, shapeType = "square", geneticCode }) {
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.x = x;
        this.y = y;
        this.color = [Math.random(), Math.random(), Math.random()];
        this.scene = scene;
        this.geneticCode = geneticCode;
        this.speed = speed;
        this.xDirection = xDirection * speed;
        this.yDirection = yDirection * speed;
        let geometry;
        if (shapeType === "square") {
            geometry = new THREE.BoxGeometry(height, width, depth);
        }
        else if (shapeType === "sphere") {
            geometry = new THREE.SphereGeometry(height, 64, 32);
        }
        else {
            const basis = Math.random() * height + width;
            geometry = new THREE.SphereGeometry(height, basis * 2, basis);
        }
        const [r, g, b] = this.color;
        const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b) });
        this.shape = new THREE.Mesh(geometry, material);
        if (x)
            this.shape.position.x = x;
        if (y)
            this.shape.position.y = y;
    }
    move() {
        this.shape.position.x += this.xDirection;
        this.shape.position.y += this.yDirection;
    }
}
export default NewOrganism;
