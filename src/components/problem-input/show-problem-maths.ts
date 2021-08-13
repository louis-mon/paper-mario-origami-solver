import { nbCellsOnCircle } from "../../services/config";

export const centreSpace = 3;

export const circleRadius = (circleIndex: number) => circleIndex + centreSpace + 0.5

export const computeCircleCenter = ({
  cellIndex,
  circleIndex,
}: {
  cellIndex: number;
  circleIndex: number;
}) => {
  const radius = circleRadius(circleIndex);
  const angle = (cellIndex / nbCellsOnCircle) * Math.PI * 2;

  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  };
};
