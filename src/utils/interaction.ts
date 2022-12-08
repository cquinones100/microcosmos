import { FederatedEvent } from "pixi.js";
import WorldObject from "../worldObject";

const Interaction = {
  click(object: WorldObject, cb: (event: FederatedEvent) => void) {
    object.texture.shape.interactive = true;

    object.texture.shape.on('click', cb);
  },
  hover(object: WorldObject, cb: (event: FederatedEvent) => void) {
    object.texture.shape.interactive = true;

    object.texture.shape.on('mouseover', cb);
  },
  unHover(object: WorldObject, cb: (event: FederatedEvent) => void) {
    object.texture.shape.interactive = true;

    object.texture.shape.on('mouseout', cb);
  }
}

export default Interaction;