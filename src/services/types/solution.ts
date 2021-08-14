import { ProblemInput } from "./problem-input";

export type SolutionStepAxis = "ray" | "circle";

export type SolutionStepRay = {
  kind: "ray";
  rayIndex: number;
  // positive number from center to exterior
  move: number;
};

export type SolutionStepCircle = {
  kind: "circle";
  circleIndex: number;
  move: number;
};

export type SolutionStep = SolutionStepRay | SolutionStepCircle;
export type SolutionStepState = {
  step: SolutionStep;
  problem: ProblemInput;
};

export type Solution = {
  steps: SolutionStepState[];
  finalState: ProblemInput;
  totalMove: number
};
