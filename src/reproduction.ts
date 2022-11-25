import Behavior from "./behavior";
import RealOrganism from "./realOrganism";

class Reproduction implements Behavior {
  obj: RealOrganism;
  timePassed: number;
  cycles: number;

  constructor({ obj }: { obj: RealOrganism }) {
    this.obj = obj;
    this.timePassed = 0;
    this.cycles = 0;
  }

  call() {
    this.timePassed += 1;

    if (this.shouldReproduce()) {
      this.obj.duplicate();
      this.cycles += 1;
    } 
  }

  private shouldReproduce() {
    return this.timePassed % 100 === 0 && this.cycles < 2;
  }
}

export default Reproduction;