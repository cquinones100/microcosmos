import Organism from "./organism";
import Scene from "./scene";
var Canvas = /** @class */ (function () {
    function Canvas() {
    }
    Canvas.prototype.draw = function () {
        window.addEventListener("load", function () {
            var scene = new Scene();
            scene.cameraPosition.z = 100;
            var organism = new Organism({
                shape: "sphere",
                scene: scene,
                organismName: 'E. Coli',
                speed: 1,
                width: 1,
                height: 1,
                positionX: 0,
                positionY: 0
            });
            var leftBoundary = new Organism({
                shape: "square",
                organismName: "Left Boundary",
                speed: 0,
                width: 1,
                height: scene.getHeight(),
                scene: scene,
                positionX: scene.getLeft() + 1,
                positionY: 0
            });
            var rightBoundary = new Organism({
                shape: "square",
                organismName: "Right Boundary",
                speed: 0,
                width: 1,
                height: scene.getHeight(),
                scene: scene,
                positionX: scene.getRight() - 1,
                positionY: 0
            });
            var topBoundary = new Organism({
                shape: "square",
                organismName: "Right Boundary",
                speed: 0,
                width: scene.getWidth(),
                height: 1,
                scene: scene,
                positionX: 0,
                positionY: scene.getTop()
            });
            var bottomBoundary = new Organism({
                shape: "square",
                organismName: "Right Boundary",
                speed: 0,
                width: scene.getWidth(),
                height: 1,
                scene: scene,
                positionX: 0,
                positionY: scene.getBottom()
            });
            scene.addBoundary(leftBoundary);
            scene.addBoundary(rightBoundary);
            scene.addBoundary(topBoundary);
            scene.addBoundary(bottomBoundary);
            scene.addBoundary(organism);
            organism.action();
            var otherOrganism = new Organism({
                shape: "sphere",
                scene: scene,
                organismName: 'E. Coli2',
                speed: 2,
                width: 5,
                height: 5,
                positionX: -100,
                positionY: -100
            });
            var squareOrganism = new Organism({
                shape: "square",
                scene: scene,
                organismName: 'E. Coli3',
                speed: 0.4,
                width: 10,
                height: 10,
                positionX: -200,
                positionY: -200
            });
            otherOrganism.action();
            squareOrganism.action();
            scene.addBoundary(otherOrganism);
            scene.addBoundary(squareOrganism);
        }, false);
    };
    return Canvas;
}());
export default Canvas;
