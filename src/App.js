import { useEffect, useState } from "react";
import { retrieveActivities } from "./APICalls/activityAPICalls";
import "./App.css";
import AxiomManager from "./AxiomManager";
import AxiomTypes from "./model/AxiomTypes";
import ActivityAxiomPane from "./components/ActivityAxiomPane";
import ActivityPane from "./components/ActivityPane";
import Activity from "./model/Activity";

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

  const [activities, setActivities] = useState([]);
  const [axioms, setAxioms] = useState(database_axioms);
  const [nextId, setNextId] = useState(database_axioms.length);

  let currentActivity = null;
  activities.forEach((activity) => {
    if (activity.name.equals("BrushingTeeth")) {
      currentActivity = activity;
      return;
    }
  });

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

  // load activities
  useEffect(() => {
    let activitiesPromise = retrieveActivities(
      "http://localhost:8082/activity"
    );
    activitiesPromise.then((data) => {
      let activities = data.data;
      let activityItems = [];
      activities.forEach((activity) => {
        activityItems.push(new Activity(activity));
      });
      setActivities(activityItems);
    });
  }, []);

  return (
    <div className="App">
      <ActivityPane activities={activities}></ActivityPane>
      <ActivityAxiomPane
        width="400px"
        activity={currentActivity}
        sendMessage={handleAxiomPaneMessages}
      ></ActivityAxiomPane>
    </div>
  );
}

export default App;

// list of activities
