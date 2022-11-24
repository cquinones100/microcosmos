const DEFAULT_SPEED = 0.01;
class Movement {
    constructor({ obj, speed = DEFAULT_SPEED, xDirection = 0, yDirection = 0 }) {
        this.obj = obj;
        this.speed = speed;
        this.xDirection = xDirection;
        this.yDirection = yDirection;
    }
    call({ x: explicitX = null, y: explicitY = null } = {}) {
        const { x: objX, y: objY } = this.obj.getPosition();
        const x = explicitX !== null ? explicitX : objX + this.xDirection * this.speed;
        const y = explicitY !== null ? explicitY : objY + this.yDirection * this.speed;
        this.obj.setPosition({ x, y });
    }
}
Movement.DEFAULT_SPEED = DEFAULT_SPEED;
export default Movement;
