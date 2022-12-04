import Organism from "./organisms/organism";
export const DEFAULT_ENERGY = 0.01;

export interface IBehavior {
  call(): void;
  organism: Organism;
  energy: number;
  duplicate(duplicateOrganism: Organism): IBehavior;
  mutate(): void;
}

export default IBehavior;
