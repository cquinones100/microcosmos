import Scene from "../scene";

type TimeType = {
  seconds: () => number;
  setScene: (scene: Scene) => void;
  scene: Scene | undefined;
  every: (name: string, context: any, args: Required<EveryType>, callback: () => void) => void;
  track: (id: string, context: any)
};

type EveryType = {
  miliseconds?: number;
  seconds?: number;
}

type OneRequiredEveryType = { seconds?: number; miliseconds: number }
  | { seconds: number; miliseconds?: number }

class Every {
  static everys: Every[];

  public static track(name: string, context: any) {
    this.everys.push(new Every(name, context))
  }

  public static find(name: string, context: any) {
    return this.everys.find(every => every.name === name && every.context === context);
  }

  name: string;
  interval: number;
  seconds: number;
  miliseconds: number;
  context: any;

  constructor(
    name: string,
    context: any,
    { miliseconds, seconds }: OneRequiredEveryType = { seconds: 0, miliseconds: 0 }
  ) {
    this.name = name;
    this.interval = 0
    this.seconds = seconds || 0;
    this.miliseconds = miliseconds || 0;
    this.context = context;
  }
}

const Time: TimeType = {
  seconds() {
    if (!this.scene) return 0;
    
    return this.scene.timePassed;
  },
  setScene(scene: Scene) {
    this.scene = scene;
  },
  every(name, context, args: OneRequiredEveryType, cb) {
    const every = Every.find(name, context);

    if (every) {
      every.seconds = args.seconds || 0;
      every.miliseconds = args.miliseconds || 0;
    }
  },
  track(id: string, context: any) {
    Every.track(id, context);
  },
  scene: undefined,
}

export default Time;
