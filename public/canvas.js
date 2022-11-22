var Canvas = /** @class */ (function () {
    function Canvas() {
    }
    Canvas.prototype.draw = function () {
        var canvas = document.createElement('canvas');
        canvas.height = 150;
        canvas.width = 150;
        canvas.id = 'the-canvas';
        var body = document.body;
        console.log('appending the canvas');
        body.append(canvas);
    };
    return Canvas;
}());
export default Canvas;
