import Organism from "./organism";
import Scene from "./scene";
var Canvas = /** @class */ (function () {
    function Canvas() {
    }
    Canvas.prototype.draw = function () {
        var _this = this;
        window.addEventListener("load", function () {
            var scene = new Scene();
            scene.cameraPosition.z = 100;
            var leftBoundary = new Organism({
                shape: "square",
                organismName: "Left Boundary",
                speed: 0,
                width: 1,
                height: _this.worldScale(scene.getHeight()),
                scene: scene,
                positionX: _this.worldScale(scene.getLeft() + 1),
                positionY: 0
            });
            var rightBoundary = new Organism({
                shape: "square",
                organismName: "Right Boundary",
                speed: 0,
                width: 1,
                height: _this.worldScale(scene.getHeight()),
                scene: scene,
                positionX: _this.worldScale(scene.getRight() - 1),
                positionY: 0
            });
            var topBoundary = new Organism({
                shape: "square",
                organismName: "Right Boundary",
                speed: 0,
                width: _this.worldScale(scene.getWidth()),
                height: 1,
                scene: scene,
                positionX: 0,
                positionY: _this.worldScale(scene.getTop())
            });
            var bottomBoundary = new Organism({
                shape: "square",
                organismName: "Right Boundary",
                speed: 0,
                width: _this.worldScale(scene.getWidth()),
                height: 1,
                scene: scene,
                positionX: 0,
                positionY: _this.worldScale(scene.getBottom())
            });
            scene.addBoundary(leftBoundary);
            scene.addBoundary(rightBoundary);
            scene.addBoundary(topBoundary);
            scene.addBoundary(bottomBoundary);
            scene.createOrganism(20);
        }, false);
    };
    Canvas.prototype.worldScale = function (value) {
        return value * 2;
    };
    return Canvas;
}());
export default Canvas;
