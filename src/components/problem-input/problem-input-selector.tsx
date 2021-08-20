import React from "react";
import {
  goalConfig,
  nbCellsOnCircle,
  nbCircles,
  nbMaxSteps,
  nbMinSteps,
} from "../../services/config";
import _ from "lodash";
import { ProblemInput } from "../../services/types/problem-input";
import { Box, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import {
  centreSpace,
  circleRadius,
  computeCircleCenter,
} from "./show-problem-maths";
import {
  GoalSelector,
  SelectGoalContext,
  SelectGoalProvider,
} from "./goal-selector";

type CellSelectorProps = CircleSelectorProps & {
  cellIndex: number;
};

const CellSelector: React.FC<CellSelectorProps> = ({
  cellIndex,
  circleIndex,
  onChange,
  value,
}) => {
  const goalContext = React.useContext(SelectGoalContext);
  const size = 0.5;
  const p0 = computeCircleCenter({
    circleIndex: circleIndex - size,
    cellIndex: cellIndex - size,
  });
  const p1 = computeCircleCenter({
    circleIndex: circleIndex + size,
    cellIndex: cellIndex - size,
  });
  const p2 = computeCircleCenter({
    circleIndex: circleIndex + size,
    cellIndex: cellIndex + size,
  });
  const p3 = computeCircleCenter({
    circleIndex: circleIndex - size,
    cellIndex: cellIndex + size,
  });
  const r1 = circleRadius(circleIndex - size);
  const r2 = circleRadius(circleIndex + size);
  const cellValue = value.circles[circleIndex][cellIndex];
  const handleClick = () => {
    onChange &&
      onChange({
        ...value,
        circles: value.circles.map((circle, i) =>
          i === circleIndex
            ? circle.map((cell, j) =>
                j === cellIndex
                  ? cell === null
                    ? goalContext.value
                    : null
                  : cell
              )
            : circle
        ),
      });
  };
  return (
    <path
      onClick={handleClick}
      fill={cellValue !== null ? goalConfig[cellValue].color : "gainsboro"}
      stroke={"black"}
      strokeWidth={0.07}
      d={`M ${p0.x},${p0.y} L ${p1.x},${p1.y} A ${r2} ${r2} 0 0 1 ${p2.x},${p2.y} L ${p3.x},${p3.y} A ${r1} ${r1} 0 0 0 ${p0.x},${p0.y} Z`}
    />
  );
};

type CircleSelectorProps = ProblemInputSelectorProps & {
  circleIndex: number;
};
const CircleSelector: React.FC<CircleSelectorProps> = (props) => {
  return (
    <>
      {_.range(nbCellsOnCircle).map((j) => (
        <CellSelector {...props} cellIndex={j} key={j} />
      ))}
    </>
  );
};

type ProblemInputCirclesProps = ProblemInputSelectorProps & {
  size: "small" | "med" | "big";
  children?: React.ReactNode;
};

export const ProblemInputCircles: React.FC<ProblemInputCirclesProps> = ({
  children,
  ...props
}) => {
  const viewBoxSide = nbCircles + centreSpace;
  const sizeRatio = { small: 27, med: 46, big: 100 }[props.size];

  return (
    <svg
      width={`${sizeRatio}vw`}
      height={`${sizeRatio}vw`}
      viewBox={`${-viewBoxSide} ${-viewBoxSide} ${viewBoxSide * 2} ${
        viewBoxSide * 2
      }`}
    >
      {_.range(nbCircles).map((i) => (
        <CircleSelector circleIndex={i} {...props} key={i} />
      ))}
      {children}
    </svg>
  );
};

type ProblemInputSelectorProps = {
  value: ProblemInput;
  onChange?: (problemInput: ProblemInput) => void;
};
export const ProblemInputSelector: React.FC<ProblemInputSelectorProps> = (
  props
) => {
  return (
    <SelectGoalProvider>
      <Box display={"flex"} alignItems="center" flexDirection={"column"}>
        <ProblemInputCircles {...props} size={"big"} />
        <Box m={1}>Select number of moves</Box>
        <RadioGroup
          row
          value={props.value.nbSteps}
          onChange={({ target: { value } }) =>
            props.onChange!({ ...props.value, nbSteps: Number.parseInt(value) })
          }
        >
          {_.range(nbMinSteps, nbMaxSteps + 1).map((nbStep) => (
            <FormControlLabel
              key={nbStep}
              value={nbStep}
              control={<Radio />}
              label={nbStep}
            />
          ))}
        </RadioGroup>
        <GoalSelector {...props} />
      </Box>
    </SelectGoalProvider>
  );
};
