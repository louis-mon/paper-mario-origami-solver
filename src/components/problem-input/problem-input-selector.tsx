import React from "react";
import {
  nbCellsOnCircle,
  nbCircles,
  nbMaxSteps,
  nbMinSteps,
} from "../../services/config";
import _ from "lodash";
import { ProblemInput } from "../../services/types/problem-input";
import { Box, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import { centreSpace, computeCircleCenter } from "./show-problem-maths";

type CellSelectorProps = CircleSelectorProps & {
  cellIndex: number;
};

const CellSelector: React.FC<CellSelectorProps> = ({
  cellIndex,
  circleIndex,
  onChange,
  value,
}) => {
  const { x, y } = computeCircleCenter({ circleIndex, cellIndex });
  const cellValue = value.circles[circleIndex][cellIndex];
  const handleClick = () => {
    onChange &&
      onChange({
        ...value,
        circles: value.circles.map((circle, i) =>
          i === circleIndex
            ? circle.map((cell, j) =>
                j === cellIndex ? (cell === null ? 1 : null) : cell
              )
            : circle
        ),
      });
  };
  return (
    <circle
      onClick={handleClick}
      cx={x}
      cy={y}
      r={0.5}
      fill={cellValue ? "dodgerblue" : "white"}
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
    <Box display={"flex"} alignItems="center" flexDirection={"column"}>
      <ProblemInputCircles {...props} size={"big"} />
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
    </Box>
  );
};
