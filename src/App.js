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
	const [currentActivtyIdx, setCurrentActivityIdx] = useState(-1);

	function handleAxiomPaneMessages(message, values) {
		if (message === AxiomTypes.MSG_CREATE_NEW_AXIOM) {
			let new_axioms = AxiomManager.createAxiom(currentActivity.getAxioms(), values);
			let newActivities = [...activities];
			newActivities[currentActivtyIdx].updateAxioms(new_axioms);
			setActivities(newActivities);
		} else if (message === AxiomTypes.MSG_AXIOM_CREATION_DONE) {
			let new_axioms = AxiomManager.createAxiom(currentActivity.getAxioms(), values);
			let newActivities = [...activities];
			newActivities[currentActivtyIdx].updateAxioms(new_axioms);
			setActivities(newActivities);
		} else if (message === AxiomTypes.MSG_TIME_CONSTRAINT_UPDATED) {
			let new_axioms = AxiomManager.updateTimeConstraint(
				values.id,
				currentActivity.getAxioms(),
				values.time,
				values.type
			);
			let newActivities = [...activities];
			newActivities[currentActivtyIdx].updateAxioms(new_axioms);
			setActivities(newActivities);
		} else if (message === AxiomTypes.MSG_TIME_CONSTRAINT_STATUS_UPDATED) {
			let new_axioms = AxiomManager.updateTimeConstraintStatus(
				values.id,
				currentActivity.getAxioms(),
				values.active,
				values.type,
				values.time
			);
			let newActivities = [...activities];
			newActivities[currentActivtyIdx].updateAxioms(new_axioms);
			setActivities(newActivities);
		} else if (message === AxiomTypes.MSG_ACTIVITY_TITLE_UPDATED) {
			let newActivities = [...activities];
			newActivities[currentActivtyIdx]['name'] = values["title"];
			console.log("update")
			setActivities(newActivities);
		}
	}

	let currentActivity = null;
	if (currentActivtyIdx >= 0) {
		currentActivity = activities[currentActivtyIdx];
	}

	function handleActivityListChange(message, activityID) {
		if (message === AxiomTypes.MSG_CHANGE_CURRENT_ACTIVITY) {
			setCurrentActivityIdx(activityID);
		} else if (message === AxiomTypes.MSG_ADD_ACTIVITY) {
			let new_activities = [...activities];
			let new_id = Activity.getUniqieID(activities);
			new_activities.push(new Activity({
				id: new_id, name: "New activity", events: ["stove"], constraints: []
			}));
			setActivities(new_activities);
			// TODO: update server
		} else if (message === AxiomTypes.MSG_REMOVE_ACTIVITY) {
			let new_activities = [...activities];
			new_activities = new_activities.filter((activity) => { return activity.getID() !== activityID });
			setActivities(new_activities);
			setCurrentActivityIdx(new_activities.length - 1);
			// TODO: update server
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
			<ActivityPane
				activities={activities}
				onActivitiyListChange={handleActivityListChange}
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
