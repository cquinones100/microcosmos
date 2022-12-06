
import Scene from "../scene";

export const create = (scene: Scene) => {
  scene.createAutotroph({ x: scene.app.screen.width / 2, y: scene.app.screen.height / 2 });
}
