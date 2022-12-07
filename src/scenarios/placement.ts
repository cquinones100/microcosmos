import TextureAutotroph from "../textureAutotroph";
import TextureOrganism from "../textureOrganism";
import Physics from "../utils/physics/physics";

export const create = () => {
  const scene = Physics.scene!;

  const { width, height } = scene.getDimensions();

  const texture = TextureAutotroph.create();
  const otherTexture = TextureOrganism.create();

  otherTexture.setPosition({ x: width / 2, y: height / 2 })

  return texture;
};
