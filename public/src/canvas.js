import Scene from "./scene";
var Canvas = /** @class */ (function () {
    function Canvas() {
    }
    Canvas.prototype.draw = function () {
        window.addEventListener("load", function () {
            var scene = new Scene();
            scene.draw();
            scene.animate();
        }, false);
    };
    return Canvas;
}());
export default Canvas;
