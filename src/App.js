import React, { useEffect, useState } from "react";
import {
	retrieveActivities,
	retrieveInstances,
	updateDatabase,
	getRuleitems,
	checkPassword,
} from "./APICalls/activityAPICalls";

import { classifyInstances, getClassificationResult } from "./Classification";

import "./App.css";

import AxiomTypes from "./model/AxiomTypes";
import Activity from "./model/Activity";
import ActivityInstance from "./model/ActivityInstance";
import Ruleitem from "./model/RuleitemData";

import ActivityAxiomPane from "./components/AxiomPane/ActivityAxiomPane";
import ActivityPane from "./components/ActivityPane/ActivityPane";
import ActivityInstanceVis from "./components/ActivityVis/ActivityInstanceVis";
import ActivityInstancePane from "./components/ActivityInstancePane";
import Login from "./components/Login";

import { handleAxiomPaneMessages } from "./Handlers";
import HowToPanel2 from "./components/HowToPanel/HowToPanel2";
import QuestionMenu, { QueryQuestion } from "./components/QuestionMenu/QuestionMenu";
import WhyNotHowToQueryController from "./Controllers/WhyNotHowToQueryController";
import WhyNotQueryController from "./Controllers/WhyNotQueryController";
import WhyFPQueryController from "./Controllers/WhyFPQueryController";
import WhyNotWhatQueryController from "./Controllers/WhyNotWhatQueryController";
import WhyWhatQueryController from "./Controllers/WhyWhatQueryController";
import WhyHowToQueryController from "./Controllers/WhyHowToQueryController";
import ResultsPanel from "./components/ResultsPanel/ResultsPanel";

import EventStat from "./model/EventStat";

import handleInstanceSelection from "./components/ResultsPanel/handler";
import QueryTrigger from "./model/QueryTrigger";

