import KDTree, {
  IPositionalObject,
} from "../../src/physics/kDTree";

describe('.fromObjects', () => {
  describe('balanced tree', () => {
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
  });

  describe('unbalanced tree', () => {
    const objects: IPositionalObject[] = [
      {
        getPosition: () => ({ x: 2, y: 3 }),
      },
      {
        getPosition: () => ({ x: 1, y: 3 }),
      },
      {
        getPosition: () => ({ x: 3, y: 4 }),
      },
      {
        getPosition: () => ({ x: 1, y: 2 }),
      },
    ];

    const root = KDTree.fromObjects(objects);

    it('root position', () => {
      expect(root.object.getPosition()).toEqual(objects[0].getPosition());
    });

    describe('leaf positions', () => {
      it('left position', () => {
        expect(root.left?.object.getPosition()).toEqual(objects[1].getPosition());
      });

      it('right position', () => {
        expect(root.right?.object.getPosition()).toEqual(objects[2].getPosition());
      });
    })

    describe('deeper nesting', () => {
      it('left leaf leaf', () => {
        expect(root.left?.left?.object.getPosition()).toEqual(objects[3].getPosition());
      })
    });
  });
});

describe('#levels', () => {
  it('returns the levels for a single node', () => {
    const objects: IPositionalObject[] = [
      {
        getPosition: () => ({ x: 2, y: 3 }),
      },
    ];

    const tree = KDTree.fromObjects(objects);

    expect(tree.levels().map(level => level.map(obj => obj.object.getPosition())))
      .toEqual([
        [objects[0].getPosition()],
      ]);
  });

  it('returns the levels for a basic two level tree', () => {
    const objects: IPositionalObject[] = [
      {
        getPosition: () => ({ x: 2, y: 3 }),
      },
      {
        getPosition: () => ({ x: 1, y: 3 }),
      },
      {
        getPosition: () => ({ x: 3, y: 3 }),
      },
    ];

    const tree = KDTree.fromObjects(objects);

    expect(tree.levels().map(level => level.map(obj => obj.object.getPosition())))
      .toEqual([
        [objects[0].getPosition()],
        [objects[1].getPosition(), objects[2].getPosition()],
      ]);
  });

  describe('an unbalanced tree', () => {
    it('returns the levels for a right balanced tree', () => {
      const objects: IPositionalObject[] = [
        {
          getPosition: () => ({ x: 2, y: 3 }),
        },
        {
          getPosition: () => ({ x: 1, y: 3 }),
        },
        {
          getPosition: () => ({ x: 3, y: 3 }),
        },
        {
          getPosition: () => ({ x: 3, y: 4 }),
        },
      ];

      const tree = KDTree.fromObjects(objects);

      expect(tree.levels().map(level => level.map(obj => obj.object.getPosition())))
        .toEqual([
          [objects[0].getPosition()],
          [objects[1].getPosition(), objects[2].getPosition()],
          [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, objects[3].getPosition()],
        ]);
    });

    it('returns the levels for a left balanced tree', () => {
      const objects: IPositionalObject[] = [
        {
          getPosition: () => ({ x: 2, y: 3 }),
        },
        {
          getPosition: () => ({ x: 1, y: 3 }),
        },
        {
          getPosition: () => ({ x: 3, y: 4 }),
        },
        {
          getPosition: () => ({ x: 3, y: 2 }),
        },
      ];

      const tree = KDTree.fromObjects(objects);

      expect(tree.levels().map(level => level.map(obj => obj.object.getPosition())))
        .toEqual([
          [objects[0].getPosition()],
          [objects[1].getPosition(), objects[2].getPosition()],
          [{ x: 0, y: 0 }, { x: 0, y: 0 }, objects[3].getPosition(), { x: 0, y: 0 }],
        ]);
    });
  });
});

describe('#print', () => {
  it('prints the levels for a single node', () => {
    const objects: IPositionalObject[] = [
      {
        getPosition: () => ({ x: 2, y: 3 }),
      },
    ];

    const tree = KDTree.fromObjects(objects);

    expect(tree.print()).toEqual(
      `|2, 3|`
    );
  });

  it('returns the levels for a basic two level tree', () => {
    const objects: IPositionalObject[] = [
      {
        getPosition: () => ({ x: 2, y: 3 }),
      },
      {
        getPosition: () => ({ x: 1, y: 3 }),
      },
      {
        getPosition: () => ({ x: 3, y: 3 }),
      },
    ];

    const tree = KDTree.fromObjects(objects);

    const string =
`      |2, 3|
|1, 3|      |3, 3|`

    expect(tree.print()).toEqual(string);
  });

  it('prints the levels for a right balanced tree', () => {
    const objects: IPositionalObject[] = [
      {
        getPosition: () => ({ x: 2, y: 3 }),
      },
      {
        getPosition: () => ({ x: 1, y: 3 }),
      },
      {
        getPosition: () => ({ x: 3, y: 3 }),
      },
      {
        getPosition: () => ({ x: 3, y: 4 }),
      },
    ];

    const tree = KDTree.fromObjects(objects);

    const string =
`                  |2, 3|
      |1, 3|                  |3, 3|
|0, 0|      |0, 0|      |0, 0|      |3, 4|`

    expect(tree.print()).toEqual(string);
  });

  it('prints the levels for a deeply nested tree', () => {
    const objects: IPositionalObject[] = [
      {
        getPosition: () => ({ x: 2, y: 3 }),
      },
      {
        getPosition: () => ({ x: 1, y: 3 }),
      },
      {
        getPosition: () => ({ x: 3, y: 3 }),
      },
      {
        getPosition: () => ({ x: 3, y: 4 }),
      },
      {
        getPosition: () => ({ x: 5, y: 4 }),
      },
    ];

    const tree = KDTree.fromObjects(objects);

    const string =
`                                          |2, 3|
                  |1, 3|                                          |3, 3|
      |0, 0|                  |0, 0|                  |0, 0|                  |3, 4|
|0, 0|      |0, 0|      |0, 0|      |0, 0|      |0, 0|      |0, 0|      |0, 0|      |5, 4|`

    expect(tree.print()).toEqual(string);
  });
});
