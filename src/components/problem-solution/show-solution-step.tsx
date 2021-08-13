import React from "react";
import { SolutionStep, SolutionStepState } from "../../services/types/solution";
import { ProblemInputCircles } from "../problem-input/problem-input-selector";
import { ShowSolutionStepCircle } from "./show-solution-step-circle";
import { ShowSolutionStepRay } from "./show-solution-step-ray";

type ShowSolutionStepProps = {
  step: SolutionStepState;
};
export const ShowSolutionStep: React.FC<ShowSolutionStepProps> = ({ step }) => {
  const stepByKind = () => {
    switch (step.step.kind) {
      case "circle":
        return <ShowSolutionStepCircle step={step.step} />;
      case "ray":
        return <ShowSolutionStepRay step={step.step} />;
    }
  };

  return (
    <ProblemInputCircles value={step.problem} size={"med"}>
      {stepByKind()}
    </ProblemInputCircles>
  );
};
