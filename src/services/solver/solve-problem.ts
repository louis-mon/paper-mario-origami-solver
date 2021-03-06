import _, { sumBy } from "lodash";
import {
  Goal,
  ProblemInput,
  ProblemInputCircles,
  TargetInput,
} from "../types/problem-input";
import {
  Solution,
  SolutionStep,
  SolutionStepCircle,
  SolutionStepRay,
  SolutionStepState,
} from "../types/solution";

export type SolveProblemParams = {
  problem: ProblemInput;
  onSolution: (solution: Solution) => void;
  onFinish: () => void;
};

type GetNewState<T extends SolutionStep> = (
  circles: ProblemInputCircles,
  step: T
) => ProblemInputCircles;

type CheckedSolution = Array<{ index: number; goal: Goal }>;

export const solveProblem = (params: SolveProblemParams) => {
  const nbCircles = params.problem.circles.length;
  const nbCells = params.problem.circles[0].length;
  const nbRays = nbCells / 2;
  const blockSize = 2;

  const moveCellsRange = _.range(1, nbCells);
  const circleIndexes = _.range(nbCircles);
  const raysIndexes = _.range(nbRays);
  const raysMovesRange = _.range(1, nbCircles * 2);
  const blockIndexes = _.range(blockSize);
  const cellIndexes = _.range(nbCells);

  type SearchState = {
    problem: ProblemInput;
    steps: SolutionStepState[];
  };

  const alreadyChecked: Array<{ [s: string]: boolean }> = _.range(
    params.problem.nbSteps
  ).map(() => ({}));

  let canceled = false;

  const makeMinimalStep = (step: SolutionStep): SolutionStep => {
    switch (step.kind) {
      case "circle":
        const invert = step.move > nbRays;
        return {
          ...step,
          move: invert ? step.move - nbCells : step.move,
        };
      case "ray":
        const minMove =
          step.move > nbCircles ? nbCircles * 2 - step.move : step.move;
        const cellIndex =
          step.move > nbCircles ? step.rayIndex + nbRays : step.rayIndex;
        return { kind: "ray", move: minMove, rayIndex: cellIndex };
    }
  };

  const makeSolution = (
    state: SearchState,
    solution: CheckedSolution
  ): Solution => {
    const normalizedSteps = state.steps.map(
      (step): SolutionStepState => ({
        ...step,
        step: makeMinimalStep(step.step),
      })
    );

    const divergence =
      _.sumBy(solution, (part) => {
        const colorsInPart = _.uniq(
          state.problem.circles.flatMap((circle) => [
            circle[part.index % nbCells],
            ...(part.goal === "block"
              ? [circle[(part.index + 1) % nbCells]]
              : []),
          ])
        ).filter((value): value is number => value !== null);

        if (colorsInPart.length === 0) return 0;
        if (colorsInPart.length === 1) {
          const goal = state.problem.goals[colorsInPart[0]];
          if (!goal || goal === part.goal) return 0;
          return 0.5;
        }
        return 1;
      }) / solution.length;

    return {
      divergence,
      finalState: state.problem,
      steps: normalizedSteps,
      totalMove: sumBy(normalizedSteps, (step) => Math.abs(step.step.move)),
    };
  };

  const cacheProblem = (problem: ProblemInput): boolean => {
    const signature = problem.circles
      .map((circle) =>
        circle.map((v) => (v === null ? " " : v.toString())).join(",")
      )
      .join(",");
    const solsWithLessOrEqualStep = _.takeRight(
      alreadyChecked,
      problem.nbSteps + 1
    );
    if (!solsWithLessOrEqualStep[0][signature]) {
      solsWithLessOrEqualStep.forEach((cache) => {
        cache[signature] = true;
      });
      return false;
    }
    return true;
  };

  const checkSolution = (problem: ProblemInput): CheckedSolution | null => {
    const checkLine =
      (p: (value: TargetInput) => boolean) => (rayIndex: number) =>
        problem.circles.every((circle) => p(circle[rayIndex % nbCells]));
    const checkLineFull = checkLine((value) => value !== null);
    const checkLineEmpty = checkLine((value) => value === null);
    const checkLineOk = (r: number) => checkLineFull(r) || checkLineEmpty(r);
    const checkBlock = (rayIndex: number) => {
      return circleIndexes.every((circleIndex) =>
        blockIndexes.every((i) => {
          const value = problem.circles[circleIndex][(i + rayIndex) % nbCells];
          return circleIndex < blockSize ? value !== null : value === null;
        })
      );
    };

    const checkOnRange = (
      fromIndex: number,
      toIndex: number
    ): CheckedSolution | null => {
      let currentIndex = fromIndex;
      const solution: CheckedSolution = [];
      while (currentIndex < toIndex) {
        if (checkLineOk(currentIndex)) {
          solution.push({ goal: "line", index: currentIndex });
          ++currentIndex;
        } else if (checkBlock(currentIndex) && currentIndex < toIndex - 1) {
          solution.push({ goal: "block", index: currentIndex });
          currentIndex += 2;
        } else return null;
      }
      return solution;
    };

    return checkOnRange(0, nbCells) || checkOnRange(1, nbCells + 1);
  };

  const normalizeModulo = (value: number, modulo: number) =>
    value >= 0 ? value % modulo : modulo - (-value % modulo);

  const circleStep: GetNewState<SolutionStepCircle> = (
    circles,
    step
  ): ProblemInputCircles => {
    return circles.map((circle, circleIndex) => {
      if (circleIndex !== step.circleIndex) return circle;
      return cellIndexes.map(
        (cellIndex) => circle[normalizeModulo(cellIndex - step.move, nbCells)]
      );
    });
  };

  const rayStep: GetNewState<SolutionStepRay> = (circles, step) => {
    return circles.map((circle, circleIndex) =>
      circle.map((value, cellIndex) => {
        if (cellIndex % nbRays === step.rayIndex) {
          const dir = cellIndex < nbRays ? -1 : 1;
          const pos = normalizeModulo(
            circleIndex + step.move * dir,
            nbCircles * 2
          );
          return circles[pos < nbCircles ? pos : nbCircles * 2 - pos - 1][
            pos < nbCircles ? cellIndex : (cellIndex + nbRays) % nbCells
          ];
        }
        return value;
      })
    );
  };

  const checkNewStep = async <T extends SolutionStep>({
    currentState,
    newStep,
    getNewState,
  }: {
    currentState: SearchState;
    newStep: T;
    getNewState: GetNewState<T>;
  }): Promise<void> => {
    if (canceled) return;
    const newState: SearchState = {
      problem: {
        ...currentState.problem,
        nbSteps: currentState.problem.nbSteps - 1,
        circles: getNewState(currentState.problem.circles, newStep),
      },
      steps: currentState.steps.concat({
        step: newStep,
        problem: currentState.problem,
      }),
    };
    if (cacheProblem(newState.problem)) return;
    const solution = checkSolution(newState.problem);
    if (solution) {
      params.onSolution(makeSolution(newState, solution));
      return;
    }
    await searchForSolsGivenSteps(newState);
  };

  const callNonBlocking = (f: () => Promise<void>): Promise<void> =>
    new Promise((resolve) => setTimeout(() => f().then(resolve), 0));

  const searchForSolsGivenSteps = async (
    currentState: SearchState
  ): Promise<void> => {
    if (currentState.problem.nbSteps === 0) {
      return;
    }
    const circlesToSkip = _.takeRightWhile(
      currentState.steps,
      (step) => step.step.kind === "circle"
    ).map((step) => (step.step as SolutionStepCircle).circleIndex);
    const circleSubSteps = _.difference(circleIndexes, circlesToSkip).flatMap(
      (circleIndex) =>
        moveCellsRange.map(
          (move) => () =>
            checkNewStep({
              currentState,
              newStep: { kind: "circle", move, circleIndex },
              getNewState: circleStep,
            })
        )
    );

    const raysToSkip = _.takeRightWhile(
      currentState.steps,
      (step) => step.step.kind === "ray"
    ).map((step) => (step.step as SolutionStepRay).rayIndex);
    const raySubSteps = _.difference(raysIndexes, raysToSkip).flatMap(
      (rayIndex) =>
        raysMovesRange.map(
          (move) => () =>
            checkNewStep({
              currentState,
              newStep: { kind: "ray", move, rayIndex },
              getNewState: rayStep,
            })
        )
    );
    const callStep: (f: () => Promise<void>) => Promise<void> =
      currentState.problem.nbSteps === 1 ? (f) => f() : callNonBlocking;
    await Promise.all(circleSubSteps.concat(raySubSteps).map(callStep));
  };

  searchForSolsGivenSteps({
    problem: params.problem,
    steps: [],
  }).then(() => {
    if (!canceled) params.onFinish();
  });

  return {
    cancel: () => {
      canceled = true;
    },
  };
};
