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

  let tar0 = 0;
  it("solves: one line", () =>
    expectProblem({
      nbSteps: 1,
      circles: [
        [null, null, null, tar0, null, null],
        [null, tar0, null, null, null, null],
        [null, null, null, tar0, null, null],
      ],
    }).toHaveSolution([{ kind: "circle", circleIndex: 1, move: 2 }]));

  it("solves: one line past end", () =>
    expectProblem({
      nbSteps: 1,
      circles: [
        [null, tar0, null, null, null, null],
        [null, null, null, tar0, null, null],
        [null, tar0, null, null, null, null],
      ],
    }).toHaveSolution([{ kind: "circle", circleIndex: 1, move: 4 }]));

  it("solves: two lines", () =>
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
});
