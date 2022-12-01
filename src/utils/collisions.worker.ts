// import { Coords } from "../organisms/autotroph";
// import Organism from "../organisms/organism";
// import Physics from "./physics/physics";

// interface WorkerObject = {
//   position: Coords;
//   dimensions: { width: number; height: number; };
//   hungry: boolean;
//   canEat: (target: WorkerObject) => boolean;
//   getPosition: () => Coords;
//   getDimensions: () => { width: number; height: number; };
// }

// class WorkerResolver {
//   organism: WorkerObject;
//   target: WorkerObject;

//   constructor(organism: WorkerObject, target: WorkerObject) {
//     this.organism = organism;
//     this.target = target;
//   }
// }

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