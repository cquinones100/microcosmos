import Physics from "../utils/physics/physics";

export const create = () => {
  const { scene } = Physics;

  for (let i = 0; i <= 1000; i++) {
    scene!.createHeterotroph(Physics.randomLocation());
  }
}