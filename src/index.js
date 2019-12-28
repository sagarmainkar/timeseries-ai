import React from "react";
import ReactDOM from "react-dom";
import UnivariateStepper from "./components/UnivariateStepper";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <h1>Welcome</h1>
      <UnivariateStepper />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
