import React from "react";

export const solutionStepColor = "#FF4500";

export const SolutionStepCommon: React.FC<{ move: number }> = ({ move }) => {
  return (
    <>
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="3"
          markerHeight="3"
          orient="auto-start-reverse"
          fill={solutionStepColor}
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      <text
        x={0}
        y={0}
        fontSize={3}
        fill={solutionStepColor}
        textAnchor="middle"
        dominantBaseline={"middle"}
      >
        {move}
      </text>
    </>
  );
};
