import Organism from "./organism";
import Scene from "./scene";
var Canvas = /** @class */ (function () {
    function Canvas() {
    }
    Canvas.prototype.draw = function () {
        window.addEventListener("load", function () {
            var scene = new Scene();
            var organism = new Organism("square", scene);
        }, false);
    };
    return Canvas;
}());
export default Canvas;
