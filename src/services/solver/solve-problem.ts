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
  SolutionStepState,
} from "../types/solution";

export type SolveProblemParams = {
  problem: ProblemInput;
  onSolution: (solution: Solution) => void;
  onFinish: () => void;
};

export const solveProblem = (params: SolveProblemParams) => {
  const nbCircles = params.problem.circles.length;
  const nbCells = params.problem.circles[0].length;
  const blockSize = 2;

  type SearchState = {
    problem: ProblemInput;
    steps: SolutionStepState[];
  };

  let canceled = false;

  const checkSolution = (problem: ProblemInput): boolean => {
    const checkLine =
      (p: (value: TargetInput) => boolean) => (rayIndex: number) =>
        problem.circles.every((circle) => p(circle[rayIndex]));
    const checkLineFull = checkLine((value) => value !== null);
    const checkLineEmpty = checkLine((value) => value === null);
    const checkLineOk = (r: number) => checkLineFull(r) || checkLineEmpty(r);
    const checkBlock = (rayIndex: number) =>
      _.range(nbCircles).every((circleIndex) =>
        _.range(blockSize).every((i) => {
          const value = problem.circles[circleIndex][(i + rayIndex) % nbCells];
          return circleIndex > blockSize ? value === null : value !== null;
        })
      );

    return _.range(nbCells).every(checkLineOk);
  };

  const circleStep = (
    circles: ProblemInputCircles,
    step: SolutionStepCircle
  ): ProblemInputCircles => {
    return circles.map((circle, circleIndex) => {
      if (circleIndex !== step.circleIndex) return circle;
      return _.range(nbCells).map(
        (i) => circle[(i - step.move + nbCells) % nbCells]
      );
    });
  };

  const checkNewStep = async <T extends SolutionStep>({
    currentState,
    newStep,
    getNewState,
  }: {
    currentState: SearchState;
    newStep: T;
    getNewState: (circles: ProblemInputCircles, step: T) => ProblemInputCircles;
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
    const subSteps = _.range(nbCircles).flatMap((circleIndex) =>
      _.range(1, nbCells).map(
        (move) => () =>
          checkNewStep({
            currentState,
            newStep: { kind: "circle", move, circleIndex },
            getNewState: circleStep,
          })
      )
    );
    for (const step of subSteps) {
      await step();
    }
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
