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
                speed: 5,
                width: 1,
                height: scene.getHeight(),
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
            organism.action();
        }, false);
    };
    return Canvas;
}());
export default Canvas;
