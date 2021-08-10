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
};

export const nbMinSteps = 2;
export const nbMaxSteps = 4;
