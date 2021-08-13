import React from "react";
import { Solution } from "../../services/types/solution";
import { Grid } from "@material-ui/core";
import { ShowSolutionStep } from "./show-solution-step";
import { ProblemInputCircles } from "../problem-input/problem-input-selector";

type SolutionDescriptionProps = {
  solution: Solution;
};
export const SolutionDescription: React.FC<SolutionDescriptionProps> = ({
  solution,
}) => {
  return (
    <Grid container>
      {solution.steps.map((step, i) => (
        <Grid item xs={6} key={i}>
          <ShowSolutionStep step={step} />
        </Grid>
      ))}
      <ProblemInputCircles value={solution.finalState} size={"med"} />
    </Grid>
  );
};
