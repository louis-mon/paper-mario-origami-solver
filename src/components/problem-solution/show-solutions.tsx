import { ProblemInput } from "../../services/types/problem-input";
import React from "react";
import { Solution } from "../../services/types/solution";
import { solveProblem } from "../../services/solver/solve-problem";
import {
  Box,
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
  makeStyles,
} from "@material-ui/core";
import { ProblemInputCircles } from "../problem-input/problem-input-selector";
import { SolutionDescription } from "./solution-description";
import { Functions, Star } from "@material-ui/icons";

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

type SolutionWithId = Solution & { id: number };

const sortSolutions = (sols: SolutionWithId[]): SolutionWithId[] =>
  sols.slice().sort((a, b) => a.totalMove - b.totalMove);

export const ShowSolutions: React.FC<{ problem: ProblemInput }> = ({
  problem,
}) => {
  const classes = useStyle();
  const [solutions, addSolution] = React.useReducer(
    (state: SolutionWithId[], newSol: Solution) =>
      sortSolutions(state.concat({ ...newSol, id: state.length })),
    []
  );
  const [time, setTime] = React.useState<number | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);

  const selectBest = () => setSelected(solutions[0].id);

  React.useEffect(() => {
    if (selected === null && solutions.length > 0) selectBest();
  }, [selected, solutions]);

  React.useEffect(() => {
    const now = Date.now();
    const { cancel } = solveProblem({
      problem,
      onSolution: (sol) => {
        addSolution(sol);
      },
      onFinish: () => setTime(Date.now() - now),
    });
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box width={"100%"}>
      <Box
        display="flex"
        justifyContent="space-between"
        margin={1}
        alignItems={"center"}
      >
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
        <Button
          variant={"contained"}
          disabled={solutions.length === 0}
          onClick={selectBest}
        >
          <Star />
          Best
        </Button>
        Found {solutions.length} solutions
      </Box>
      <ImageList className={classes.imageList} cols={3} rowHeight={"auto"}>
        {solutions.map((sol) => (
          <ImageListItem key={sol.id} onClick={() => setSelected(sol.id)}>
            <Box
              className={
                selected === sol.id
                  ? classes.selectedSolution
                  : classes.notSelectedSolution
              }
              marginY={1}
              padding={0.5}
            >
              <Box
                position={"absolute"}
                display={"flex"}
                alignItems={"center"}
                color={"rgba(246,215,24,0.85)"}
                fontSize={"0.8em"}
              >
                <Functions fontSize={"inherit"} />
                {sol.totalMove}
              </Box>
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
