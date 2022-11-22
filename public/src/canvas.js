import Boundary from "./boundary";
import Organism from "./organism";
import Scene from "./scene";
var Canvas = /** @class */ (function () {
    function Canvas() {
    }
    Canvas.prototype.draw = function () {
        window.addEventListener("load", function () {
            var scene = new Scene();
            var organism = new Organism("sphere", scene);
            var leftBoundary = new Boundary({
                width: 1,
                height: scene.getHeight(),
                scene: scene,
                positionX: scene.getLeft(),
                positionY: 0
            });
            var rightBoundary = new Boundary({
                width: 1,
                height: scene.getHeight(),
                scene: scene,
                positionX: scene.getRight() - 1,
                positionY: 0
            });
            var topBoundary = new Boundary({
                width: scene.getWidth(),
                height: 1,
                scene: scene,
                positionX: 0,
                positionY: scene.getTop()
            });
            var bottomBoundary = new Boundary({
                width: scene.getWidth(),
                height: 1,
                scene: scene,
                positionX: 0,
                positionY: scene.getBottom()
            });
            organism.action();
        }, false);
    };
    return Canvas;
}());
export default Canvas;
