import { useEffect, useState } from "react";
import {
	explain,
	retrieveActivities,
	retrieveInstances,
} from "./APICalls/activityAPICalls";

import "./App.css";

import AxiomTypes from "./model/AxiomTypes";
import Activity from "./model/Activity";
import ActivityInstance from "./model/ActivityInstance";
import ExplanationManager from "./model/ExplanationManager";

import ActivityAxiomPane from "./components/ActivityAxiomPane";
import ActivityPane from "./components/ActivityPane";
import ActivityInstanceVis from "./components/ActivityVis/ActivityInstanceVis";
import ActivityInstancePane from "./components/ActivityInstancePane";
import ActionMenu from "./components/ActionMenu";
import { handleAxiomPaneMessages } from "./Handlers";

function App() {
	const [activities, setActivities] = useState([]);
	const [activityInstances, setActivityInstances] = useState([]);
	const [currentActivtyIdx, setCurrentActivityIdx] = useState(-1);
	const [currentActInstanceIdx, setCurrentActInstanceIdx] = useState(-1);
	const [scale, setScale] = useState(25);
	const [action, setAction] = useState({
		required: false,
		x: 0,
		y: 0,
	});

	function onAxiomPaneMessage(message, values) {
		let newActivities = handleAxiomPaneMessages(
			message,
			values,
			activities,
			currentActivtyIdx,
			currentActivity
		);
		setActivities(newActivities);
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

	function handleActionRequest(itemID, x, y) {
		setAction({ required: true, x: x, y: y });
		setCurrentActivityIdx(itemID);
	}

	function handleExplanationRequest(req) {
		const url = "http://localhost:8082/explainer/explain";
		let prom = explain(
			url,
			activityInstances[currentActInstanceIdx]["name"],
			activities[currentActivtyIdx]["name"],
			req.toLowerCase()
		);

		prom.then((data) => {
			let explanations = ExplanationManager.getExplanations(data.data);

		});
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
		let instancesPromise = retrieveInstances("http://localhost:8082/instance");
		instancesPromise.then((data) => {
			let instances = data.data;
			let instanceItems = [];
			instances.forEach((instance) => {
				instanceItems.push(new ActivityInstance(instance));
			});
			setActivityInstances(instanceItems);
		});
	}, []);

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

	return (
		<div className="App">
			<div
				className="action-menue-container"
				style={{ position: "absolute", left: action.x, top: action.y }}
			>
				{action.required && (
					<ActionMenu
						className="action-menue"
						actions={["Why?", "Why not?"]}
						onExplanationRequest={handleExplanationRequest}
					></ActionMenu>
				)}
			</div>

			<div className="left-pane-container" onClick={() => setAction({ required: false, x: 0, y: 0 })}>
				<ActivityInstancePane
					activtiyInstances={activityInstances}
					onSelectedItemChange={handleActInstanceChange}
					currentActivityId={currentActInstanceIdx}
				></ActivityInstancePane>
				<ActivityPane
					activities={activities}
					onActivitiyListChange={handleActivityListChange}
					onAction={handleActionRequest}
				></ActivityPane>
			</div>

			<div className="tools-container" onClick={() => setAction({ required: false, x: 0, y: 0 })}>
				<ActivityInstanceVis
					config={config}
					activity={activityInstances[currentActInstanceIdx]}
					onScaleChange={handleScaleChange}
				></ActivityInstanceVis>
				<div className="axiom-pane-container">
					{currentActivity && (
						<ActivityAxiomPane
							width="400px"
							activity={currentActivity}
							sendMessage={onAxiomPaneMessage}
						></ActivityAxiomPane>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
