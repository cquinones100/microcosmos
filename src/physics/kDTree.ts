import { Coords } from "./coordinates";

export interface IPositionalObject {
  getPosition: () => Coords;
};

type Leaf = KDTree | null;

interface IKDTree {
  object: IPositionalObject;
  left: Leaf;
  right: Leaf;
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

  public static closestTo(object: IPositionalObject, objects: IPositionalObject[]) {
    const filteredObjects = objects.filter(obj => obj !== object);

    const tree = this.fromObjects([object, ...filteredObjects]);
  }

  object: IPositionalObject;
  left: Leaf;
  right: Leaf;

  constructor(object: IPositionalObject, left: Leaf = null, right: Leaf = null) {
    this.object = object;
    this.left = left;
    this.right = right;
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

    return levels.map(level => level.map(({ object }) => object));
  }
};

class BlankTree implements IKDTree {
  object: IPositionalObject;
  left: null;
  right: null;

  constructor() {
    this.object = {
      getPosition() {
        return { x: 0, y: 0 }
      }
    };
    this.left = null;
    this.right = null;
  }
}

export default KDTree;
