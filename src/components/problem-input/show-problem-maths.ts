import { nbCellsOnCircle } from "../../services/config";

export const centreSpace = 2;

export const circleRadius = (circleIndex: number) =>
  circleIndex + centreSpace + 0.5;

export const computeCircleCenter = ({
  cellIndex,
  circleIndex,
}: {
  cellIndex: number;
  circleIndex: number;
}) => {
  const radius = circleRadius(circleIndex);
  const angle = ((cellIndex + 0.5) / nbCellsOnCircle) * Math.PI * 2;

  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  };
};
