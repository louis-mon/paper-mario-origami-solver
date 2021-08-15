import React from "react";
import { Box, Button, Typography } from "@material-ui/core";
import { Close, Functions } from "@material-ui/icons";
import { BackToSelection, RunComputationIcon, SelectBestIcon } from "../icons";

type HelpPageProps = {
  onClose: () => void;
};

export const HelpPage: React.FC<HelpPageProps> = ({ onClose }) => {
  return (
    <Box width={"100%"} textAlign={"left"}>
      <Box display={"flex"} justifyContent={"flex-end"} m={2}>
        <Button variant={"contained"} onClick={onClose}>
          <Close />
        </Button>
      </Box>
      <Typography variant={"h3"}>How to use</Typography>
      <ol>
        <li>
          Select a number below the wheel to indicate how many moves are
          allowed.
        </li>
        <li>
          Click on the circles on the wheel to indicate where enemies are
          positioned.
        </li>
        <li>
          Click <RunComputationIcon fontSize={"small"} /> to solve the problem.
        </li>
        <li>
          The solutions will appear as they are found. The first found solution
          will be automatically selected, you can scroll horizontally and click
          on another item in the top bar to select another selection. A blue
          rectangle indicates the selected solution. The number at the top left
          next to the
          <Functions fontSize={"small"} /> symbol indicates the total number of
          atomic moves for the solution. The solutions are ordered from best to
          worse, click on <SelectBestIcon fontSize={"small"} /> to directly
          select the best one.
        </li>
        <li>
          Below you can see the detailed steps of what you need to do to
          reproduce the solution. For each step, you can see an arrow to
          indicate the direction of the move and the number at the center in red
          to indicate the amplitude.
        </li>
        <li>
          Click <BackToSelection fontSize={"small"} /> to change the
          configuration of the problem.
        </li>
      </ol>
      <Typography variant={"h4"}>Constraints</Typography>
      <Typography>
        You can change the color of the circle indicating enemies with the color
        selection below the wheel. The algorithm will rank a solution higher
        when enemies of the same color are grouped together.
      </Typography>
      <Typography>
        For each color, you can also indicate if you prefer this color to be
        grouped as a line (for the jump attack) or as a block (for the hammer
        attack).
      </Typography>
      <Typography>
        When a solution validates all constraints, a{" "}
        <SelectBestIcon fontSize={"small"} /> icon is displayed in the top right
        of the solution item in the solutions list.
      </Typography>
    </Box>
  );
};
