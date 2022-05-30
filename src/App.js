import { useEffect, useState } from "react";
import { explain, retrieveActivities, retrieveInstances } from "./APICalls/activityAPICalls";

import "./App.css";

import AxiomManager from "./model/AxiomManager";
import AxiomTypes from "./model/AxiomTypes";
import Activity from "./model/Activity";
import ActivityInstanceEvent from "./model/ActivityInstanceEvent";
import ActivityInstance from "./model/ActivityInstance";

import ActivityAxiomPane from "./components/ActivityAxiomPane";
import ActivityPane from "./components/ActivityPane";
import ActivityInstanceVis from "./components/ActivityVis/ActivityInstanceVis";
import ActivityInstancePane from "./components/ActivityInstancePane";

function App() {
	const [activities, setActivities] = useState([]);
	const [activityInstances, setActivityInstances] = useState([]);
	const [currentActivtyIdx, setCurrentActivityIdx] = useState(-1);
	const [currentActInstanceIdx, setCurrentActInstanceIdx] = useState(-1);
	const [scale, setScale] = useState(25);

	function handleAxiomPaneMessages(message, values) {
		if (message === AxiomTypes.MSG_CREATE_NEW_AXIOM) {
			let new_axioms = AxiomManager.createAxiom(
				currentActivity.getAxioms(),
				values
			);
			let newActivities = [...activities];
			newActivities[currentActivtyIdx].updateAxioms(new_axioms);
			setActivities(newActivities);
		} else if (message === AxiomTypes.MSG_AXIOM_CREATION_DONE) {
			let new_axioms = AxiomManager.createAxiom(
				currentActivity.getAxioms(),
				values
			);
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
			newActivities[currentActivtyIdx]["name"] = values["title"];
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
			new_activities.push(
				new Activity({
					id: new_id,
					name: "New activity",
					events: [],
					constraints: [],
				})
			);
			setActivities(new_activities);
			setCurrentActivityIdx(new_activities.length - 1);
			// TODO: update server
		} else if (message === AxiomTypes.MSG_REMOVE_ACTIVITY) {
			let new_activities = [...activities];
			new_activities = new_activities.filter((activity) => {
				return activity.getID() !== activityID;
			});
			setActivities(new_activities);
			setCurrentActivityIdx(new_activities.length - 1);
			// TODO: update server
		}
	}

	function handleActInstanceChange(id, instance) {
		let promise = explain("http://localhost:8082/explainer/explain", instance, "BrushingTeeth", "why_not");
		promise.then((data) => {
			console.log("explanations: ", data.data)
		})
		setCurrentActInstanceIdx(id);
	}

	function handleScaleChange(action) {
		if (action === "zoom_out") {
			if (scale > 7) {
				setScale(scale - 5);
			}
		} else if (action === "zoom_in") {
			setScale(scale + 5);
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

	useEffect(() => {
		let instancesPromise = retrieveInstances(
			"http://localhost:8082/instance"
		);
		instancesPromise.then((data) => {
			let instances = data.data;
			let instanceItems = [];
			instances.forEach((instance) => {
				instanceItems.push(new ActivityInstance(instance));
			});
			setActivityInstances(instanceItems);
		});
	}, []);

	// test activity instance
	const event1 = new ActivityInstanceEvent({
		name: "stove",
		start_time: 0.2,
		end_time: 2,
	});
	const event2 = new ActivityInstanceEvent({
		name: "mug",
		start_time: 7,
		end_time: 8,
	});
	const event3 = new ActivityInstanceEvent({
		name: "pitcher",
		start_time: 8.05,
		end_time: 8.15,
	});
	const event4 = new ActivityInstanceEvent({
		name: "water_bottle",
		start_time: 10,
		end_time: 10.15,
	});
	const event5 = new ActivityInstanceEvent({
		name: "stove_lighter",
		start_time: 10.15,
		end_time: 10.3,
	});
	const event6 = new ActivityInstanceEvent({
		name: "stove",
		start_time: 15.15,
		end_time: 15.9,
	});
	const event7 = new ActivityInstanceEvent({
		name: "tooth_brush",
		start_time: 19.15,
		end_time: 22.9,
	});
	const event8 = new ActivityInstanceEvent({
		name: "stovetop",
		start_time: 27.15,
		end_time: 28.9,
	});
	const activityInstance1 = new ActivityInstance({
		name: "activity1",
		events: [event1, event2, event3, event4, event5, event6, event7, event8],
	});

	const activityInstance2 = new ActivityInstance({
		name: "activity1",
		events: [event1, event2, event6, event7, event8],
	});

	//let activityInstances = [activityInstance1, activityInstance2];

	const config = {
		ic_w: 30,
		ic_h: 30,
		rc_h: 5,
		ax_h: 20,
		scale: scale,
		r: 1,
		win_w: 600,
		win_h: 100,
		major_tick: 2,
		minor_tick: 1,
		major_tick_h: 4,
		minor_tick_h: 2.5,
	};

	console.log(activityInstances);

	return (
		<div className="App">
			<div className="left-pane-container">
				<ActivityInstancePane
					activtiyInstances={activityInstances}
					onSelectedItemChange={handleActInstanceChange}
					currentActivityId={currentActInstanceIdx}
				></ActivityInstancePane>
				<ActivityPane
					activities={activities}
					onActivitiyListChange={handleActivityListChange}
				></ActivityPane>

			</div>
			< div className="tools-container">
				<ActivityInstanceVis
					config={config}
					activity={activityInstances[currentActInstanceIdx]}
					onScaleChange={handleScaleChange}
				></ActivityInstanceVis>
				{currentActivity && (
					<ActivityAxiomPane
						width="400px"
						activity={currentActivity}
						sendMessage={handleAxiomPaneMessages}
					></ActivityAxiomPane>
				)}
			</div>
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
