import React from "react";
import { SolutionStepState } from "../../services/types/solution";
import { ProblemInputCircles } from "../problem-input/problem-input-selector";

type ShowSolutionStepProps = {
  step: SolutionStepState;
};
export const ShowSolutionStep: React.FC<ShowSolutionStepProps> = ({ step }) => {
  return <ProblemInputCircles value={step.problem} size={"med"} />;
};
