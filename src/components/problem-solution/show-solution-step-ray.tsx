import React from "react";
import { SolutionStepRay } from "../../services/types/solution";
import { computeCircleCenter } from "../problem-input/show-problem-maths";
import { solutionStepColor, SolutionStepCommon } from "./solution-step-commons";

type Props = {
  step: SolutionStepRay;
};

export const ShowSolutionStepRay: React.FC<Props> = ({ step }) => {
  const start = computeCircleCenter({
    circleIndex: -1.3,
    cellIndex: step.rayIndex,
  });
  const end = computeCircleCenter({
    circleIndex: step.move - 1,
    cellIndex: step.rayIndex,
  });

  return (
    <>
      <SolutionStepCommon move={step.move} />
      <path
        strokeWidth={0.3}
        stroke={solutionStepColor}
        markerEnd="url(#arrow)"
        d={`M ${start.x},${start.y} L ${end.x},${end.y}`}
      />
    </>
  );
};
