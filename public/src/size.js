var Size = /** @class */ (function () {
    function Size(scene) {
        this.scene = scene;
    }
    Size.prototype.calculate = function (value) {
        this.scene.camera.zoom * value;
    };
    return Size;
}());
export {};
