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
  const [done, setDone] = React.useState(false);
  const [selected, setSelected] = React.useState<number | null>(null);

  React.useEffect(() => {
    solveProblem({
      problem,
      onSolution: (sol) => {
        addSolution(sol);
        if (selected === null) setSelected(0);
      },
      onFinish: () => setDone(true),
    });
  }, []);

  return (
    <Box width={"100%"}>
      {done ? "Done!" : "In progress..."} Available solutions:
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
