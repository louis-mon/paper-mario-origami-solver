import { ProblemInput } from "../../services/types/problem-input";
import React from "react";
import { Solution } from "../../services/types/solution";
import { solveProblem } from "../../services/solver/solve-problem";
import { Box, Grid, makeStyles } from "@material-ui/core";
import { ProblemInputCircles } from "../problem-input/problem-input-selector";
import { SolutionDescription } from "./solution-description";

const useStyle = makeStyles({
  selectedSolution: {
    border: "3px solid cyan",
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
      {time !== null
        ? `Done! ${Math.floor(time / 1000)}.${time % 1000}s`
        : "In progress..."}{" "}
      Available solutions:
      <Grid container>
        {solutions.map((sol, i) => (
          <Grid
            item
            xs={4}
            key={i}
            onClick={() => setSelected(i)}
            className={selected === i ? classes.selectedSolution : undefined}
          >
            <ProblemInputCircles value={sol.finalState} size={"small"} />
          </Grid>
        ))}
      </Grid>
      Solution steps:
      {selected !== null ? (
        <SolutionDescription solution={solutions[selected]} />
      ) : null}
    </Box>
  );
};
