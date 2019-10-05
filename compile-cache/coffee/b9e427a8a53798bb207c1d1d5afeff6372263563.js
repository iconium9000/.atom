(function() {
  var Point, fits, getGuides, gs, its, statesAboveVisible, statesBelowVisible, toGuides, uniq;

  gs = require('../lib/guides');

  toGuides = gs.toGuides, uniq = gs.uniq, statesAboveVisible = gs.statesAboveVisible, statesBelowVisible = gs.statesBelowVisible, getGuides = gs.getGuides;

  Point = require('atom').Point;

  its = function(f) {
    return it(f.toString(), f);
  };

  fits = function(f) {
    return fit(f.toString(), f);
  };

  describe("toGuides", function() {
    var guides;
    guides = null;
    describe("step-by-step indent", function() {
      beforeEach(function() {
        return guides = toGuides([0, 1, 2, 2, 1, 2, 1, 0], []);
      });
      its(function() {
        return expect(guides.length).toBe(3);
      });
      its(function() {
        return expect(guides[0].length).toBe(6);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(1, 0));
      });
      its(function() {
        return expect(guides[1].length).toBe(2);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(2, 1));
      });
      its(function() {
        return expect(guides[2].length).toBe(1);
      });
      return its(function() {
        return expect(guides[2].point).toEqual(new Point(5, 1));
      });
    });
    describe("steep indent", function() {
      beforeEach(function() {
        return guides = toGuides([0, 3, 2, 1, 0], []);
      });
      its(function() {
        return expect(guides.length).toBe(3);
      });
      its(function() {
        return expect(guides[0].length).toBe(3);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(1, 0));
      });
      its(function() {
        return expect(guides[1].length).toBe(2);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(1, 1));
      });
      its(function() {
        return expect(guides[2].length).toBe(1);
      });
      return its(function() {
        return expect(guides[2].point).toEqual(new Point(1, 2));
      });
    });
    describe("steep dedent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([0, 1, 2, 3, 0], []);
      });
      its(function() {
        return expect(guides.length).toBe(3);
      });
      its(function() {
        return expect(guides[0].length).toBe(3);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(1, 0));
      });
      its(function() {
        return expect(guides[1].length).toBe(2);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(2, 1));
      });
      its(function() {
        return expect(guides[2].length).toBe(1);
      });
      return its(function() {
        return expect(guides[2].point).toEqual(new Point(3, 2));
      });
    });
    describe("recurring indent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([0, 1, 1, 0, 1, 0], []);
      });
      its(function() {
        return expect(guides.length).toBe(2);
      });
      its(function() {
        return expect(guides[0].length).toBe(2);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(1, 0));
      });
      its(function() {
        return expect(guides[1].length).toBe(1);
      });
      return its(function() {
        return expect(guides[1].point).toEqual(new Point(4, 0));
      });
    });
    describe("no indent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([0, 0, 0], []);
      });
      return its(function() {
        return expect(guides.length).toBe(0);
      });
    });
    describe("same indent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([1, 1, 1], []);
      });
      its(function() {
        return expect(guides.length).toBe(1);
      });
      its(function() {
        return expect(guides[0].length).toBe(3);
      });
      return its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
    });
    describe("stack and active", function() {
      describe("simple", function() {
        beforeEach(function() {
          return guides = toGuides([1, 2, 2, 1, 2, 1, 0], [2]);
        });
        its(function() {
          return expect(guides[0].stack).toBe(true);
        });
        its(function() {
          return expect(guides[0].active).toBe(false);
        });
        its(function() {
          return expect(guides[1].stack).toBe(true);
        });
        its(function() {
          return expect(guides[1].active).toBe(true);
        });
        its(function() {
          return expect(guides[2].stack).toBe(false);
        });
        return its(function() {
          return expect(guides[2].active).toBe(false);
        });
      });
      describe("cursor not on deepest", function() {
        beforeEach(function() {
          return guides = toGuides([1, 2, 1], [0]);
        });
        its(function() {
          return expect(guides[0].stack).toBe(true);
        });
        its(function() {
          return expect(guides[0].active).toBe(true);
        });
        its(function() {
          return expect(guides[1].stack).toBe(false);
        });
        return its(function() {
          return expect(guides[1].active).toBe(false);
        });
      });
      describe("no cursor", function() {
        beforeEach(function() {
          return guides = toGuides([1, 2, 1], []);
        });
        its(function() {
          return expect(guides[0].stack).toBe(false);
        });
        its(function() {
          return expect(guides[0].active).toBe(false);
        });
        its(function() {
          return expect(guides[1].stack).toBe(false);
        });
        return its(function() {
          return expect(guides[1].active).toBe(false);
        });
      });
      return describe("multiple cursors", function() {
        beforeEach(function() {
          return guides = toGuides([1, 2, 1, 2, 0, 1], [1, 2]);
        });
        its(function() {
          return expect(guides[0].stack).toBe(true);
        });
        its(function() {
          return expect(guides[0].active).toBe(true);
        });
        its(function() {
          return expect(guides[1].stack).toBe(true);
        });
        its(function() {
          return expect(guides[1].active).toBe(true);
        });
        its(function() {
          return expect(guides[2].stack).toBe(false);
        });
        its(function() {
          return expect(guides[2].active).toBe(false);
        });
        its(function() {
          return expect(guides[3].stack).toBe(false);
        });
        return its(function() {
          return expect(guides[3].active).toBe(false);
        });
      });
    });
    describe("empty lines", function() {
      describe("between the same indents", function() {
        beforeEach(function() {
          return guides = toGuides([1, null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(3);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("starts with a null", function() {
        beforeEach(function() {
          return guides = toGuides([null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(2);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("starts with nulls", function() {
        beforeEach(function() {
          return guides = toGuides([null, null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(3);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("ends with a null", function() {
        beforeEach(function() {
          return guides = toGuides([1, null], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(1);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("ends with nulls", function() {
        beforeEach(function() {
          return guides = toGuides([1, null, null], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(1);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
      describe("large to small", function() {
        beforeEach(function() {
          return guides = toGuides([2, null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(2);
        });
        its(function() {
          return expect(guides[0].length).toBe(3);
        });
        its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
        its(function() {
          return expect(guides[1].length).toBe(1);
        });
        return its(function() {
          return expect(guides[1].point).toEqual(new Point(0, 1));
        });
      });
      describe("small to large", function() {
        beforeEach(function() {
          return guides = toGuides([1, null, 2], []);
        });
        its(function() {
          return expect(guides.length).toBe(2);
        });
        its(function() {
          return expect(guides[0].length).toBe(3);
        });
        its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
        its(function() {
          return expect(guides[1].length).toBe(2);
        });
        return its(function() {
          return expect(guides[1].point).toEqual(new Point(1, 1));
        });
      });
      return describe("continuous", function() {
        beforeEach(function() {
          return guides = toGuides([1, null, null, 1], []);
        });
        its(function() {
          return expect(guides.length).toBe(1);
        });
        its(function() {
          return expect(guides[0].length).toBe(4);
        });
        return its(function() {
          return expect(guides[0].point).toEqual(new Point(0, 0));
        });
      });
    });
    return describe("incomplete indent", function() {
      guides = null;
      beforeEach(function() {
        return guides = toGuides([1, 1.5, 1], []);
      });
      its(function() {
        return expect(guides.length).toBe(1);
      });
      its(function() {
        return expect(guides[0].length).toBe(3);
      });
      return its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
    });
  });

  describe("uniq", function() {
    its(function() {
      return expect(uniq([1, 1, 1, 2, 2, 3, 3])).toEqual([1, 2, 3]);
    });
    its(function() {
      return expect(uniq([1, 1, 2])).toEqual([1, 2]);
    });
    its(function() {
      return expect(uniq([1, 2])).toEqual([1, 2]);
    });
    its(function() {
      return expect(uniq([1, 1])).toEqual([1]);
    });
    its(function() {
      return expect(uniq([1])).toEqual([1]);
    });
    return its(function() {
      return expect(uniq([])).toEqual([]);
    });
  });

  describe("statesAboveVisible", function() {
    var getLastRow, getRowIndents, guides, rowIndents, run;
    run = statesAboveVisible;
    guides = null;
    rowIndents = null;
    getRowIndents = function(r) {
      return rowIndents[r];
    };
    getLastRow = function() {
      return rowIndents.length - 1;
    };
    describe("only stack", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 3, 2, 3];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("active and stack", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 2, 3];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("cursor on null row", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, null, 2, 3];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("continuous nulls", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, null, null, 3];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1, 2]);
      });
      return its(function() {
        return expect(guides.active).toEqual([2]);
      });
    });
    describe("no effect", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 0, 1, 3];
        return guides = run([2], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("no rows", function() {
      beforeEach(function() {
        rowIndents = [];
        return guides = run([], -1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("no rows above", function() {
      beforeEach(function() {
        rowIndents = [0];
        return guides = run([], -1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("multiple cursors", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 3, 2, 3];
        return guides = run([2, 3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("multiple cursors 2", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 3, 2, 3];
        return guides = run([1, 2], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([0, 1]);
      });
    });
    return describe("multiple cursors on the same level", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 3, 2, 3];
        return guides = run([2, 4], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
  });

  describe("statesBelowVisible", function() {
    var getLastRow, getRowIndents, guides, rowIndents, run;
    run = statesBelowVisible;
    guides = null;
    rowIndents = null;
    getRowIndents = function(r) {
      return rowIndents[r];
    };
    getLastRow = function() {
      return rowIndents.length - 1;
    };
    describe("only stack", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 3, 2, 1, 0];
        return guides = run([2], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("active and stack", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 2, 2, 1, 0];
        return guides = run([2], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("cursor on null row", function() {
      beforeEach(function() {
        rowIndents = [3, 2, null, 2, 1, 0];
        return guides = run([2], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("continuous nulls", function() {
      beforeEach(function() {
        rowIndents = [3, null, null, 2];
        return guides = run([1], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("no effect", function() {
      beforeEach(function() {
        rowIndents = [3, 0, 1, 0];
        return guides = run([3], 4, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("no rows", function() {
      beforeEach(function() {
        rowIndents = [];
        return guides = run([], -1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("no rows below", function() {
      beforeEach(function() {
        rowIndents = [0];
        return guides = run([], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([]);
      });
      return its(function() {
        return expect(guides.active).toEqual([]);
      });
    });
    describe("multiple cursors", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 3, 2, 1, 0];
        return guides = run([2, 3], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
    describe("multiple cursors 2", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 3, 2, 1, 0];
        return guides = run([3, 4], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([0, 1]);
      });
    });
    return describe("multiple cursors on the same level", function() {
      beforeEach(function() {
        rowIndents = [3, 2, 3, 2, 1, 0];
        return guides = run([1, 3], 1, getRowIndents, getLastRow());
      });
      its(function() {
        return expect(guides.stack).toEqual([0, 1]);
      });
      return its(function() {
        return expect(guides.active).toEqual([1]);
      });
    });
  });

  describe("getGuides", function() {
    var getLastRow, getRowIndents, guides, rowIndents, run;
    run = getGuides;
    guides = null;
    rowIndents = null;
    getRowIndents = function(r) {
      return rowIndents[r];
    };
    getLastRow = function() {
      return rowIndents.length - 1;
    };
    describe("typical", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 3, 0, 1, 2, 0, 1, 1, 0];
        return guides = run(3, 9, getLastRow(), [2, 6, 10], getRowIndents);
      });
      its(function() {
        return expect(guides.length).toBe(6);
      });
      its(function() {
        return expect(guides[0].length).toBe(2);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
      its(function() {
        return expect(guides[0].active).toBe(false);
      });
      its(function() {
        return expect(guides[0].stack).toBe(true);
      });
      its(function() {
        return expect(guides[1].length).toBe(2);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(0, 1));
      });
      its(function() {
        return expect(guides[1].active).toBe(true);
      });
      its(function() {
        return expect(guides[1].stack).toBe(true);
      });
      its(function() {
        return expect(guides[2].length).toBe(1);
      });
      its(function() {
        return expect(guides[2].point).toEqual(new Point(1, 2));
      });
      its(function() {
        return expect(guides[2].active).toBe(false);
      });
      its(function() {
        return expect(guides[2].stack).toBe(false);
      });
      its(function() {
        return expect(guides[3].length).toBe(2);
      });
      its(function() {
        return expect(guides[3].point).toEqual(new Point(3, 0));
      });
      its(function() {
        return expect(guides[3].active).toBe(true);
      });
      its(function() {
        return expect(guides[3].stack).toBe(true);
      });
      its(function() {
        return expect(guides[4].length).toBe(1);
      });
      its(function() {
        return expect(guides[4].point).toEqual(new Point(4, 1));
      });
      its(function() {
        return expect(guides[4].active).toBe(false);
      });
      its(function() {
        return expect(guides[4].stack).toBe(false);
      });
      its(function() {
        return expect(guides[5].length).toBe(1);
      });
      its(function() {
        return expect(guides[5].point).toEqual(new Point(6, 0));
      });
      its(function() {
        return expect(guides[5].active).toBe(true);
      });
      return its(function() {
        return expect(guides[5].stack).toBe(true);
      });
    });
    describe("when last line is null", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 2, null, 2, 0];
        return guides = run(3, 5, getLastRow(), [6], getRowIndents);
      });
      its(function() {
        return expect(guides.length).toBe(2);
      });
      its(function() {
        return expect(guides[0].length).toBe(4);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
      its(function() {
        return expect(guides[0].active).toBe(false);
      });
      its(function() {
        return expect(guides[0].stack).toBe(true);
      });
      its(function() {
        return expect(guides[1].length).toBe(4);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(0, 1));
      });
      its(function() {
        return expect(guides[1].active).toBe(true);
      });
      return its(function() {
        return expect(guides[1].stack).toBe(true);
      });
    });
    describe("when last line is null and the following line is also null", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 2, null, null, 2, 0];
        return guides = run(3, 5, getLastRow(), [7], getRowIndents);
      });
      its(function() {
        return expect(guides.length).toBe(2);
      });
      its(function() {
        return expect(guides[0].length).toBe(5);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
      its(function() {
        return expect(guides[0].active).toBe(false);
      });
      its(function() {
        return expect(guides[0].stack).toBe(true);
      });
      its(function() {
        return expect(guides[1].length).toBe(5);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(0, 1));
      });
      its(function() {
        return expect(guides[1].active).toBe(true);
      });
      return its(function() {
        return expect(guides[1].stack).toBe(true);
      });
    });
    return describe("when last line is null and the cursor doesnt follow", function() {
      beforeEach(function() {
        rowIndents = [0, 1, 2, 2, 2, null, null, 2, 1, 0];
        return guides = run(3, 5, getLastRow(), [8], getRowIndents);
      });
      its(function() {
        return expect(guides.length).toBe(2);
      });
      its(function() {
        return expect(guides[0].length).toBe(5);
      });
      its(function() {
        return expect(guides[0].point).toEqual(new Point(0, 0));
      });
      its(function() {
        return expect(guides[0].active).toBe(true);
      });
      its(function() {
        return expect(guides[0].stack).toBe(true);
      });
      its(function() {
        return expect(guides[1].length).toBe(5);
      });
      its(function() {
        return expect(guides[1].point).toEqual(new Point(0, 1));
      });
      its(function() {
        return expect(guides[1].active).toBe(false);
      });
      return its(function() {
        return expect(guides[1].stack).toBe(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9obi8uYXRvbS9wYWNrYWdlcy9pbmRlbnQtZ3VpZGUtaW1wcm92ZWQvc3BlYy9ndWlkZXMtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsZUFBUjs7RUFDSixzQkFBRCxFQUFXLGNBQVgsRUFBaUIsMENBQWpCLEVBQXFDLDBDQUFyQyxFQUF5RDs7RUFDeEQsUUFBUyxPQUFBLENBQVEsTUFBUjs7RUFHVixHQUFBLEdBQU0sU0FBQyxDQUFEO1dBQ0osRUFBQSxDQUFHLENBQUMsQ0FBQyxRQUFGLENBQUEsQ0FBSCxFQUFpQixDQUFqQjtFQURJOztFQUdOLElBQUEsR0FBTyxTQUFDLENBQUQ7V0FDTCxHQUFBLENBQUksQ0FBQyxDQUFDLFFBQUYsQ0FBQSxDQUFKLEVBQWtCLENBQWxCO0VBREs7O0VBR1AsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQTtBQUNuQixRQUFBO0lBQUEsTUFBQSxHQUFTO0lBQ1QsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUE7TUFDOUIsVUFBQSxDQUFXLFNBQUE7ZUFDVCxNQUFBLEdBQVMsUUFBQSxDQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBVCxFQUFtQyxFQUFuQztNQURBLENBQVg7TUFHQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFNLENBQUMsTUFBZCxDQUFxQixDQUFDLElBQXRCLENBQTJCLENBQTNCO01BQUgsQ0FBSjtNQUNBLEdBQUEsQ0FBSSxTQUFBO2VBQUcsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFqQixDQUF3QixDQUFDLElBQXpCLENBQThCLENBQTlCO01BQUgsQ0FBSjtNQUNBLEdBQUEsQ0FBSSxT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Q0FBYixDQUFoQztNQUFILENBQUo7TUFDQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBakIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixLQUE5QjtNQUFILENBQUo7TUFDQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBakIsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixJQUE3QjtNQUFILENBQUo7TUFFQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBakIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixDQUE5QjtNQUFILENBQUo7TUFDQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBakIsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxJQUFJLEtBQUosQ0FBVSxDQUFWLEVBQWEsQ0FBYixDQUFoQztNQUFILENBQUo7TUFDQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBakIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixJQUE5QjtNQUFILENBQUo7TUFDQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBakIsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixJQUE3QjtNQUFILENBQUo7TUFFQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBakIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixDQUE5QjtNQUFILENBQUo7TUFDQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBakIsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxJQUFJLEtBQUosQ0FBVSxDQUFWLEVBQWEsQ0FBYixDQUFoQztNQUFILENBQUo7TUFDQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBakIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixLQUE5QjtNQUFILENBQUo7TUFDQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBakIsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixLQUE3QjtNQUFILENBQUo7TUFFQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBakIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixDQUE5QjtNQUFILENBQUo7TUFDQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBakIsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxJQUFJLEtBQUosQ0FBVSxDQUFWLEVBQWEsQ0FBYixDQUFoQztNQUFILENBQUo7TUFDQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBakIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixJQUE5QjtNQUFILENBQUo7TUFDQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBakIsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixJQUE3QjtNQUFILENBQUo7TUFFQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBakIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixDQUE5QjtNQUFILENBQUo7TUFDQSxHQUFBLENBQUksU0FBQTtlQUFHLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBakIsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxJQUFJLEtBQUosQ0FBVSxDQUFWLEVBQWEs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QjtBQWhiQSIsInNvdXJjZXNDb250ZW50IjpbImdzID0gcmVxdWlyZSAnLi4vbGliL2d1aWRlcydcbnt0b0d1aWRlcywgdW5pcSwgc3RhdGVzQWJvdmVWaXNpYmxlLCBzdGF0ZXNCZWxvd1Zpc2libGUsIGdldEd1aWRlc30gPSBnc1xue1BvaW50fSA9IHJlcXVpcmUgJ2F0b20nXG5cbiMgVXNlIHRoZSBjb21tYW5kIGB3aW5kb3c6cnVuLXBhY2thZ2Utc3BlY3NgIChjbWQtYWx0LWN0cmwtcCkgdG8gcnVuIHNwZWNzLlxuaXRzID0gKGYpIC0+XG4gIGl0IGYudG9TdHJpbmcoKSwgZlxuXG5maXRzID0gKGYpIC0+XG4gIGZpdCBmLnRvU3RyaW5nKCksIGZcblxuZGVzY3JpYmUgXCJ0b0d1aWRlc1wiLCAtPlxuICBndWlkZXMgPSBudWxsXG4gIGRlc2NyaWJlIFwic3RlcC1ieS1zdGVwIGluZGVudFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGd1aWRlcyA9IHRvR3VpZGVzKFswLCAxLCAyLCAyLCAxLCAyLCAxLCAwXSwgW10pXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5sZW5ndGgpLnRvQmUoMylcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5sZW5ndGgpLnRvQmUoNilcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5wb2ludCkudG9FcXVhbChuZXcgUG9pbnQoMSwgMCkpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMV0ubGVuZ3RoKS50b0JlKDIpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMV0ucG9pbnQpLnRvRXF1YWwobmV3IFBvaW50KDIsIDEpKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzJdLmxlbmd0aCkudG9CZSgxKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzJdLnBvaW50KS50b0VxdWFsKG5ldyBQb2ludCg1LCAxKSlcblxuICBkZXNjcmliZSBcInN0ZWVwIGluZGVudFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGd1aWRlcyA9IHRvR3VpZGVzKFswLCAzLCAyLCAxLCAwXSwgW10pXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5sZW5ndGgpLnRvQmUoMylcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5sZW5ndGgpLnRvQmUoMylcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5wb2ludCkudG9FcXVhbChuZXcgUG9pbnQoMSwgMCkpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMV0ubGVuZ3RoKS50b0JlKDIpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMV0ucG9pbnQpLnRvRXF1YWwobmV3IFBvaW50KDEsIDEpKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzJdLmxlbmd0aCkudG9CZSgxKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzJdLnBvaW50KS50b0VxdWFsKG5ldyBQb2ludCgxLCAyKSlcblxuICBkZXNjcmliZSBcInN0ZWVwIGRlZGVudFwiLCAtPlxuICAgIGd1aWRlcyA9IG51bGxcbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBndWlkZXMgPSB0b0d1aWRlcyhbMCwgMSwgMiwgMywgMF0sIFtdKVxuXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMubGVuZ3RoKS50b0JlKDMpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0ubGVuZ3RoKS50b0JlKDMpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0ucG9pbnQpLnRvRXF1YWwobmV3IFBvaW50KDEsIDApKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzFdLmxlbmd0aCkudG9CZSgyKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzFdLnBvaW50KS50b0VxdWFsKG5ldyBQb2ludCgyLCAxKSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1syXS5sZW5ndGgpLnRvQmUoMSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1syXS5wb2ludCkudG9FcXVhbChuZXcgUG9pbnQoMywgMikpXG5cbiAgZGVzY3JpYmUgXCJyZWN1cnJpbmcgaW5kZW50XCIsIC0+XG4gICAgZ3VpZGVzID0gbnVsbFxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGd1aWRlcyA9IHRvR3VpZGVzKFswLCAxLCAxLCAwLCAxLCAwXSwgW10pXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5sZW5ndGgpLnRvQmUoMilcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5sZW5ndGgpLnRvQmUoMilcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5wb2ludCkudG9FcXVhbChuZXcgUG9pbnQoMSwgMCkpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMV0ubGVuZ3RoKS50b0JlKDEpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMV0ucG9pbnQpLnRvRXF1YWwobmV3IFBvaW50KDQsIDApKVxuXG4gIGRlc2NyaWJlIFwibm8gaW5kZW50XCIsIC0+XG4gICAgZ3VpZGVzID0gbnVsbFxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGd1aWRlcyA9IHRvR3VpZGVzKFswLCAwLCAwXSwgW10pXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5sZW5ndGgpLnRvQmUoMClcblxuICBkZXNjcmliZSBcInNhbWUgaW5kZW50XCIsIC0+XG4gICAgZ3VpZGVzID0gbnVsbFxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGd1aWRlcyA9IHRvR3VpZGVzKFsxLCAxLCAxXSwgW10pXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5sZW5ndGgpLnRvQmUoMSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5sZW5ndGgpLnRvQmUoMylcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5wb2ludCkudG9FcXVhbChuZXcgUG9pbnQoMCwgMCkpXG5cbiAgZGVzY3JpYmUgXCJzdGFjayBhbmQgYWN0aXZlXCIsIC0+XG4gICAgZGVzY3JpYmUgXCJzaW1wbGVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZ3VpZGVzID0gdG9HdWlkZXMoWzEsIDIsIDIsIDEsIDIsIDEsIDBdLCBbMl0pXG5cbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzBdLnN0YWNrKS50b0JlKHRydWUpXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5hY3RpdmUpLnRvQmUoZmFsc2UpXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1sxXS5zdGFjaykudG9CZSh0cnVlKVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMV0uYWN0aXZlKS50b0JlKHRydWUpXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1syXS5zdGFjaykudG9CZShmYWxzZSlcbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzJdLmFjdGl2ZSkudG9CZShmYWxzZSlcblxuICAgIGRlc2NyaWJlIFwiY3Vyc29yIG5vdCBvbiBkZWVwZXN0XCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGd1aWRlcyA9IHRvR3VpZGVzKFsxLCAyLCAxXSwgWzBdKVxuXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5zdGFjaykudG9CZSh0cnVlKVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0uYWN0aXZlKS50b0JlKHRydWUpXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1sxXS5zdGFjaykudG9CZShmYWxzZSlcbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzFdLmFjdGl2ZSkudG9CZShmYWxzZSlcblxuICAgIGRlc2NyaWJlIFwibm8gY3Vyc29yXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGd1aWRlcyA9IHRvR3VpZGVzKFsxLCAyLCAxXSwgW10pXG5cbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzBdLnN0YWNrKS50b0JlKGZhbHNlKVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0uYWN0aXZlKS50b0JlKGZhbHNlKVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMV0uc3RhY2spLnRvQmUoZmFsc2UpXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1sxXS5hY3RpdmUpLnRvQmUoZmFsc2UpXG5cbiAgICBkZXNjcmliZSBcIm11bHRpcGxlIGN1cnNvcnNcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZ3VpZGVzID0gdG9HdWlkZXMoWzEsIDIsIDEsIDIsIDAsIDFdLCBbMSwgMl0pXG5cbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzBdLnN0YWNrKS50b0JlKHRydWUpXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5hY3RpdmUpLnRvQmUodHJ1ZSlcbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzFdLnN0YWNrKS50b0JlKHRydWUpXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1sxXS5hY3RpdmUpLnRvQmUodHJ1ZSlcbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzJdLnN0YWNrKS50b0JlKGZhbHNlKVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMl0uYWN0aXZlKS50b0JlKGZhbHNlKVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbM10uc3RhY2spLnRvQmUoZmFsc2UpXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1szXS5hY3RpdmUpLnRvQmUoZmFsc2UpXG5cbiAgZGVzY3JpYmUgXCJlbXB0eSBsaW5lc1wiLCAtPlxuICAgIGRlc2NyaWJlIFwiYmV0d2VlbiB0aGUgc2FtZSBpbmRlbnRzXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGd1aWRlcyA9IHRvR3VpZGVzKFsxLCBudWxsLCAxXSwgW10pXG5cbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0ubGVuZ3RoKS50b0JlKDMpXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5wb2ludCkudG9FcXVhbChuZXcgUG9pbnQoMCwgMCkpXG5cbiAgICBkZXNjcmliZSBcInN0YXJ0cyB3aXRoIGEgbnVsbFwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBndWlkZXMgPSB0b0d1aWRlcyhbbnVsbCwgMV0sIFtdKVxuXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzBdLmxlbmd0aCkudG9CZSgyKVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0ucG9pbnQpLnRvRXF1YWwobmV3IFBvaW50KDAsIDApKVxuXG4gICAgZGVzY3JpYmUgXCJzdGFydHMgd2l0aCBudWxsc1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBndWlkZXMgPSB0b0d1aWRlcyhbbnVsbCwgbnVsbCwgMV0sIFtdKVxuXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzBdLmxlbmd0aCkudG9CZSgzKVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0ucG9pbnQpLnRvRXF1YWwobmV3IFBvaW50KDAsIDApKVxuXG4gICAgZGVzY3JpYmUgXCJlbmRzIHdpdGggYSBudWxsXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGd1aWRlcyA9IHRvR3VpZGVzKFsxLCBudWxsXSwgW10pXG5cbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0ubGVuZ3RoKS50b0JlKDEpXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5wb2ludCkudG9FcXVhbChuZXcgUG9pbnQoMCwgMCkpXG5cbiAgICBkZXNjcmliZSBcImVuZHMgd2l0aCBudWxsc1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBndWlkZXMgPSB0b0d1aWRlcyhbMSwgbnVsbCwgbnVsbF0sIFtdKVxuXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzBdLmxlbmd0aCkudG9CZSgxKVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0ucG9pbnQpLnRvRXF1YWwobmV3IFBvaW50KDAsIDApKVxuXG4gICAgZGVzY3JpYmUgXCJsYXJnZSB0byBzbWFsbFwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBndWlkZXMgPSB0b0d1aWRlcyhbMiwgbnVsbCwgMV0sIFtdKVxuXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5sZW5ndGgpLnRvQmUoMilcbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzBdLmxlbmd0aCkudG9CZSgzKVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0ucG9pbnQpLnRvRXF1YWwobmV3IFBvaW50KDAsIDApKVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMV0ubGVuZ3RoKS50b0JlKDEpXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1sxXS5wb2ludCkudG9FcXVhbChuZXcgUG9pbnQoMCwgMSkpXG5cbiAgICBkZXNjcmliZSBcInNtYWxsIHRvIGxhcmdlXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGd1aWRlcyA9IHRvR3VpZGVzKFsxLCBudWxsLCAyXSwgW10pXG5cbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLmxlbmd0aCkudG9CZSgyKVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0ubGVuZ3RoKS50b0JlKDMpXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5wb2ludCkudG9FcXVhbChuZXcgUG9pbnQoMCwgMCkpXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1sxXS5sZW5ndGgpLnRvQmUoMilcbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzFdLnBvaW50KS50b0VxdWFsKG5ldyBQb2ludCgxLCAxKSlcblxuICAgIGRlc2NyaWJlIFwiY29udGludW91c1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBndWlkZXMgPSB0b0d1aWRlcyhbMSwgbnVsbCwgbnVsbCwgMV0sIFtdKVxuXG4gICAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzBdLmxlbmd0aCkudG9CZSg0KVxuICAgICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0ucG9pbnQpLnRvRXF1YWwobmV3IFBvaW50KDAsIDApKVxuXG4gIGRlc2NyaWJlIFwiaW5jb21wbGV0ZSBpbmRlbnRcIiwgLT5cbiAgICBndWlkZXMgPSBudWxsXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZ3VpZGVzID0gdG9HdWlkZXMoWzEsIDEuNSwgMV0sIFtdKVxuXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMubGVuZ3RoKS50b0JlKDEpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0ubGVuZ3RoKS50b0JlKDMpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0ucG9pbnQpLnRvRXF1YWwobmV3IFBvaW50KDAsIDApKVxuXG5kZXNjcmliZSBcInVuaXFcIiwgLT5cbiAgaXRzIC0+IGV4cGVjdCh1bmlxKFsxLCAxLCAxLCAyLCAyLCAzLCAzXSkpLnRvRXF1YWwoWzEsIDIsIDNdKVxuICBpdHMgLT4gZXhwZWN0KHVuaXEoWzEsIDEsIDJdKSkudG9FcXVhbChbMSwgMl0pXG4gIGl0cyAtPiBleHBlY3QodW5pcShbMSwgMl0pKS50b0VxdWFsKFsxLCAyXSlcbiAgaXRzIC0+IGV4cGVjdCh1bmlxKFsxLCAxXSkpLnRvRXF1YWwoWzFdKVxuICBpdHMgLT4gZXhwZWN0KHVuaXEoWzFdKSkudG9FcXVhbChbMV0pXG4gIGl0cyAtPiBleHBlY3QodW5pcShbXSkpLnRvRXF1YWwoW10pXG5cbmRlc2NyaWJlIFwic3RhdGVzQWJvdmVWaXNpYmxlXCIsIC0+XG4gIHJ1biA9IHN0YXRlc0Fib3ZlVmlzaWJsZVxuICBndWlkZXMgPSBudWxsXG4gIHJvd0luZGVudHMgPSBudWxsXG4gIGdldFJvd0luZGVudHMgPSAocikgLT5cbiAgICByb3dJbmRlbnRzW3JdXG4gIGdldExhc3RSb3cgPSAoKSAtPlxuICAgIHJvd0luZGVudHMubGVuZ3RoIC0gMVxuXG4gIGRlc2NyaWJlIFwib25seSBzdGFja1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHJvd0luZGVudHMgPSBbXG4gICAgICAgIDAsIDEsIDIsIDMsIDIsXG4gICAgICAgIDNcbiAgICAgIF1cbiAgICAgIGd1aWRlcyA9IHJ1bihbM10sIDQsIGdldFJvd0luZGVudHMsIGdldExhc3RSb3coKSlcblxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLnN0YWNrKS50b0VxdWFsKFswLCAxXSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5hY3RpdmUpLnRvRXF1YWwoW10pXG5cbiAgZGVzY3JpYmUgXCJhY3RpdmUgYW5kIHN0YWNrXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcm93SW5kZW50cyA9IFtcbiAgICAgICAgMCwgMSwgMiwgMiwgMixcbiAgICAgICAgM1xuICAgICAgXVxuICAgICAgZ3VpZGVzID0gcnVuKFszXSwgNCwgZ2V0Um93SW5kZW50cywgZ2V0TGFzdFJvdygpKVxuXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuc3RhY2spLnRvRXF1YWwoWzAsIDFdKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLmFjdGl2ZSkudG9FcXVhbChbMV0pXG5cbiAgZGVzY3JpYmUgXCJjdXJzb3Igb24gbnVsbCByb3dcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICByb3dJbmRlbnRzID0gW1xuICAgICAgICAwLCAxLCAyLCBudWxsLCAyLFxuICAgICAgICAzXG4gICAgICBdXG4gICAgICBndWlkZXMgPSBydW4oWzNdLCA0LCBnZXRSb3dJbmRlbnRzLCBnZXRMYXN0Um93KCkpXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5zdGFjaykudG9FcXVhbChbMCwgMV0pXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuYWN0aXZlKS50b0VxdWFsKFsxXSlcblxuICBkZXNjcmliZSBcImNvbnRpbnVvdXMgbnVsbHNcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICByb3dJbmRlbnRzID0gW1xuICAgICAgICAwLCAxLCAyLCBudWxsLCBudWxsLFxuICAgICAgICAzXG4gICAgICBdXG4gICAgICBndWlkZXMgPSBydW4oWzNdLCA0LCBnZXRSb3dJbmRlbnRzLCBnZXRMYXN0Um93KCkpXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5zdGFjaykudG9FcXVhbChbMCwgMSwgMl0pXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuYWN0aXZlKS50b0VxdWFsKFsyXSlcblxuICBkZXNjcmliZSBcIm5vIGVmZmVjdFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHJvd0luZGVudHMgPSBbXG4gICAgICAgIDAsIDEsIDIsIDAsIDEsXG4gICAgICAgIDNcbiAgICAgIF1cbiAgICAgIGd1aWRlcyA9IHJ1bihbMl0sIDQsIGdldFJvd0luZGVudHMsIGdldExhc3RSb3coKSlcblxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLnN0YWNrKS50b0VxdWFsKFtdKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLmFjdGl2ZSkudG9FcXVhbChbXSlcblxuICBkZXNjcmliZSBcIm5vIHJvd3NcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICByb3dJbmRlbnRzID0gW11cbiAgICAgIGd1aWRlcyA9IHJ1bihbXSwgLTEsIGdldFJvd0luZGVudHMsIGdldExhc3RSb3coKSlcblxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLnN0YWNrKS50b0VxdWFsKFtdKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLmFjdGl2ZSkudG9FcXVhbChbXSlcblxuICBkZXNjcmliZSBcIm5vIHJvd3MgYWJvdmVcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICByb3dJbmRlbnRzID0gWzBdXG4gICAgICBndWlkZXMgPSBydW4oW10sIC0xLCBnZXRSb3dJbmRlbnRzLCBnZXRMYXN0Um93KCkpXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5zdGFjaykudG9FcXVhbChbXSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5hY3RpdmUpLnRvRXF1YWwoW10pXG5cbiAgZGVzY3JpYmUgXCJtdWx0aXBsZSBjdXJzb3JzXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcm93SW5kZW50cyA9IFtcbiAgICAgICAgMCwgMSwgMiwgMywgMixcbiAgICAgICAgM1xuICAgICAgXVxuICAgICAgZ3VpZGVzID0gcnVuKFsyLCAzXSwgNCwgZ2V0Um93SW5kZW50cywgZ2V0TGFzdFJvdygpKVxuXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuc3RhY2spLnRvRXF1YWwoWzAsIDFdKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLmFjdGl2ZSkudG9FcXVhbChbMV0pXG5cbiAgZGVzY3JpYmUgXCJtdWx0aXBsZSBjdXJzb3JzIDJcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICByb3dJbmRlbnRzID0gW1xuICAgICAgICAwLCAxLCAyLCAzLCAyLFxuICAgICAgICAzXG4gICAgICBdXG4gICAgICBndWlkZXMgPSBydW4oWzEsIDJdLCA0LCBnZXRSb3dJbmRlbnRzLCBnZXRMYXN0Um93KCkpXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5zdGFjaykudG9FcXVhbChbMCwgMV0pXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuYWN0aXZlKS50b0VxdWFsKFswLCAxXSlcblxuICBkZXNjcmliZSBcIm11bHRpcGxlIGN1cnNvcnMgb24gdGhlIHNhbWUgbGV2ZWxcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICByb3dJbmRlbnRzID0gW1xuICAgICAgICAwLCAxLCAyLCAzLCAyLFxuICAgICAgICAzXG4gICAgICBdXG4gICAgICBndWlkZXMgPSBydW4oWzIsIDRdLCA0LCBnZXRSb3dJbmRlbnRzLCBnZXRMYXN0Um93KCkpXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5zdGFjaykudG9FcXVhbChbMCwgMV0pXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuYWN0aXZlKS50b0VxdWFsKFsxXSlcblxuZGVzY3JpYmUgXCJzdGF0ZXNCZWxvd1Zpc2libGVcIiwgLT5cbiAgcnVuID0gc3RhdGVzQmVsb3dWaXNpYmxlXG4gIGd1aWRlcyA9IG51bGxcbiAgcm93SW5kZW50cyA9IG51bGxcbiAgZ2V0Um93SW5kZW50cyA9IChyKSAtPlxuICAgIHJvd0luZGVudHNbcl1cbiAgZ2V0TGFzdFJvdyA9ICgpIC0+XG4gICAgcm93SW5kZW50cy5sZW5ndGggLSAxXG5cbiAgZGVzY3JpYmUgXCJvbmx5IHN0YWNrXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcm93SW5kZW50cyA9IFtcbiAgICAgICAgMyxcbiAgICAgICAgMiwgMywgMiwgMSwgMFxuICAgICAgXVxuICAgICAgZ3VpZGVzID0gcnVuKFsyXSwgMSwgZ2V0Um93SW5kZW50cywgZ2V0TGFzdFJvdygpKVxuXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuc3RhY2spLnRvRXF1YWwoWzAsIDFdKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLmFjdGl2ZSkudG9FcXVhbChbXSlcblxuICBkZXNjcmliZSBcImFjdGl2ZSBhbmQgc3RhY2tcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICByb3dJbmRlbnRzID0gW1xuICAgICAgICAzLFxuICAgICAgICAyLCAyLCAyLCAxLCAwXG4gICAgICBdXG4gICAgICBndWlkZXMgPSBydW4oWzJdLCAxLCBnZXRSb3dJbmRlbnRzLCBnZXRMYXN0Um93KCkpXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5zdGFjaykudG9FcXVhbChbMCwgMV0pXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuYWN0aXZlKS50b0VxdWFsKFsxXSlcblxuICBkZXNjcmliZSBcImN1cnNvciBvbiBudWxsIHJvd1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHJvd0luZGVudHMgPSBbXG4gICAgICAgIDMsXG4gICAgICAgIDIsIG51bGwsIDIsIDEsIDBcbiAgICAgIF1cbiAgICAgIGd1aWRlcyA9IHJ1bihbMl0sIDEsIGdldFJvd0luZGVudHMsIGdldExhc3RSb3coKSlcblxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLnN0YWNrKS50b0VxdWFsKFswLCAxXSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5hY3RpdmUpLnRvRXF1YWwoWzFdKVxuXG4gIGRlc2NyaWJlIFwiY29udGludW91cyBudWxsc1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHJvd0luZGVudHMgPSBbXG4gICAgICAgIDMsXG4gICAgICAgIG51bGwsIG51bGwsIDJcbiAgICAgIF1cbiAgICAgIGd1aWRlcyA9IHJ1bihbMV0sIDEsIGdldFJvd0luZGVudHMsIGdldExhc3RSb3coKSlcblxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLnN0YWNrKS50b0VxdWFsKFswLCAxXSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5hY3RpdmUpLnRvRXF1YWwoWzFdKVxuXG4gIGRlc2NyaWJlIFwibm8gZWZmZWN0XCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcm93SW5kZW50cyA9IFtcbiAgICAgICAgMyxcbiAgICAgICAgMCwgMSwgMFxuICAgICAgXVxuICAgICAgZ3VpZGVzID0gcnVuKFszXSwgNCwgZ2V0Um93SW5kZW50cywgZ2V0TGFzdFJvdygpKVxuXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuc3RhY2spLnRvRXF1YWwoW10pXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuYWN0aXZlKS50b0VxdWFsKFtdKVxuXG4gIGRlc2NyaWJlIFwibm8gcm93c1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHJvd0luZGVudHMgPSBbXVxuICAgICAgZ3VpZGVzID0gcnVuKFtdLCAtMSwgZ2V0Um93SW5kZW50cywgZ2V0TGFzdFJvdygpKVxuXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuc3RhY2spLnRvRXF1YWwoW10pXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuYWN0aXZlKS50b0VxdWFsKFtdKVxuXG4gIGRlc2NyaWJlIFwibm8gcm93cyBiZWxvd1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHJvd0luZGVudHMgPSBbMF1cbiAgICAgIGd1aWRlcyA9IHJ1bihbXSwgMSwgZ2V0Um93SW5kZW50cywgZ2V0TGFzdFJvdygpKVxuXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuc3RhY2spLnRvRXF1YWwoW10pXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuYWN0aXZlKS50b0VxdWFsKFtdKVxuXG4gIGRlc2NyaWJlIFwibXVsdGlwbGUgY3Vyc29yc1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHJvd0luZGVudHMgPSBbXG4gICAgICAgIDMsXG4gICAgICAgIDIsIDMsIDIsIDEsIDBcbiAgICAgIF1cbiAgICAgIGd1aWRlcyA9IHJ1bihbMiwgM10sIDEsIGdldFJvd0luZGVudHMsIGdldExhc3RSb3coKSlcblxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLnN0YWNrKS50b0VxdWFsKFswLCAxXSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5hY3RpdmUpLnRvRXF1YWwoWzFdKVxuXG4gIGRlc2NyaWJlIFwibXVsdGlwbGUgY3Vyc29ycyAyXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcm93SW5kZW50cyA9IFtcbiAgICAgICAgMyxcbiAgICAgICAgMiwgMywgMiwgMSwgMFxuICAgICAgXVxuICAgICAgZ3VpZGVzID0gcnVuKFszLCA0XSwgMSwgZ2V0Um93SW5kZW50cywgZ2V0TGFzdFJvdygpKVxuXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuc3RhY2spLnRvRXF1YWwoWzAsIDFdKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLmFjdGl2ZSkudG9FcXVhbChbMCwgMV0pXG5cbiAgZGVzY3JpYmUgXCJtdWx0aXBsZSBjdXJzb3JzIG9uIHRoZSBzYW1lIGxldmVsXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcm93SW5kZW50cyA9IFtcbiAgICAgICAgMyxcbiAgICAgICAgMiwgMywgMiwgMSwgMFxuICAgICAgXVxuICAgICAgZ3VpZGVzID0gcnVuKFsxLCAzXSwgMSwgZ2V0Um93SW5kZW50cywgZ2V0TGFzdFJvdygpKVxuXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMuc3RhY2spLnRvRXF1YWwoWzAsIDFdKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLmFjdGl2ZSkudG9FcXVhbChbMV0pXG5cbmRlc2NyaWJlIFwiZ2V0R3VpZGVzXCIsIC0+XG4gIHJ1biA9IGdldEd1aWRlc1xuICBndWlkZXMgPSBudWxsXG4gIHJvd0luZGVudHMgPSBudWxsXG4gIGdldFJvd0luZGVudHMgPSAocikgLT5cbiAgICByb3dJbmRlbnRzW3JdXG4gIGdldExhc3RSb3cgPSAoKSAtPlxuICAgIHJvd0luZGVudHMubGVuZ3RoIC0gMVxuXG4gIGRlc2NyaWJlIFwidHlwaWNhbFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHJvd0luZGVudHMgPSBbXG4gICAgICAgIDAsIDEsIDIsXG4gICAgICAgIDIsIDMsIDAsIDEsIDIsIDAsIDEsXG4gICAgICAgIDEsIDBcbiAgICAgIF1cbiAgICAgIGd1aWRlcyA9IHJ1bigzLCA5LCBnZXRMYXN0Um93KCksIFsyLCA2LCAxMF0sIGdldFJvd0luZGVudHMpXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5sZW5ndGgpLnRvQmUoNilcblxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzBdLmxlbmd0aCkudG9CZSgyKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzBdLnBvaW50KS50b0VxdWFsKG5ldyBQb2ludCgwLCAwKSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5hY3RpdmUpLnRvQmUoZmFsc2UpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0uc3RhY2spLnRvQmUodHJ1ZSlcblxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzFdLmxlbmd0aCkudG9CZSgyKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzFdLnBvaW50KS50b0VxdWFsKG5ldyBQb2ludCgwLCAxKSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1sxXS5hY3RpdmUpLnRvQmUodHJ1ZSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1sxXS5zdGFjaykudG9CZSh0cnVlKVxuXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMl0ubGVuZ3RoKS50b0JlKDEpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMl0ucG9pbnQpLnRvRXF1YWwobmV3IFBvaW50KDEsIDIpKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzJdLmFjdGl2ZSkudG9CZShmYWxzZSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1syXS5zdGFjaykudG9CZShmYWxzZSlcblxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzNdLmxlbmd0aCkudG9CZSgyKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzNdLnBvaW50KS50b0VxdWFsKG5ldyBQb2ludCgzLCAwKSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1szXS5hY3RpdmUpLnRvQmUodHJ1ZSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1szXS5zdGFjaykudG9CZSh0cnVlKVxuXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbNF0ubGVuZ3RoKS50b0JlKDEpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbNF0ucG9pbnQpLnRvRXF1YWwobmV3IFBvaW50KDQsIDEpKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzRdLmFjdGl2ZSkudG9CZShmYWxzZSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1s0XS5zdGFjaykudG9CZShmYWxzZSlcblxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzVdLmxlbmd0aCkudG9CZSgxKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzVdLnBvaW50KS50b0VxdWFsKG5ldyBQb2ludCg2LCAwKSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1s1XS5hY3RpdmUpLnRvQmUodHJ1ZSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1s1XS5zdGFjaykudG9CZSh0cnVlKVxuXG4gIGRlc2NyaWJlIFwid2hlbiBsYXN0IGxpbmUgaXMgbnVsbFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHJvd0luZGVudHMgPSBbXG4gICAgICAgIDAsIDEsIDIsXG4gICAgICAgIDIsIDIsIG51bGwsXG4gICAgICAgIDIsIDBcbiAgICAgIF1cbiAgICAgIGd1aWRlcyA9IHJ1bigzLCA1LCBnZXRMYXN0Um93KCksIFs2XSwgZ2V0Um93SW5kZW50cylcblxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzLmxlbmd0aCkudG9CZSgyKVxuXG4gICAgIyBgbGVuZ3RoYCBpbmNsdWRlcyBvZmYtc2NyZWVuIGluZGVudHMsIHdoaWNoIGFyZSBleHRlbmRlZCBieVxuICAgICMgY291bnRpbmcgbnVsbCBsaW5lcy5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5sZW5ndGgpLnRvQmUoNClcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5wb2ludCkudG9FcXVhbChuZXcgUG9pbnQoMCwgMCkpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0uYWN0aXZlKS50b0JlKGZhbHNlKVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzBdLnN0YWNrKS50b0JlKHRydWUpXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1sxXS5sZW5ndGgpLnRvQmUoNClcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1sxXS5wb2ludCkudG9FcXVhbChuZXcgUG9pbnQoMCwgMSkpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMV0uYWN0aXZlKS50b0JlKHRydWUpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMV0uc3RhY2spLnRvQmUodHJ1ZSlcblxuICBkZXNjcmliZSBcIndoZW4gbGFzdCBsaW5lIGlzIG51bGwgYW5kIHRoZSBmb2xsb3dpbmcgbGluZSBpcyBhbHNvIG51bGxcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICByb3dJbmRlbnRzID0gW1xuICAgICAgICAwLCAxLCAyLFxuICAgICAgICAyLCAyLCBudWxsLFxuICAgICAgICBudWxsLCAyLCAwXG4gICAgICBdXG4gICAgICBndWlkZXMgPSBydW4oMywgNSwgZ2V0TGFzdFJvdygpLCBbN10sIGdldFJvd0luZGVudHMpXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlcy5sZW5ndGgpLnRvQmUoMilcblxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzBdLmxlbmd0aCkudG9CZSg1KVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzBdLnBvaW50KS50b0VxdWFsKG5ldyBQb2ludCgwLCAwKSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5hY3RpdmUpLnRvQmUoZmFsc2UpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0uc3RhY2spLnRvQmUodHJ1ZSlcblxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzFdLmxlbmd0aCkudG9CZSg1KVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzFdLnBvaW50KS50b0VxdWFsKG5ldyBQb2ludCgwLCAxKSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1sxXS5hY3RpdmUpLnRvQmUodHJ1ZSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1sxXS5zdGFjaykudG9CZSh0cnVlKVxuXG4gIGRlc2NyaWJlIFwid2hlbiBsYXN0IGxpbmUgaXMgbnVsbCBhbmQgdGhlIGN1cnNvciBkb2VzbnQgZm9sbG93XCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcm93SW5kZW50cyA9IFtcbiAgICAgICAgMCwgMSwgMixcbiAgICAgICAgMiwgMiwgbnVsbCxcbiAgICAgICAgbnVsbCwgMiwgMSwgMFxuICAgICAgXVxuICAgICAgZ3VpZGVzID0gcnVuKDMsIDUsIGdldExhc3RSb3coKSwgWzhdLCBnZXRSb3dJbmRlbnRzKVxuXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXMubGVuZ3RoKS50b0JlKDIpXG5cbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5sZW5ndGgpLnRvQmUoNSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1swXS5wb2ludCkudG9FcXVhbChuZXcgUG9pbnQoMCwgMCkpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0uYWN0aXZlKS50b0JlKHRydWUpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMF0uc3RhY2spLnRvQmUodHJ1ZSlcblxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzFdLmxlbmd0aCkudG9CZSg1KVxuICAgIGl0cyAtPiBleHBlY3QoZ3VpZGVzWzFdLnBvaW50KS50b0VxdWFsKG5ldyBQb2ludCgwLCAxKSlcbiAgICBpdHMgLT4gZXhwZWN0KGd1aWRlc1sxXS5hY3RpdmUpLnRvQmUoZmFsc2UpXG4gICAgaXRzIC0+IGV4cGVjdChndWlkZXNbMV0uc3RhY2spLnRvQmUoZmFsc2UpXG4iXX0=
