import React from "react";
import { SolutionStepRay } from "../../services/types/solution";
import { computeCircleCenter } from "../problem-input/show-problem-maths";
import { nbCircles, nbRays } from "../../services/config";
import { solutionStepColor, SolutionStepCommon } from "./solution-step-commons";

type Props = {
  step: SolutionStepRay;
};

export const ShowSolutionStepRay: React.FC<Props> = ({ step }) => {
  const minMove = step.move > nbCircles ? nbCircles * 2 - step.move : step.move;
  const cellIndex =
    step.move > nbCircles ? step.rayIndex + nbRays : step.rayIndex;
  const start = computeCircleCenter({
    circleIndex: 0,
    cellIndex,
  });
  const end = computeCircleCenter({
    circleIndex: minMove,
    cellIndex,
  });

  return (
    <>
      <SolutionStepCommon move={minMove} />
      <path
        strokeWidth={0.3}
        stroke={solutionStepColor}
        markerEnd="url(#arrow)"
        d={`M ${start.x},${start.y} L ${end.x},${end.y}`}
      />
    </>
  );
};
