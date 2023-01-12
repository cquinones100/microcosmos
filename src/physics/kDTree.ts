import { Coords } from './coordinates';
import Physics from '../utils/physics/physics';

export interface IPositionalObject {
  getPosition: () => Coords;
}

interface IKDTree<T extends IPositionalObject = IPositionalObject> {
  object: T;
  left: KDTree<T> | null;
  right: KDTree<T> | null;
  value: string;
  getPosition: () => Coords;
}

class KDTree<T extends IPositionalObject = IPositionalObject> implements IKDTree<T> {
  public static fromObjects<T extends IPositionalObject>(objects: T[]) {
    const recurseTree = (tree: KDTree<T>, object: T, dimension = 0) => {
      const { x: treeX, y: treeY } = tree.object.getPosition();
      const { x, y } = object.getPosition();

      if (dimension % 2 === 0) {
        if (x < treeX) {
          if (!tree.left) {
            tree.left = new KDTree(object);
          } else {
            recurseTree(tree.left, object, dimension + 1);
          }
        } else {
          if (!tree.right) {
            tree.right = new KDTree(object);
          } else {
            recurseTree(tree.right, object, dimension + 1);
          }
        }
      } else {
        if (y < treeY) {
          if (!tree.left) {
            tree.left = new KDTree(object);
          } else {
            recurseTree(tree.left, object, dimension + 1);
          }
        } else {
          if (!tree.right) {
            tree.right = new KDTree(object);
          } else {
            recurseTree(tree.right, object, dimension + 1);
          }
        }
      }
    }

    const root = new KDTree<T>(objects[0]);

    for (let i = 1; i < objects.length; i++) {
      recurseTree(root, objects[i]);
    }

    return root;
  }

  public static closestTo<T extends IPositionalObject>(
    object: T,
    objects: T[],
    tree: null
  ): { distance: number, node: KDTree<T> | null };

  public static closestTo<T extends IPositionalObject>(
    object: T,
    objects: null,
    tree: KDTree<T>
  ): { distance: number, node: KDTree<T> | null };

  public static closestTo<T extends IPositionalObject>(
    object: T,
    objects: T[] | null = null,
    tree: KDTree<T> | null = null
  ):  { distance: number, node: KDTree<T> | null } {
    let root: KDTree<T> | null = null;

    if (tree) root = tree;
    if (objects) root = this.fromObjects<T>(objects);

    let closest: { distance: number, node: KDTree<T> | null } =
      { distance: Infinity, node: null };

    const { x: targetX, y: targetY } = object.getPosition();
    const point = [targetX, targetY];

    const findNearestNeighbor = (
      node: KDTree<T> | null,
      depth: number = 0,
    ) => {
      if (!node) return;

      const axis = depth % 2;

      const { x, y } = node.getPosition();

      const distance = Physics.Vector.getVector({
        x,
        y,
        targetX,
        targetY
      }).getLength();

      if (distance < closest.distance && node !== root) {
        closest = { distance, node }
      }

      const nextNode = point[axis] < x ? node.left : node.right;

      findNearestNeighbor(nextNode, depth + 1);
    };

    findNearestNeighbor(root);

    return closest;
  }
  object: T;
  left: IKDTree<T>['left'];
  right: IKDTree<T>['right'];
  value: string;

  constructor(object: T, left: IKDTree<T>['left'] = null, right: IKDTree<T>['right'] = null) {
    this.object = object;
    this.left = left;
    this.right = right;
    const { x, y } = object.getPosition();

    this.value = `|${x}, ${y}|`;
  }

  getPosition() {
    return this.object.getPosition();
  }

  levels() {
    const levels: IKDTree[][] = [[]];

    let currentLevel: IKDTree[] = [this];
    let children: IKDTree[] = [];

    while (currentLevel.length > 0) {
      const current = currentLevel.shift();

      if (current) {
        levels[levels.length - 1].push(current)

        children.push(current.left || new BlankTree());
        children.push(current.right || new BlankTree());

        if (currentLevel.length === 0 && !children.every(node => node instanceof BlankTree)) {
          currentLevel = children;
          levels.push([]);
          children = [];
        }
      }
    }

    if (levels[levels.length - 1].length === 0) {
      levels.pop();
    }

    return levels;
  }

  print() {
    const levels = this.levels();

    let string = '';

    const maxSpacing = levels
      .reduce((acc: number, level) => {
        return Math.max(acc, ...level.map((tree) => tree.value.length))
      }, 0);

    const maxLeaves = 2 ** levels.length;
    let previousLevelPlacement = 0;
    let levelPlacement = Math.floor((maxLeaves / 2)) - 1;

    levels.forEach((level, levelIndex) => {
      string += ' '.repeat(levelPlacement * maxSpacing);

      level.forEach((tree, treeIndex) => {
        string += tree.value;

        if (treeIndex < level.length - 1) {
          string += ' '.repeat(previousLevelPlacement * maxSpacing);
        }
      });

      if (levelIndex < levels.length - 1) {
        string += '\n';
      }

      previousLevelPlacement = levelPlacement;
      levelPlacement = Math.floor(levelPlacement / 2);
    });

    return string;
  }

  closestTo<T extends IPositionalObject>(object: T):
    { distance: number, node: KDTree<T> | null } {
    // @ts-ignore
    return KDTree.closestTo(object, null, this);
  }
}

class BlankTree implements IKDTree {
  object: IPositionalObject;
  left: null;
  right: null;
  value: string;

  constructor() {
    this.object = {
      getPosition() {
        return { x: 0, y: 0 }
      }
    };
    this.left = null;
    this.right = null;
    this.value = `|${0}, ${0}|`;
  }

  getPosition() {
    return this.object.getPosition();
  };
}

export default KDTree;
