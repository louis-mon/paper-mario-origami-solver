import { ProblemInput } from "../types/problem-input";
import { solveProblem } from "./solve-problem";
import { Solution, SolutionStep } from "../types/solution";

describe("Solve problem", () => {
  const expectProblem = (problem: Omit<ProblemInput, "goals">) => {
    const findSolutions = (): Promise<Solution[]> =>
      new Promise((resolve) => {
        const solutions: Solution[] = [];
        solveProblem({
          problem: { ...problem, goals: {} },
          onSolution: (sol) => solutions.push(sol),
          onFinish: () => resolve(solutions),
        });
      });
    const tester = {
      toHaveSolution: async (expectedSol: SolutionStep[]) => {
        const solutions = await findSolutions();
        expect(
          solutions.map((sol) => sol.steps.map((step) => step.step))
        ).toContainEqual(expectedSol);
        return tester;
      },
      toHaveOnlySolution: async (expectedSol: SolutionStep[]) => {
        const solutions = await findSolutions();
        expect(
          solutions.map((sol) => sol.steps.map((step) => step.step))
        ).toEqual([expectedSol]);
      },
    };
    return tester;
  };

  const tar0 = 0;
  test("one line circle", () =>
    expectProblem({
      nbSteps: 1,
      circles: [
        [null, null, null, tar0, null, null],
        [null, tar0, null, null, null, null],
        [null, null, null, tar0, null, null],
      ],
    }).toHaveOnlySolution([{ kind: "circle", circleIndex: 1, move: 2 }]));

  test("one line past end circle", () =>
    expectProblem({
      nbSteps: 1,
      circles: [
        [null, tar0, null, null, null, null],
        [null, null, null, tar0, null, null],
        [null, tar0, null, null, null, null],
      ],
    }).toHaveOnlySolution([{ kind: "circle", circleIndex: 1, move: -2 }]));

  test("two lines circle", () =>
    expectProblem({
      nbSteps: 2,
      circles: [
        [null, tar0, null, null, null, null],
        [null, null, null, tar0, null, null],
        [null, tar0, null, null, null, null],
        [tar0, null, null, null, null, null],
      ],
    }).toHaveOnlySolution([
      { kind: "circle", circleIndex: 1, move: -2 },
      { kind: "circle", circleIndex: 3, move: 1 },
    ]));

  const oneLineRay1 = expectProblem({
    nbSteps: 1,
    circles: [
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, tar0, null, null, tar0, null],
      [null, tar0, null, null, tar0, null],
    ],
  });
  test("one line ray 1", () =>
    oneLineRay1.toHaveSolution([{ kind: "ray", rayIndex: 1, move: 2 }]));

  test("one line ray 1: second", () =>
    oneLineRay1.toHaveSolution([{ kind: "ray", rayIndex: 4, move: 2 }]));

  test("one line ray 2", () =>
    expectProblem({
      nbSteps: 1,
      circles: [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [tar0, null, null, tar0, null, null],
        [tar0, null, null, tar0, null, null],
      ],
    }).toHaveSolution([{ kind: "ray", rayIndex: 0, move: 2 }]));

  test("one line ray 3", () =>
    expectProblem({
      nbSteps: 1,
      circles: [
        [null, tar0, null, null, tar0, null],
        [null, tar0, null, null, null, null],
        [null, tar0, null, null, null, null],
        [null, null, null, null, null, null],
      ],
    }).toHaveSolution([{ kind: "ray", rayIndex: 1, move: 1 }]));

  test("two lines ray 1", () =>
    expectProblem({
      nbSteps: 2,
      circles: [
        [null, tar0, tar0, null, tar0, tar0],
        [null, tar0, null, null, null, tar0],
        [null, tar0, null, null, null, tar0],
        [null, null, null, null, null, null],
      ],
    }).toHaveSolution([
      { kind: "ray", rayIndex: 1, move: 1 },
      { kind: "ray", rayIndex: 2, move: 3 },
    ]));

  test("line with ray then circle", () =>
    expectProblem({
      nbSteps: 2,
      circles: [
        [null, tar0, null, null, null, null],
        [null, tar0, null, null, null, null],
        [null, tar0, tar0, null, null, null],
        [null, null, null, null, null, null],
      ],
    }).toHaveOnlySolution([
      { kind: "ray", rayIndex: 2, move: 1 },
      { kind: "circle", circleIndex: 3, move: -1 },
    ]));

  const expectBlockOneCircleMove = expectProblem({
    nbSteps: 1,
    circles: [
      [tar0, tar0, null, null, null, null],
      [null, tar0, tar0, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ],
  });
  test("block with one circle move", () =>
    expectBlockOneCircleMove.toHaveSolution([
      { kind: "circle", circleIndex: 1, move: -1 },
    ]));

  test("block with one circle move 2", () =>
    expectBlockOneCircleMove.toHaveSolution([
      { kind: "circle", circleIndex: 0, move: 1 },
    ]));

  test("block with one circle move 3", () =>
    expectProblem({
      nbSteps: 1,
      circles: [
        [tar0, null, null, null, null, tar0],
        [null, tar0, tar0, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
      ],
    }).toHaveSolution([{ kind: "circle", circleIndex: 1, move: -2 }]));

  test("block line spaced with one circle move 3", () =>
    expectProblem({
      nbSteps: 2,
      circles: [
        [null, null, null, tar0, null, tar0],
        [null, tar0, tar0, tar0, null, tar0],
        [null, null, null, null, null, null],
        [tar0, null, null, tar0, null, null],
      ],
    }).toHaveOnlySolution([
      { kind: "ray", rayIndex: 0, move: 1 },
      { kind: "circle", circleIndex: 1, move: -2 },
    ]));
});
