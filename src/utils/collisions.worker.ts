// import { Coords } from "../organisms/autotroph";
// import Organism from "../organisms/organism";
// import Physics from "./physics/physics";

import { getCompassDirection, getDistance } from "geolib";
import Movement from "../behavior/movement";
import { IWorkerObject } from "../worldObject";
import Physics from "./physics/physics";

type WorkerResolverResult = 
  | { action: 'NULLIFY_TARGET' | 'BEGIN_MOVING'; }
  | {
    action: 'MOVE';
    params: { id: number; x: number, y: number };
  }
  | {
    action: 'SET_AS_FOOD';
    params: { id: number };
  }
  | {
    action: 'CONSUME';
    params: { id: number };
  }

export class WorkerResolver {
  organism: IWorkerObject;
  target: IWorkerObject;

  public static detect(organism: IWorkerObject, organisms: IWorkerObject[], radius: number) {
    const sortedOrganisms = organisms.sort((a, b) => {
      const { x: latitudeA, y: longitudeA } = a.position;
      const { x: latitudeB, y: longitudeB } = b.position;
      const { x: latitudeOrganism, y: longitudeOrganism } = organism.position;

      const distanceA = getDistance(
        { latitude: latitudeA, longitude: longitudeB },
        { latitude: latitudeOrganism, longitude: longitudeOrganism },
      );

      const distanceB = getDistance(
        { latitude: latitudeB, longitude: longitudeB },
        { latitude: latitudeOrganism, longitude: longitudeOrganism },
      );

      if (distanceA < distanceB) {
        return -1;
      }

      if (distanceA > distanceB) {
        return 1;
      }

      return 0;
    });

    for (let potentialTarget of sortedOrganisms) {
      const result = new WorkerResolver(organism, potentialTarget).onDetect();

      if (potentialTarget === organism) continue;
      if (result.action === 'CONSUME') return result;
    }

    return new WorkerResolver(organism, sortedOrganisms[0]).onDetect();
  }

  constructor(organism: IWorkerObject, target: IWorkerObject) {
    this.organism = organism;
    this.target = target;
  }

  onDetect(): WorkerResolverResult {
    const { organism, target } = this;

    let potentialTarget: IWorkerObject | undefined = target;

    if (target?.canBeEaten) {
      const { x, y } = target.position;

      if (target.dimensions === undefined) debugger;
      if (Physics.Collision.collides(organism, target)) {
        return { action: 'CONSUME', params: { id: target.id! } };
      } else {
        return { action: 'MOVE', params: { id: target.id!, x, y } };
      }
    } else {
      potentialTarget = undefined;
    }

    if (potentialTarget !== undefined && (potentialTarget as IWorkerObject).canBeEaten) {
      return { action: 'SET_AS_FOOD', params: { id: (potentialTarget as IWorkerObject).id! } };
    } else {
      return { action: 'BEGIN_MOVING' }
    }
  }
}

// self.onmessage = (
//   { data: { organism, target} }
//   : { data: { organism: WorkerObject, target: WorkerObject, objs: WorkerObject[] }}
// ) => {
//   if (organism.hungry) {
//     if (target && organism.canEat(target)) {
//       const { x, y } = target.position;

//       if (Physics.Collision.collides(organism, target)) {
//         return { action: 'CONSUME' };
//       } else {
//         return { action: 'DIRECT_TO', x, y };
//       }
//     } else {
//       const objs: WorkerObject[] = [];

//       // detection.onDetect = (obj: WorldObject, cancel: () => void) => {
//       //   objs.push(obj);
//       // };

//       // detection.call({ organism: organism });

//       if (objs.length > 0) {
//         const food = objs.find(obj => {
//           return obj instanceof Organism && organism.canEat(obj);
//         }) as Organism;

//         if (food) {
//           target = food;
//         }
//       } else {
//         if (interval <= 0) {
//           if (movement.speed === 0) movement.speed = movement.defaultSpeed;
//           if (movement.xDirection === 0) movement.xDirection = negatableRandom(1);
//           if (movement.yDirection === 0) movement.yDirection = negatableRandom(1);

//           interval = 120;
//         }
//       }
//     }
//   }
// };

self.onmessage = (data) => {
  self.postMessage(data.data);
} 