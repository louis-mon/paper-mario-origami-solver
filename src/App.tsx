import "./App.css";
import { ProblemInputSelector } from "./components/problem-input/problem-input-selector";
import { useState } from "react";
import { initialProblemInput } from "./services/config";
import { Box, Button } from "@material-ui/core";
import { ShowSolutions } from "./components/problem-solution/show-solutions";
import { Delete, Help } from "@material-ui/icons";
import { HelpPage } from "./components/help/help-page";
import { BackToSelection, RunComputationIcon } from "./components/icons";

function App() {
  const [problemInput, setProblemInput] = useState(initialProblemInput);
  const [showHelp, setShowHelp] = useState(false);
  const [showSols, setShowSols] = useState(false);

  const mainPage = () => (
    <>
      <Box
        margin={2}
        justifyContent={"space-evenly"}
        width={"100%"}
        display={"flex"}
      >
        {showSols ? (
          <Button variant={"contained"} onClick={() => setShowSols(false)}>
            <BackToSelection />
            Back
          </Button>
        ) : (
          <Button variant={"contained"} onClick={() => setShowSols(true)}>
            <RunComputationIcon />
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
          <Delete />
          Clear
        </Button>
        <Button variant={"contained"} onClick={() => setShowHelp(true)}>
          <Help />
        </Button>
      </Box>
      {showSols ? (
        <ShowSolutions problem={problemInput} />
      ) : (
        <ProblemInputSelector value={problemInput} onChange={setProblemInput} />
      )}
    </>
  );

  return (
    <div className="App">
      <header className="App-header">
        {showHelp ? (
          <HelpPage onClose={() => setShowHelp(false)} />
        ) : (
          mainPage()
        )}
      </header>
    </div>
  );
}

export default App;
