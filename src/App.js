import { useEffect, useState } from "react";
import {
	explain,
	retrieveActivities,
	retrieveInstances,
	updateDatabase,
	classifyInstance,
} from "./APICalls/activityAPICalls";

import "./App.css";

import AxiomTypes from "./model/AxiomTypes";
import Activity from "./model/Activity";
import ActivityInstance from "./model/ActivityInstance";
import ExplanationManager from "./model/ExplanationManager";

import ActivityAxiomPane from "./components/AxiomPane/ActivityAxiomPane";
import ActivityPane from "./components/ActivityPane/ActivityPane";
import ActivityInstanceVis from "./components/ActivityVis/ActivityInstanceVis";
import ActivityInstancePane from "./components/ActivityInstancePane";
import ActionMenu from "./components/ActionMenu";
import { handleAxiomPaneMessages } from "./Handlers";

function App() {
	const [activities, setActivities] = useState([]);
	const [activityInstances, setActivityInstances] = useState([]);
	const [predictedActivity, setPredictedActivity] = useState("");
	const [currentActivtyIdx, setCurrentActivityIdx] = useState(-1);
	const [currentActInstanceIdx, setCurrentActInstanceIdx] = useState(-1);
	const [scale, setScale] = useState([25, 25]);
	const [action, setAction] = useState({
		required: false,
		x: 0,
		y: 0,
	});
	const [explanation, setExplanations] = useState(null);

	function onAxiomPaneMessage(message, values) {
		if (message === AxiomTypes.MSG_CLASSIFY_CURRENT_INSTANCE) {
			handleActInstanceChange(
				currentActInstanceIdx,
				activityInstances[currentActInstanceIdx].getName()
			);
		} else {
			let newActivities = handleAxiomPaneMessages(
				message,
				values,
				activities,
				currentActivtyIdx,
				currentActivity
			);

			setActivities(
				newActivities, updateLocalAndSourceActivities(message, currentActivity, activityInstances, currentActInstanceIdx)
			);
		}
	}

	let currentActivity = null;
	if (currentActivtyIdx >= 0) {
		currentActivity = activities[currentActivtyIdx];
	}

	function updateLocalAndSourceActivities(message, currentActivity, activityInstances, currentActInstanceIdx) {

		if (message !== AxiomTypes.MSG_ACTIVITY_TITLE_UPDATING) {
			updateDatabase(currentActivity, "update").then(() => {
				handleActInstanceChange(
					currentActInstanceIdx,
					activityInstances[currentActInstanceIdx].getName()
				)
			})
		}

	}

	function handleActivityListChange(message, activityID) {
		if (message === AxiomTypes.MSG_CHANGE_CURRENT_ACTIVITY) {
			setCurrentActivityIdx(activityID);
		} else if (message === AxiomTypes.MSG_ADD_ACTIVITY) {
			let new_activities = [...activities];
			let newID = Activity.getUniqueID(activities);
			let newActivityName = Activity.getUniqueName(
				activities,
				"New_activity"
			);
			new_activities.push(
				new Activity({
					id: newID,
					name: newActivityName,
					events: [],
					constraints: [],
				})
			);
			setActivities(new_activities);
			setCurrentActivityIdx(new_activities.length - 1);
			updateDatabase(new_activities[new_activities.length - 1], "update");
		} else if (message === AxiomTypes.MSG_REMOVE_ACTIVITY) {
			let new_activities = [...activities];
			const activityName = activities[activityID].getName();
			new_activities = new_activities.filter((activity) => {
				return activity.getID() !== activityID;
			});
			setActivities(new_activities);
			setCurrentActivityIdx(new_activities.length - 1);
			updateDatabase(activityName, "remove");
		}
		setExplanations(null);
	}

	function handleActInstanceChange(id, instance) {
		setExplanations(null);
		//classify the selected activity instance
		classifyInstance([instance]).then((data) => {
			setPredictedActivity(data.data[0][0]);
			setCurrentActInstanceIdx(id);
		});
	}

	function handleScaleChange(action, graphIdx) {
		let newScale = [...scale];
		if (action === "zoom_out") {
			if (scale[graphIdx] > 5) {
				newScale[graphIdx] = newScale[graphIdx] - 5;
			}
		} else if (action === "zoom_in") {
			newScale[graphIdx] = newScale[graphIdx] + 5;
		}

		setScale(newScale);
	}

	function handleActionRequest(itemID, x, y) {
		setAction({ required: true, x: x, y: y });
		setCurrentActivityIdx(itemID);
	}

	//-----------------Explanations----------------------//
	function handleExplanationRequest(req) {
		let prom = explain(
			activityInstances[currentActInstanceIdx]["name"],
			activities[currentActivtyIdx]["name"],
			req.toLowerCase()
		);

		prom.then((data) => {
			let explanation = ExplanationManager.getExplanations(data.data);
			let ids = ExplanationManager.getSatisfiedAxiomIds(
				currentActivity.getAxioms(),
				explanation
			);
			setExplanations(explanation);
		});
	}
	//---------------------------------------------------//

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
			let instancesPromise = retrieveInstances();
			instancesPromise.then((data) => {
				let instances = data.data;
				let instanceItems = [];
				instances.forEach((instance) => {
					instanceItems.push(new ActivityInstance(instance));
				});
				setActivityInstances(instanceItems);
			});
		});
	}, []);

	const config = {
		ic_w: 27,
		ic_h: 27,
		rc_h: 6,
		ax_h: 20,
		scale: scale,
		r: 3,
		win_w: 600,
		win_h: 100,
		major_tick: 2,
		minor_tick: 1,
		major_tick_h: 4,
		minor_tick_h: 2.5,
		merge_close: true,
		merge_th: 1.5,
		nonlScale: true,
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

			<div
				className="left-pane-container"
				onClick={() => {
					setAction({ required: false, x: 0, y: 0 });
				}}
			>
				<ActivityInstancePane
					activtiyInstances={activityInstances}
					onSelectedItemChange={handleActInstanceChange}
					currentActivityId={currentActInstanceIdx}
				></ActivityInstancePane>
				<ActivityPane
					activities={activities}
					onActivitiyListChange={handleActivityListChange}
					onAction={handleActionRequest}
					currentActivityIdx={currentActivtyIdx}
				></ActivityPane>
			</div>

			<div
				className="tools-container"
				onClick={() => {
					setAction({ required: false, x: 0, y: 0 });
				}}
			>
				<ActivityInstanceVis
					config={config}
					activity={activityInstances[currentActInstanceIdx]}
					predictedActivity={predictedActivity}
					explanation={explanation}
					onScaleChange={handleScaleChange}
				></ActivityInstanceVis>
				<div className="axiom-pane-container">
					{currentActivity && (
						<ActivityAxiomPane
							activity={currentActivity}
							sendMessage={onAxiomPaneMessage}
							config={config}
							explanation={explanation}
						></ActivityAxiomPane>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
