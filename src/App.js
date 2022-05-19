import { useState } from "react";
import "./App.css";
import ActivityAxiomPane from "./components/ActivityAxiomPane";
import AxiomManager from "./AxiomManager";
import AxiomTypes from "./AxiomTypes";

function App() {
  let database_axioms = [
    { id: 0, events: ["stovetop", "mug"], type: AxiomTypes.TYPE_INTERACTION },
    {
      id: 1,
      events: ["stovetop", "water_bottle"],
      type: AxiomTypes.TYPE_TIME_DISTANCE,
      th1: 5,
      th2: 11,
    },
    {
      id: 2,
      events: ["stove"],
      type: AxiomTypes.TYPE_DURATION,
      th1: 5,
      th2: 11,
    },
  ];

  const [axioms, setAxioms] = useState(database_axioms);
  const [nextId, setNextId] = useState(database_axioms.length);

  function handleAxiomPaneMessages(message, values) {
    if (message === AxiomTypes.MSG_CREATE_NEW_AXIOM) {
      let new_axioms = AxiomManager.createAxiom(nextId, axioms, values);
      setNextId(nextId + 1);
      setAxioms(new_axioms);
    } else if (message === AxiomTypes.MSG_AXIOM_CREATION_DONE) {
      let new_axioms = AxiomManager.createAxiom(nextId, axioms, values);
      setNextId(nextId + 1);
      setAxioms(new_axioms);
    } else if (message === AxiomTypes.MSG_TIME_CONSTRAINT_UPDATED) {
      let new_axioms = AxiomManager.updateTimeConstraint(
        values.id,
        axioms,
        values.time,
        values.type
      );
      setAxioms(new_axioms);
    } else if (message === AxiomTypes.MSG_TIME_CONSTRAINT_STATUS_UPDATED) {
      console.log("first");
      let new_axioms = AxiomManager.updateTimeConstraintStatus(
        values.id,
        axioms,
        values.active,
        values.type,
        values.time
      );
      console.log(new_axioms);
      setAxioms(new_axioms);
    }
  }

  return (
    <div className="App">
      <ActivityAxiomPane
        width="400px"
        axioms={axioms}
        sendMessage={handleAxiomPaneMessages}
      ></ActivityAxiomPane>
    </div>
  );
}

export default App;

// list of activities
