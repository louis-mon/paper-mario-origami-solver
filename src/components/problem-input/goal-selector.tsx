import React from "react";
import { Box, Chip, FormControlLabel, Radio } from "@material-ui/core";
import { defaultGoal, goalConfig } from "../../services/config";
import { goalValues, ProblemInput } from "../../services/types/problem-input";
import { Check } from "@material-ui/icons";

type SelectGoalContextValue = {
  value: number;
  setValue: (value: number) => void;
};

export const SelectGoalContext = React.createContext<SelectGoalContextValue>({
  value: defaultGoal,
  setValue: () => {},
});

export const SelectGoalProvider: React.FC = ({ children }) => {
  const [value, setValue] = React.useState(defaultGoal);
  return (
    <SelectGoalContext.Provider value={{ value, setValue }}>
      {children}
    </SelectGoalContext.Provider>
  );
};

type GoalSelectorProps = {
  value: ProblemInput;
  onChange?: (problemInput: ProblemInput) => void;
};

export const GoalSelector: React.FC<GoalSelectorProps> = ({
  value,
  onChange,
}) => {
  const context = React.useContext(SelectGoalContext);
  return (
    <>
      <Box m={1}>Select group</Box>
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"space-evenly"}
        m={1}
      >
        {goalConfig.map((config, id) => (
          <Chip
            key={id}
            onClick={() => context.setValue(id)}
            label={<Check opacity={id === context.value ? 1 : 0} />}
            clickable
            style={{ backgroundColor: config.color }}
          />
        ))}
      </Box>
      <Box m={1}>Select constraint</Box>
      <Box display={"flex"} justifyContent={"space-evenly"} m={1}>
        {goalValues.map((goal) => (
          <FormControlLabel
            onChange={(_e, checked) =>
              checked &&
              onChange?.({
                ...value,
                goals: { ...value.goals, [context.value]: goal },
              })
            }
            checked={goal === value.goals[context.value]}
            control={<Radio />}
            label={goal || "free"}
            key={goal || "free"}
          />
        ))}
      </Box>
    </>
  );
};
