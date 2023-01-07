import KDTree, { IPositionalObject } from "../../src/physics/kDTree";

describe('.fromObjects', () => {
  const objects: IPositionalObject[] = [
    {
      getPosition: () => ({ x: 2, y: 3 }),
    },
    {
      getPosition: () => ({ x: 3, y: 2 }),
    },
    {
      getPosition: () => ({ x: 1, y: 5 }),
    },
    {
      getPosition: () => ({ x: 0, y: 3 }),
    },
  ];

  const root = KDTree.fromObjects(objects);

  test('root position', () => {
    expect(root.object.getPosition()).toEqual(objects[0].getPosition());
  });

  describe('leaf positions', () => {
    test('left position', () => {
      expect(root.left?.object.getPosition()).toEqual(objects[2].getPosition());
    });

    test('right position', () => {
      expect(root.right?.object.getPosition()).toEqual(objects[1].getPosition());
    });
  })

  describe('deeper nesting', () => {
    test('left leaf leaf', () => {
      expect(root.left?.left?.object.getPosition()).toEqual(objects[3].getPosition());
    })
  });
})
