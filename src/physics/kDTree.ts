import { Coords } from './coordinates';
import Physics from '../utils/physics/physics';

export interface IPositionalObject {
  getPosition: () => Coords;
};

type Leaf = KDTree | null;

interface IKDTree {
  object: IPositionalObject;
  left: Leaf;
  right: Leaf;
  value: string;
  getPosition: () => Coords;
}

class KDTree implements IKDTree {
  public static fromObjects(objects: IPositionalObject[]) {
    const recurseTree = (tree: KDTree, object: IPositionalObject, dimension = 0) => {
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

    const root = new KDTree(objects[0]);

    for (let i = 1; i < objects.length; i++) {
      recurseTree(root, objects[i]);
    }

    return root;
  }

  public static closestTo(
    object: IPositionalObject,
    objects: IPositionalObject[]
  ) {
    const filteredObjects = objects.filter(obj => obj !== object);

    const root = this.fromObjects([object, ...filteredObjects]);

    let closest: { distance: number, node: IKDTree | null } =
      { distance: Infinity, node: null };

    const { x: targetX, y: targetY } = object.getPosition();
    const point = [targetX, targetY];

    const findNearestNeighbor = (
      node: IKDTree | null,
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

    return closest.node;
  }

  object: IPositionalObject;
  left: Leaf;
  right: Leaf;
  value: string;

  constructor(object: IPositionalObject, left: Leaf = null, right: Leaf = null) {
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
};

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
