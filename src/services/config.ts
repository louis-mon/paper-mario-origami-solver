import _ from "lodash";
import { ProblemInput } from "./types/problem-input";

// O is center
export const nbCircles = 4;
export const nbRays = 6;
export const nbCellsOnCircle = nbRays * 2;

export const initialProblemInput: ProblemInput = {
  circles: _.range(nbCircles).map((i) =>
    _.range(nbCellsOnCircle).map((j) => null)
  ),
  nbSteps: 2,
  goals: {},
};

export const nbMinSteps = 1;
export const nbMaxSteps = 4;

type GoalConfig = Array<{ color: string }>;

export const defaultGoal = 0;

export const goalConfig: GoalConfig = [
  { color: "dodgerblue" },
  { color: "PaleVioletRed" },
  { color: "LightSalmon" },
  { color: "gold" },
  { color: "MediumPurple" },
  { color: "Lime" },
];
