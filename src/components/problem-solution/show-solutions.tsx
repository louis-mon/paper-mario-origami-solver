import { ProblemInput } from "../../services/types/problem-input";
import React from "react";
import { Solution } from "../../services/types/solution";
import { solveProblem } from "../../services/solver/solve-problem";
import {
  Box,
  CircularProgress,
  ImageList,
  ImageListItem,
  makeStyles,
} from "@material-ui/core";
import { ProblemInputCircles } from "../problem-input/problem-input-selector";
import { SolutionDescription } from "./solution-description";

const useStyle = makeStyles({
  selectedSolution: {
    border: "3px solid cyan",
  },
  notSelectedSolution: {
    border: "3px solid transparent",
  },
  imageList: {
    flexWrap: "nowrap",
    overflowX: "scroll",
  },
});

export const ShowSolutions: React.FC<{ problem: ProblemInput }> = ({
  problem,
}) => {
  const classes = useStyle();
  const [solutions, addSolution] = React.useReducer(
    (state: Solution[], newSol: Solution) => state.concat(newSol),
    []
  );
  const [time, setTime] = React.useState<number | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);

  React.useEffect(() => {
    const now = Date.now();
    const { cancel } = solveProblem({
      problem,
      onSolution: (sol) => {
        addSolution(sol);
        if (selected === null) setSelected(0);
      },
      onFinish: () => setTime(Date.now() - now),
    });
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box width={"100%"}>
      <Box display="flex" justifyContent="space-between" margin={1}>
        <span>
          {time !== null ? (
            `Done! ${Math.floor(time / 1000)}.${time % 1000}s. `
          ) : (
            <>
              <CircularProgress size="1rem" />
              {"In progress... "}
            </>
          )}
        </span>
        Found {solutions.length} solutions
      </Box>
      <ImageList className={classes.imageList} cols={3} rowHeight={"auto"}>
        {solutions.map((sol, i) => (
          <ImageListItem key={i} onClick={() => setSelected(i)}>
            <Box
              className={
                selected === i
                  ? classes.selectedSolution
                  : classes.notSelectedSolution
              }
              marginY={1}
              padding={0.5}
            >
              <ProblemInputCircles value={sol.finalState} size={"small"} />
            </Box>
          </ImageListItem>
        ))}
      </ImageList>
      <Box margin={2}>Solution steps:</Box>
      {selected !== null ? (
        <SolutionDescription solution={solutions[selected]} />
      ) : null}
    </Box>
  );
};
