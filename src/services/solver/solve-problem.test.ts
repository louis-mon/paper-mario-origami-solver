import { ProblemInput } from "../types/problem-input";
import { solveProblem } from "./solve-problem";
import { Solution, SolutionStep } from "../types/solution";

describe("Solve problem", () => {
  const expectProblem = (problem: ProblemInput) => {
    const findSolutions = (): Promise<Solution[]> =>
      new Promise((resolve) => {
        const solutions: Solution[] = [];
        solveProblem({
          problem,
          onSolution: (sol) => solutions.push(sol),
          onFinish: () => resolve(solutions),
        });
      });
    return {
      toHaveSolution: async (expectedSol: SolutionStep[]) => {
        const solutions = await findSolutions();
        expect(
          solutions.map((sol) => sol.steps.map((step) => step.step))
        ).toContainEqual(expectedSol);
      },
    };
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
    }).toHaveSolution([{ kind: "circle", circleIndex: 1, move: 2 }]));

  test("one line past end circle", () =>
    expectProblem({
      nbSteps: 1,
      circles: [
        [null, tar0, null, null, null, null],
        [null, null, null, tar0, null, null],
        [null, tar0, null, null, null, null],
      ],
    }).toHaveSolution([{ kind: "circle", circleIndex: 1, move: 4 }]));

  test("two lines circle", () =>
    expectProblem({
      nbSteps: 2,
      circles: [
        [null, tar0, null, null, null, null],
        [null, null, null, tar0, null, null],
        [null, tar0, null, null, null, null],
        [tar0, null, null, null, null, null],
      ],
    }).toHaveSolution([
      { kind: "circle", circleIndex: 1, move: 4 },
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
    oneLineRay1.toHaveSolution([{ kind: "ray", rayIndex: 1, move: 6 }]));

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
    }).toHaveSolution([
      { kind: "ray", rayIndex: 2, move: 1 },
      { kind: "circle", circleIndex: 3, move: 5 },
    ]));
});