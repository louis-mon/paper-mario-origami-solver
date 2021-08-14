export type TargetInput = number | null;

export type ProblemInputCircles = TargetInput[][];

export const goalValues = [undefined, "line", "block"] as const;

export type Goal = typeof goalValues[number];

export type MapColorToGoal = Record<number, Goal>;

export type ProblemInput = {
  circles: ProblemInputCircles;
  nbSteps: number;
  goals: MapColorToGoal;
};
