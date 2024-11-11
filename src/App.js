import React, { useState } from "react";
import "./App.css";

const functionOrder = [1, 2, 4, 5, 3];

const FunctionCard = ({ id, equation, onChange, nextFunction }) => {
  return (
    <div className="function-card">
      <h3>Function {id}</h3>
      <input
        type="text"
        value={equation}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder="Enter equation"
      />
      <select disabled>
        <option>Next: Function {nextFunction}</option>
      </select>
      <div className="dots">
        <span className="input-dot"></span>
        <span className="output-dot"></span>
      </div>
    </div>
  );
};

function App() {
  const [initialValue, setInitialValue] = useState("");
  const [equations, setEquations] = useState({
    1: "x^2",
    2: "2x+4", // Updated to "2x"
    4: "x-2",
    5: "x/2",
    3: "x^2+20",
  });
  const [output, setOutput] = useState(0);

  const handleInitialValueChange = (e) => {
    setInitialValue(e.target.value);
    calculateChain(e.target.value, equations);
  };

  const handleEquationChange = (id, equation) => {
    const updatedEquations = { ...equations, [id]: equation };
    setEquations(updatedEquations);
    calculateChain(initialValue, updatedEquations);
  };

  const calculateChain = (initialVal, eqs) => {
    let currentValue = parseFloat(initialVal);
    if (isNaN(currentValue)) {
      setOutput("Invalid input");
      return;
    }

    try {
      functionOrder.forEach((fnNum) => {
        const equation = eqs[fnNum];
        currentValue = evaluateEquation(equation, currentValue);
      });
      setOutput(currentValue);
    } catch (error) {
      setOutput("Error in equation");
    }
  };

  const evaluateEquation = (equation, x) => {
    if (!equation || !/^[\d\+\-\*/\^x\s]*$/.test(equation)) return x;

    // Replace "2x" or "3x" etc., with "2*x"
    const formattedEquation = equation
      .replace(/(\d)(x)/g, "$1*$2")
      .replace(/\^/g, "**")
      .replace(/x/g, x);
    return Function(`"use strict"; return (${formattedEquation})`)();
  };

  return (
    <div className="calculator">
      <h1>Function Chain Calculator</h1>
      <div className="initial-input">
        <label>Initial Input (x):</label>
        <input
          type="number"
          value={initialValue}
          onChange={handleInitialValueChange}
          placeholder="Enter initial value"
        />
      </div>
      <div className="function-chain">
        {functionOrder.map((id, index) => (
          <FunctionCard
            key={id}
            id={id}
            equation={equations[id]}
            onChange={handleEquationChange}
            nextFunction={functionOrder[index + 1] || "End"}
          />
        ))}
      </div>
      <div className="output">
        <h2>
          Final Output (y): <span id="output">{output}</span>
        </h2>
      </div>
    </div>
  );
}

export default App;
