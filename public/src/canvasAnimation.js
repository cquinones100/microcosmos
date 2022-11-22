import * as GLM from 'gl-matrix';
var CanvasAnimation = /** @class */ (function () {
    function CanvasAnimation(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.currentAngle = 0.0;
        this.currentRotation = [0, 1];
        this.currentScale = [1.0, 1.0];
        this.previousTime = 0.0;
        this.degreesPerSecond = 90.0;
        this.vertexNumComponents = 2;
        this.aspectRatio = this.canvas.width / this.canvas.height;
        // this.vertexCount = this.vertexArray.length / this.vertexNumComponents;
    }
    CanvasAnimation.prototype.buildShaderProgram = function (shaderInfo) {
        var _this = this;
        var program = this.context.createProgram();
        shaderInfo.forEach(function (desc) {
            var shader = _this.compileShader(desc.type, desc.code);
            if (shader) {
                _this.context.attachShader(program, shader);
            }
        });
        this.context.linkProgram(program);
        if (!this.context.getProgramParameter(program, this.context.LINK_STATUS)) {
            console.log("Error linking shader program:");
            console.log(this.context.getProgramInfoLog(program));
        }
        return program;
    };
    CanvasAnimation.prototype.compileShader = function (type, code) {
        var shader = this.context.createShader(type);
        this.context.shaderSource(shader, code);
        this.context.compileShader(shader);
        if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
            console.log("Error compiling ".concat(type === this.context.VERTEX_SHADER ? "vertex" : "fragment", " shader:"));
            console.log(this.context.getShaderInfoLog(shader));
        }
        return shader;
    };
    CanvasAnimation.prototype.animateScene = function () {
        var shaderSet = [
            {
                type: this.context.VERTEX_SHADER,
                id: "vertex-shader",
                code: "\n          attribute vec4 aVertexPosition;\n\n          uniform mat4 uModelViewMatrix;\n          uniform mat4 uProjectionMatrix;\n\n          void main() {\n            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n          }\n        "
            },
            {
                type: this.context.FRAGMENT_SHADER,
                id: "fragment-shader",
                code: "\n          void main() {\n            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n          }\n        "
            }
        ];
        this.shaderProgram = this.buildShaderProgram(shaderSet);
        var programInfo = {
            program: this.shaderProgram,
            attribLocations: {
                vertexPosition: this.context.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
            },
            uniformLocations: {
                projectionMatrix: this.context.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: this.context.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
            },
        };
        var positions = [
            1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0,
        ];
        var positionBuffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, positionBuffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(positions), this.context.STATIC_DRAW);
        this.context.clearColor(0.0, 0.0, 0.0, 1.0);
        this.context.clearDepth(1.0); // Clear everything
        this.context.enable(this.context.DEPTH_TEST); // Enable depth testing
        this.context.depthFunc(this.context.LEQUAL); // Near things obscure far things
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
        var fieldOfView = 45 * Math.PI / 180; // in radians
        var aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        var zNear = 0.1;
        var zFar = 100.0;
        var projectionMatrix = GLM.mat4.create();
        GLM.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        var modelViewMatrix = GLM.mat4.create();
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
        GLM.mat4.translate(modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [-0.0, 0.0, -6.0]); // amount to translate
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            var numComponents = 2; // pull out 2 values per iteration
            var type = this.context.FLOAT; // the data in the buffer is 32bit floats
            var normalize = false; // don't normalize
            var stride = 0; // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            var offset = 0; // how many bytes inside the buffer to start from
            this.context.bindBuffer(this.context.ARRAY_BUFFER, positionBuffer);
            this.context.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
            this.context.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        }
        // Tell WebGL to use our program when drawing
        this.context.useProgram(programInfo.program);
        // Set the shader uniforms
        this.context.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        this.context.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        {
            var offset = 0;
            var vertexCount = 4;
            this.context.drawArrays(this.context.TRIANGLE_STRIP, offset, vertexCount);
        }
        // this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
        // this.context.clearColor(0.8, 0.9, 1.0, 1.0);
        // this.context.clear(this.context.COLOR_BUFFER_BIT);
        // const radians = this.currentAngle * Math.PI / 180.0;
        // this.currentRotation[0] = Math.sin(radians);
        // this.currentRotation[1] = Math.cos(radians);
        // this.context.useProgram(this.shaderProgram);
        // let uScalingFactor =
        //   this.context.getUniformLocation(this.shaderProgram, "uScalingFactor");
        // let uGlobalColor =
        //   this.context.getUniformLocation(this.shaderProgram, "uGlobalColor");
        // let uRotationVector =
        //   this.context.getUniformLocation(this.shaderProgram, "uRotationVector");
        // this.context.uniform2fv(uScalingFactor, this.currentScale);
        // this.context.uniform2fv(uRotationVector, this.currentRotation);
        // this.context.uniform4fv(uGlobalColor, [0.1, 0.7, 0.2, 1.0]);
        // this.context.bindBuffer(this.context.ARRAY_BUFFER, this.vertexBuffer);
        // let aVertexPosition =
        //   this.context.getAttribLocation(this.shaderProgram, "aVertexPosition");
        // this.context.enableVertexAttribArray(aVertexPosition);
        // this.context.vertexAttribPointer(aVertexPosition, this.vertexNumComponents,
        //   this.context.FLOAT, false, 0, 0);
        // this.context.drawArrays(this.context.TRIANGLES, 0, this.vertexCount);
        // requestAnimationFrame((currentTime) => {
        //   const deltaAngle = ((currentTime - this.previousTime) / 1000.0) * this.degreesPerSecond;
        //   this.currentAngle = (this.currentAngle + deltaAngle) % 360;
        //   this.previousTime = currentTime;
        //   this.animateScene();
        // });
    };
    return CanvasAnimation;
}());
export default CanvasAnimation;
