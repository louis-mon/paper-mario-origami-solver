import React from "react";
import { SolutionStepCircle } from "../../services/types/solution";
import {
  circleRadius,
  computeCircleCenter,
} from "../problem-input/show-problem-maths";
import { solutionStepColor, SolutionStepCommon } from "./solution-step-commons";
import { nbCellsOnCircle, nbRays } from "../../services/config";

type Props = {
  step: SolutionStepCircle;
};

export const ShowSolutionStepCircle: React.FC<Props> = ({ step }) => {
  const move = step.move > nbRays ? nbCellsOnCircle - step.move : step.move;
  const start = computeCircleCenter({
    circleIndex: step.circleIndex,
    cellIndex: 0,
  });
  const end = computeCircleCenter({
    circleIndex: step.circleIndex,
    cellIndex: move,
  });

  const radius = circleRadius(step.circleIndex);
  return (
    <>
      <SolutionStepCommon move={move} />
      <circle
        strokeWidth={1}
        stroke={"rgba(137,53,150,0.37)"}
        fill="none"
        cx={0}
        cy={0}
        r={radius}
      />
      <path
        strokeWidth={0.3}
        stroke={solutionStepColor}
        fill="none"
        markerEnd="url(#arrow)"
        d={`M ${start.x},${start.y} A ${radius} ${radius} 0 0 1 ${end.x},${end.y}`}
      />
    </>
  );
};
