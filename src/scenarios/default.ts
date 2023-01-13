import Physics from "../utils/physics/physics";

export const create = () => {
  const { scene } = Physics;
  const { width, height } = Physics.scene!.getDimensions();

  scene!.createHeterotroph({ x: width / 2, y: height / 2 });
  for (let i = 0; i < 10; i++) {
    const autotroph = scene!.createAutotroph(Physics.randomLocation());
  }
}
