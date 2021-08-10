export type TargetInput = number | null;

export type ProblemInputCircles = TargetInput[][]

export type ProblemInput = {
  circles: ProblemInputCircles;
  nbSteps: number;
};