function App() {
	const [activities, setActivities] = useState([]);
	const [activityInstances, setActivityInstances] = useState([]);
	const [predictedActivities, setPredictedActivities] = useState([]);
	const [currentActivtyIdx, setCurrentActivityIdx] = useState(-1);
	const [ruleitems, setRuleitems] = useState({});
	const [currentActInstanceIdx, setCurrentActInstanceIdx] = useState(-1);
	const [whyHowToSuggestions, setWhyHowToSuggestions] = useState([]);
	const [whyNotHowToSuggestions, setWhyNotHowToSuggestions] = useState([]);
	const [unsatisfiedAxioms, setUnsatisfiedAxioms] = useState({});
	const [scale, setScale] = useState([25, 25]);
	const [newTPs, setNewTPs] = useState({});
	const [newFPs, setNewFPs] = useState({});
	const [queryMode, setQueryMode] = useState(false);
	const [whyNotWhat, setWhyNotWhat] = useState(null);
	const [whyWhat, setWhyWhat] = useState(null);
	const [selectedInstancesIdx, setSelectedInstancesIdx] = useState({});
	const [highlightedInstancesIdx, setHighlightedInstancesIdx] = useState([]);
	const [whyQueryMode, setWhyQueryMode] = useState(false);
	const [qmenuPos, setQmenuPos] = useState([-1, -1]);
	const [queriedAxiom, setQueriedAxiom] = useState(null);
	const [selectedInstanceEvents, setSelectedInstanceEvents] = useState({});
	const [queryTrigger, setQueryTrigger] = useState("");
	const DATASETS = ["CASAS8", "Opportunity"];
	const [dataset, setDataset] = useState(DATASETS[1]);
	const [enteredUser, setEnteredUser] = useState("");
	const [enteredPass, setEnteredPass] = useState("");
	const [loggedin, setLoggedin] = useState(false);
	const [classificationRes, setClassificationRes] = useState({});

	function onAxiomPaneMessage(message, values) {
		if (message === AxiomTypes.MSG_CLASSIFY_CURRENT_INSTANCE) {
			let instances = [];
			for (let i = 0; i < activityInstances.length; i++) {
				instances.push(activityInstances[i].getName());
			}
			handleActInstanceChange(currentActInstanceIdx, instances);
		} else {
			let newActivities = handleAxiomPaneMessages(
				message,
				values,
				activities,
				currentActivtyIdx,
				currentActivity
			);

			setActivities(
				newActivities,
				handleFunc(message, currentActivity, activityInstances, currentActInstanceIdx)
			);
		}
	}

	function handleFunc(message, currentActivity, activityInstances, currentActInstanceIdx) {
		if (message !== AxiomTypes.MSG_TIME_CONSTRAINT_UPDATED) {
			updateLocalAndSourceActivities(message, currentActivity, activityInstances, currentActInstanceIdx);
		}
	}

	let currentActivity = null;
	if (currentActivtyIdx >= 0) {
		currentActivity = activities[currentActivtyIdx];
	}

	function handleQuery(questionType) {
		if (questionType === QueryQuestion.WHY_NOT) {
			const unsatisfiedAxioms = WhyNotQueryController.handleWhyNotQuery(
				activityInstances,
				currentActivity,
				selectedInstancesIdx,
				classificationRes
			);
			setUnsatisfiedAxioms(unsatisfiedAxioms);
			setQmenuPos([-1, -1]);
		} else if (questionType === QueryQuestion.WHY) {
			const qMode = WhyFPQueryController.handleWhyQuery(queryMode);
			setWhyQueryMode(qMode);
			setQmenuPos([-1, -1]);
		} else if (questionType === QueryQuestion.WHY_NOT_WHAT) {
			const FNInstances = activityInstances.filter((instance, idx) => selectedInstancesIdx["FN"].includes(idx));
			const whatExp = WhyNotWhatQueryController.handleWhyNotWhatQuery(queriedAxiom, FNInstances);
			setWhyNotWhat(whatExp);
			setWhyWhat(null);
			setQmenuPos([-1, -1]);
		} else if (questionType === QueryQuestion.WHY_WHAT) {
			const FPInstances = activityInstances.filter((instance, idx) =>
				selectedInstancesIdx?.["FP"]?.includes(idx)
			);
			const whyWhatExp = WhyWhatQueryController.handleWhyWhatQuery(queriedAxiom, FPInstances);
			setWhyWhat(whyWhatExp);
			setWhyNotWhat(null);
			setQmenuPos([-1, -1]);
		} else if (questionType === QueryQuestion.WHY_NOT_HOW_TO) {
			const whyNotHowToSuggestions = WhyNotHowToQueryController.handleWhyNotHowToQuery(
				queriedAxiom,
				currentActivity,
				classificationRes,
				activityInstances,
				selectedInstancesIdx["FN"],
				activities
			);
			setWhyNotHowToSuggestions(whyNotHowToSuggestions);
			setWhyHowToSuggestions([]);
			setQmenuPos([-1, -1]);
		} else if (questionType === QueryQuestion.WHY_HOW_TO) {
			const whyHowToSuggestions = WhyHowToQueryController.handleWhyHowToQuery(
				queriedAxiom,
				currentActivity,
				classificationRes,
				activityInstances,
				selectedInstancesIdx["FP"],
				ruleitems,
				activities
			);
			setWhyHowToSuggestions(whyHowToSuggestions);
			setWhyNotHowToSuggestions([]);
			setQmenuPos([-1, -1]);
		}
	}

	function updateLocalAndSourceActivities(message, currentActivity, activityInstances, currentActInstanceIdx) {
		if (message !== AxiomTypes.MSG_ACTIVITY_TITLE_UPDATING) {
			updateDatabase(currentActivity, "update", dataset).then(() => {
				let instances = [];
				for (let i = 0; i < activityInstances.length; i++) {
					instances.push(activityInstances[i].getName());
				}
				handleActInstanceChange(currentActInstanceIdx, instances);
			});
		}
	}

	function handleActivityListChange(message, activityID) {
		if (message === AxiomTypes.MSG_CHANGE_CURRENT_ACTIVITY) {
			setCurrentActivityIdx(activityID);
		} else if (message === AxiomTypes.MSG_ADD_ACTIVITY) {
			let new_activities = [...activities];
			let newID = Activity.getUniqueID(activities);
			let newActivityName = Activity.getUniqueName(activities, "New_activity");
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
			updateDatabase(new_activities[new_activities.length - 1], "update", dataset);
		} else if (message === AxiomTypes.MSG_REMOVE_ACTIVITY) {
			let new_activities = [...activities];
			const activityName = activities[activityID].getName();
			new_activities = new_activities.filter((activity) => {
				return activity.getID() !== activityID;
			});
			setActivities(new_activities);
			setCurrentActivityIdx(new_activities.length - 1);
			updateDatabase(activities[activityID], "remove", dataset);
		}
	}

	function handleActInstanceChange(id) {
		let PredActs = classifyInstances(activityInstances, activities);
		let res = getClassificationResult(activityInstances, predictedActivities, activities);
		setClassificationRes(res);
		setPredictedActivities(PredActs);
		setCurrentActInstanceIdx(id);
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

	//------------ClassisficationStutus-----------------//
	function handleInstanceClick(idx) {
		setCurrentActInstanceIdx(idx);
	}
	//-------------------------------------------------//

	//--------------Retrieving ruleitems--------------//
	function handleRuleitemRequest(idx) {
		// let prom = getRuleitems();
		// prom.then((data) => {
		// 	let ruleItems = Ruleitem.getitems(data.data);
		// 	setRuleitems(ruleItems);
		// });
	}

	function handleInstanceEventSelection(event, idx) {
		const selectedEvents = Object.keys(selectedInstanceEvents);

		if (selectedEvents.includes(event)) {
			let tmp = { ...selectedInstanceEvents };
			delete tmp[event];
			setSelectedInstanceEvents(tmp);
		} else {
			let temp = { ...selectedInstanceEvents };
			temp[event] = idx;
			setSelectedInstanceEvents(temp);
		}
	}

	// load activities
	useEffect(() => {
		if (loggedin) {
			readDataFromDB(dataset);
		}
	}, [loggedin]);

	function readDataFromDB(dataset) {
		setDataset(dataset);
		let activitiesPromise = retrieveActivities(dataset);
		handleRuleitemRequest();
		activitiesPromise.then((data) => {
			let activities = data.data;
			let activityItems = [];
			activities.forEach((activity) => {
				activityItems.push(new Activity(activity));
			});
			setActivities(activityItems);
			if (activityItems.length) {
				setCurrentActivityIdx(0);
			}
			let instancesPromise = retrieveInstances(dataset);
			instancesPromise.then((data) => {
				let instances = data.data;
				let instanceItems = [];
				instances.forEach((instance) => {
					instanceItems.push(new ActivityInstance(instance));
				});
				setActivityInstances(instanceItems);
				if (instanceItems.length) {
					let PredActs = classifyInstances(activityInstances, activities);
					setPredictedActivities(PredActs);
					setCurrentActInstanceIdx(0);
					let res = getClassificationResult(activityInstances, predictedActivities, activities);
					setClassificationRes(res);
				}
			});
		});
	}

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

	const leftPaneWidth = 250;

	let eventStats = [];
	if (Object.keys(selectedInstanceEvents).length) {
		eventStats = EventStat.getEventInstanceStat(activityInstances, Object.keys(selectedInstanceEvents));
	}

	// no instance is selected
	if (
		(selectedInstancesIdx["FN"] && selectedInstancesIdx["FN"].length === 0) ||
		(selectedInstancesIdx["FP"] && selectedInstancesIdx["FP"].length === 0)
	) {
		if (queryTrigger !== "") {
			setQueryTrigger("");
			setWhyWhat(null);
			setWhyNotWhat(null);
			setWhyHowToSuggestions([]);
			setWhyNotHowToSuggestions([]);
			setUnsatisfiedAxioms({});
			setWhyQueryMode(false);
		}
	}

	function handleSubmit(ev) {
		ev.preventDefault();
		setLoggedin(true);
		// ask server for the pass
		// checkPassword(enteredUser, enteredPass).then((res) => {
		// 	if (res.data) {
		// 		setLoggedin(true);
		// 	}
		// });
	}

	return (
		<div
			className="App"
			onContextMenu={(ev) => {
				ev.preventDefault();
				if (qmenuPos[0] < 0) {
					let queryTrigger = "";
					if (selectedInstancesIdx["FN"] && selectedInstancesIdx["FN"].length > 0) {
						queryTrigger = QueryTrigger.WHY_NOT;
						setQmenuPos([ev.pageX - 300, ev.pageY]);
						setQueryTrigger(queryTrigger);
					} else if (selectedInstancesIdx["FP"] && selectedInstancesIdx["FP"].length > 0) {
						queryTrigger = QueryTrigger.WHY;
						setQmenuPos([ev.pageX - 300, ev.pageY]);
						setQueryTrigger(queryTrigger);
					}
				}
			}}
			onClick={(ev) => {
				if (ev.ctrlKey) {
					setWhyNotHowToSuggestions([]);
					setWhyHowToSuggestions([]);
					setQueryMode(false);
					setQmenuPos([-1, -1]);
					setWhyNotWhat(null);
					setQueryTrigger("");
					setWhyWhat(null);
					setWhyQueryMode(false);
					setSelectedInstancesIdx({});
					setUnsatisfiedAxioms({});
				}
			}}
		>
			{!loggedin && (
				<div id="login">
					<Login
						enteredPass={enteredPass}
						enteredUser={enteredUser}
						onPassChange={(value) => setEnteredPass(value)}
						onUserChange={(value) => setEnteredUser(value)}
						onSubmit={(event) => handleSubmit(event)}
					></Login>
				</div>
			)}
			{loggedin && (
				<React.Fragment>
					{" "}
					{qmenuPos?.[0] > 0 && (
						<div id="question-menu" style={{ left: qmenuPos[0] + 20, top: qmenuPos[1] }}>
							<QuestionMenu
								selectedIdx={selectedInstancesIdx}
								currentActivity={currentActivity}
								onQuery={handleQuery}
								queryTrigger={queryTrigger}
							></QuestionMenu>
						</div>
					)}
					<div id="act-instances-pane">
						<ActivityInstancePane
							activtiyInstances={activityInstances}
							onSelectedItemChange={handleActInstanceChange}
							currentActInstanceIdx={currentActInstanceIdx}
							activities={activities}
							predictedActivities={predictedActivities}
						></ActivityInstancePane>
					</div>
					<div id="act-instance-vis">
						<ActivityInstanceVis
							config={config}
							activity={activityInstances[currentActInstanceIdx]}
							predictedActivities={predictedActivities}
							onScaleChange={handleScaleChange}
							currentActivityIdx={currentActivtyIdx}
							currentActInstanceIdx={currentActInstanceIdx}
							merge={[true, true]}
							onInstanceEventSelection={(ev, idx) => handleInstanceEventSelection(ev, idx)}
							selectedInstanceEvents={selectedInstanceEvents}
						></ActivityInstanceVis>
					</div>
					<div id="activities-pane">
						<ActivityPane
							activities={activities}
							onActivitiyListChange={handleActivityListChange}
							currentActivityIdx={currentActivtyIdx}
							datasets={DATASETS}
							onDatasetChange={(d) => {
								if (d !== dataset) {
									readDataFromDB(d);
								}
							}}
							currentDataset={dataset}
						></ActivityPane>
					</div>
					<div id="axiom-pane">
						{currentActivity && (
							<ActivityAxiomPane
								activity={currentActivity}
								sendMessage={onAxiomPaneMessage}
								config={config}
								unsatisfiedAxioms={unsatisfiedAxioms}
								ruleitems={ruleitems}
								onWhyNotWhatQuery={(x, y, ax, queryTrigger) => {
									setQueriedAxiom(ax);
									setQmenuPos([x, y]);
									setQueryTrigger(queryTrigger);
								}}
								onWhyWhatQuery={(x, y, ax, queryTrigger) => {
									setQueriedAxiom(ax);
									setQmenuPos([x, y]);
									setQueryTrigger(queryTrigger);
								}}
								activityInstances={activityInstances}
								selectedInstancesIdx={selectedInstancesIdx}
								classificationResult={classificationRes[currentActivity?.getName()]}
								onWhyNotNumHover={(indeces) => setHighlightedInstancesIdx(indeces)}
								whyQueryMode={whyQueryMode}
								queryTrigger={queryTrigger}
								qmenuPos={qmenuPos}
							></ActivityAxiomPane>
						)}
					</div>
					<div id="how-to-panel">
						<HowToPanel2
							whyHowTosuggestions={whyHowToSuggestions}
							whyNotHowTosuggestions={whyNotHowToSuggestions}
							width={"100%"}
							onWhyHowToAxiomHover={(newTPs, newFPs, queryMode) => {
								setNewTPs(newTPs);
								setNewFPs(newFPs);
								setQueryMode(queryMode);
							}}
							whyNotWhat={whyNotWhat}
							whyWhat={whyWhat}
							onWhyNotHowTo={(x, y, queryTrigger) => {
								setQmenuPos([x, y]);
								setQueryTrigger(queryTrigger);
							}}
							onWhyHowTo={(x, y, queryTrigger) => {
								setQmenuPos([x, y]);
								setQueryTrigger(queryTrigger);
							}}
							classificationResult={classificationRes[currentActivity?.getName() ?? {}]}
							activity={currentActivity}
							instances={activityInstances}
							selectedInstancesIdx={selectedInstancesIdx}
							onWhyNotNumHover={(indeces) => setHighlightedInstancesIdx(indeces)}
							eventStats={eventStats}
							queryTrigger={queryTrigger}
							qmenuPos={qmenuPos}
							unsatisfiedAxioms={unsatisfiedAxioms}
							whyQueryMode={whyQueryMode}
						></HowToPanel2>
					</div>
					<div id="explanations">
						<ResultsPanel
							parentWidth={leftPaneWidth}
							onInstanceClick={handleInstanceClick}
							classificationResult={classificationRes}
							selectedInstancesIdx={selectedInstancesIdx}
							newTPs={newTPs}
							newFPs={newFPs}
							queryMode={queryMode}
							onInstanceSelection={(idx, type, activity) => {
								let selInstancesIdx = [];
								if (currentActivity && currentActivity.getName() !== activity) {
									for (let i = 0; i < activities.length; i++) {
										if (activities[i].getName() === activity) {
											setCurrentActivityIdx(i);
											setSelectedInstancesIdx({ type: [idx] });
										}
									}
								} else {
									selInstancesIdx = handleInstanceSelection(
										idx,
										type,
										selectedInstancesIdx,
										activity
									);
									setSelectedInstancesIdx(selInstancesIdx);
								}
								handleActInstanceChange(idx);
							}}
							highlightedInstancesIdx={highlightedInstancesIdx}
						></ResultsPanel>
					</div>
				</React.Fragment>
			)}
		</div>
	);
}

export default App;
