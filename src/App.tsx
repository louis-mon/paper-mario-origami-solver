import "./App.css";
import { ProblemInputSelector } from "./components/problem-input/problem-input-selector";
import { useState } from "react";
import { initialProblemInput } from "./services/config";
import { Box, Button } from "@material-ui/core";
import { ShowSolutions } from "./components/problem-solution/show-solutions";

function App() {
  const [problemInput, setProblemInput] = useState(initialProblemInput);
  const [showSols, setShowSols] = useState(false);
  return (
    <div className="App">
      <header className="App-header">
        <Box
          margin={2}
          justifyContent={"space-evenly"}
          width={"100%"}
          display={"flex"}
        >
          {showSols ? (
            <Button variant={"contained"} onClick={() => setShowSols(false)}>
              Back
            </Button>
          ) : (
            <Button variant={"contained"} onClick={() => setShowSols(true)}>
              Compute
            </Button>
          )}
          <Button
            variant={"contained"}
            onClick={() => {
              setProblemInput(initialProblemInput);
              setShowSols(false);
            }}
          >
            Clear
          </Button>
        </Box>
        {showSols ? (
          <ShowSolutions problem={problemInput} />
        ) : (
          <ProblemInputSelector
            value={problemInput}
            onChange={setProblemInput}
          />
        )}
      </header>
    </div>
  );
}

export default App;
