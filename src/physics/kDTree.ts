export interface IPositionalObject {
  getPosition: () => ({
    x: number;
    y: number;
  })
};

type Leaf = KDTree | null;

class KDTree {
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

    objects.forEach(object => {
      recurseTree(root, object);
    });

    return root;
  }

  object: IPositionalObject;
  left: Leaf;
  right: Leaf;

  constructor(object: IPositionalObject, left: Leaf = null, right: Leaf = null) {
    this.object = object;
    this.left = left;
    this.right = right;
  }
};

export default KDTree;
