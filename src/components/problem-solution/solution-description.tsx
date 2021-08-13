import React from "react";
import { Solution } from "../../services/types/solution";
import { Box, Grid } from "@material-ui/core";
import { ShowSolutionStep } from "./show-solution-step";
import { ProblemInputCircles } from "../problem-input/problem-input-selector";
import { CheckCircle } from "@material-ui/icons";

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
          <Box
            position="absolute"
            border="2px dashed"
            width="1.5em"
            height={"1.5em"}
            borderRadius={"50%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {i + 1}
          </Box>
          <ShowSolutionStep step={step} />
        </Grid>
      ))}
      <Grid item xs={6}>
        <Box
          position="absolute"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          fontSize={"2em"}
        >
          <CheckCircle fontSize={"inherit"} />
        </Box>
        <ProblemInputCircles value={solution.finalState} size={"med"} />
      </Grid>
    </Grid>
  );
};
