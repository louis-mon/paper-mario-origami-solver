import _ from "lodash";
import {
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

export const solveProblem = (params: SolveProblemParams) => {
  const nbCircles = params.problem.circles.length;
  const nbCells = params.problem.circles[0].length;
  const nbRays = nbCells / 2;
  const blockSize = 2;

  type SearchState = {
    problem: ProblemInput;
    steps: SolutionStepState[];
  };

  const alreadyChecked: Array<{ [s: string]: boolean }> = _.range(
    params.problem.nbSteps
  ).map(() => ({}));

  let canceled = false;

  const cacheProblem = (problem: ProblemInput) => {
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

  const checkSolution = (problem: ProblemInput): boolean => {
    const checkLine =
      (p: (value: TargetInput) => boolean) => (rayIndex: number) =>
        problem.circles.every((circle) => p(circle[rayIndex % nbCells]));
    const checkLineFull = checkLine((value) => value !== null);
    const checkLineEmpty = checkLine((value) => value === null);
    const checkLineOk = (r: number) => checkLineFull(r) || checkLineEmpty(r);
    const checkBlock = (rayIndex: number) =>
      _.range(nbCircles).every((circleIndex) =>
        _.range(blockSize).every((i) => {
          const value = problem.circles[circleIndex][(i + rayIndex) % nbCells];
          return circleIndex < blockSize ? value !== null : value === null;
        })
      );

    const findRayIndexFailed = (fromIndex: number, toIndex: number) => {
      let currentIndex = fromIndex;
      let foundLine = false;
      while (currentIndex < toIndex) {
        if (checkLineOk(currentIndex)) {
          foundLine = true;
          ++currentIndex;
        } else if (checkBlock(currentIndex) && currentIndex < toIndex - 1) {
          currentIndex += 2;
        } else return { currentIndex, foundLine };
      }
      return null;
    };

    const failedSearch = findRayIndexFailed(0, nbCells);
    return (
      failedSearch === null ||
      (!failedSearch.foundLine &&
        findRayIndexFailed(
          failedSearch.currentIndex + nbCells - 1,
          nbCells * 2 + 1
        ) === null)
    );
  };

  const normalizeModulo = (value: number, modulo: number) =>
    value >= 0 ? value % modulo : modulo - (-value % modulo);

  const circleStep: GetNewState<SolutionStepCircle> = (
    circles,
    step
  ): ProblemInputCircles => {
    return circles.map((circle, circleIndex) => {
      if (circleIndex !== step.circleIndex) return circle;
      return _.range(nbCells).map(
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
  }): Promise<void> =>
    new Promise((resolve) =>
      setTimeout(() => {
        if (canceled) return resolve();
        const newState: SearchState = {
          problem: {
            nbSteps: currentState.problem.nbSteps - 1,
            circles: getNewState(currentState.problem.circles, newStep),
          },
          steps: currentState.steps.concat({
            step: newStep,
            problem: currentState.problem,
          }),
        };
        if (cacheProblem(newState.problem)) return resolve();
        if (checkSolution(newState.problem)) {
          params.onSolution({
            steps: newState.steps,
            finalState: newState.problem,
          });
          return resolve();
        }
        searchForSolsGivenSteps(newState).then(resolve);
      }, 0)
    );

  const searchForSolsGivenSteps = async (
    currentState: SearchState
  ): Promise<void> => {
    if (currentState.problem.nbSteps === 0) {
      return;
    }
    const circleSubSteps = _.range(nbCircles).flatMap((circleIndex) =>
      _.range(1, nbCells).map(
        (move) => () =>
          checkNewStep({
            currentState,
            newStep: { kind: "circle", move, circleIndex },
            getNewState: circleStep,
          })
      )
    );

    const raySubSteps = _.range(nbRays).flatMap((rayIndex) =>
      _.range(1, nbCircles * 2).map(
        (move) => () =>
          checkNewStep({
            currentState,
            newStep: { kind: "ray", move, rayIndex },
            getNewState: rayStep,
          })
      )
    );
    await Promise.all(circleSubSteps.concat(raySubSteps).map((step) => step()));
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
