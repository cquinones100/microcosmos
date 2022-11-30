declare module "*.worker.ts" {
  class CollisionsWorker extends Worker {
      constructor();
  }
  export default CollisionsWorker;
}
