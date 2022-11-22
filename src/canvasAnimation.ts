import * as GLM from 'gl-matrix';

class CanvasAnimation {
  canvas: HTMLCanvasElement;
  context: WebGLRenderingContext;
  shaderProgram!: WebGLProgram;
  vertexBuffer!: WebGLBuffer;
  aspectRatio: number;
  currentRotation: number[];
  currentScale: number[];
  previousTime: number;
  degreesPerSecond: number;
  currentAngle: number;
  vertexNumComponents: number;

  constructor(canvas: HTMLCanvasElement, context: WebGLRenderingContext) {
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

  private buildShaderProgram(shaderInfo: { type: number; id: string; code: string; }[]) {
    const program = this.context.createProgram();

    shaderInfo.forEach((desc) => {
      const shader = this.compileShader(desc.type, desc.code);

      if (shader) {
        this.context.attachShader(program!, shader);
      }
    });

    this.context.linkProgram(program!)

    if (!this.context.getProgramParameter(program!, this.context.LINK_STATUS)) {
      console.log("Error linking shader program:");
      console.log(this.context.getProgramInfoLog(program!));
    }

    return program;
  }

  private compileShader(type: number, code: string) {
    const shader = this.context.createShader(type);

    this.context.shaderSource(shader!, code);
    this.context.compileShader(shader!);

    if (!this.context.getShaderParameter(shader!, this.context.COMPILE_STATUS)) {
      console.log(`Error compiling ${type === this.context.VERTEX_SHADER ? "vertex" : "fragment"} shader:`);
      console.log(this.context.getShaderInfoLog(shader!));
    }
    return shader;
  }

  animateScene() {
    const shaderSet = [
      {
        type: this.context.VERTEX_SHADER,
        id: "vertex-shader",
        code: `
          attribute vec4 aVertexPosition;

          uniform mat4 uModelViewMatrix;
          uniform mat4 uProjectionMatrix;

          void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
          }
        `
      },
      {
        type: this.context.FRAGMENT_SHADER,
        id: "fragment-shader",
        code: `
          void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
          }
        `
      }
    ];

    this.shaderProgram = this.buildShaderProgram(shaderSet)!;

    const programInfo = {
      program: this.shaderProgram,
      attribLocations: {
        vertexPosition: this.context.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
      },
      uniformLocations: {
        projectionMatrix: this.context.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: this.context.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
      },
    };

    const positions = [
       1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
      -1.0, -1.0,
    ];
    const positionBuffer = this.context.createBuffer();
    this.context.bindBuffer(this.context.ARRAY_BUFFER, positionBuffer);
    this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(positions), this.context.STATIC_DRAW);

    this.context.clearColor(0.0, 0.0, 0.0, 1.0);
    this.context.clearDepth(1.0);                 // Clear everything
    this.context.enable(this.context.DEPTH_TEST); // Enable depth testing
    this.context.depthFunc(this.context.LEQUAL);  // Near things obscure far things

    this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = GLM.mat4.create();

    GLM.mat4.perspective(
      projectionMatrix,
      fieldOfView,
      aspect,
      zNear,
      zFar
    );

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = GLM.mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    GLM.mat4.translate(
      modelViewMatrix,     // destination matrix
      modelViewMatrix,     // matrix to translate
      [-0.0, 0.0, -6.0]
    );  // amount to translate

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 2;  // pull out 2 values per iteration
      const type = this.context.FLOAT;    // the data in the buffer is 32bit floats
      const normalize = false;  // don't normalize
      const stride = 0;         // how many bytes to get from one set of values to the next
                                // 0 = use type and numComponents above
      const offset = 0;         // how many bytes inside the buffer to start from
      this.context.bindBuffer(this.context.ARRAY_BUFFER, positionBuffer);
      this.context.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      this.context.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL to use our program when drawing

    this.context.useProgram(programInfo.program);

    // Set the shader uniforms

    this.context.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    this.context.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    {
      const offset = 0;
      const vertexCount = 4;
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
  }
}

export default CanvasAnimation;
