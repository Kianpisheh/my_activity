import { useEffect, useState } from "react";
import { retrieveActivities } from "./APICalls/activityAPICalls";
import "./App.css";
import AxiomManager from "./model/AxiomManager";
import AxiomTypes from "./model/AxiomTypes";
import ActivityAxiomPane from "./components/ActivityAxiomPane";
import ActivityPane from "./components/ActivityPane";
import Activity from "./model/Activity";

function App() {
	const [activities, setActivities] = useState([]);
	const [currentActivtyId, setCurrentActivityId] = useState(-1);

	function handleAxiomPaneMessages(message, values) {
		if (message === AxiomTypes.MSG_CREATE_NEW_AXIOM) {
			let new_axioms = AxiomManager.createAxiom(currentActivity.getAxioms(), values);
			let new_activitieis = [...activities];
			new_activitieis[currentActivtyId].updateAxioms(new_axioms);
			setActivities(new_activitieis);
		} else if (message === AxiomTypes.MSG_AXIOM_CREATION_DONE) {
			let new_axioms = AxiomManager.createAxiom(currentActivity.getAxioms(), values);
			let new_activitieis = [...activities];
			new_activitieis[currentActivtyId].updateAxioms(new_axioms);
			setActivities(new_activitieis);
		} else if (message === AxiomTypes.MSG_TIME_CONSTRAINT_UPDATED) {
			let new_axioms = AxiomManager.updateTimeConstraint(
				values.id,
				currentActivity.getAxioms(),
				values.time,
				values.type
			);
			let new_activitieis = [...activities];
			new_activitieis[currentActivtyId].updateAxioms(new_axioms);
			setActivities(new_activitieis);
		} else if (message === AxiomTypes.MSG_TIME_CONSTRAINT_STATUS_UPDATED) {
			let new_axioms = AxiomManager.updateTimeConstraintStatus(
				values.id,
				currentActivity.getAxioms(),
				values.active,
				values.type,
				values.time
			);
			let new_activitieis = [...activities];
			new_activitieis[currentActivtyId].updateAxioms(new_axioms);
			setActivities(new_activitieis);
		}
	}

	let currentActivity = null;
	if (currentActivtyId >= 0) {
		currentActivity = activities[currentActivtyId];
	}

	function handleActivitySelection(activityID) {
		setCurrentActivityId(activityID);
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
			<ActivityPane
				activities={activities}
				onActivitiySelection={handleActivitySelection}
			></ActivityPane>
			{currentActivity && (
				<ActivityAxiomPane
					width="400px"
					activity={currentActivity}
					sendMessage={handleAxiomPaneMessages}
				></ActivityAxiomPane>
			)}
		</div>
	);
}

export default App;

// let database_axioms = [
//   { id: 0, events: ["stovetop", "mug"], type: AxiomTypes.TYPE_INTERACTION },
//   {
//     id: 1,
//     events: ["stovetop", "water_bottle"],
//     type: AxiomTypes.TYPE_TIME_DISTANCE,
//     th1: 5,
//     th2: 11,
//   },
//   {
//     id: 2,
//     events: ["stove"],
//     type: AxiomTypes.TYPE_DURATION,
//     th1: 5,
//     th2: 11,
//   },
// ];

// list of activities
