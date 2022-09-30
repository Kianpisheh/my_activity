import React, { useEffect, useState } from "react";
import {
	retrieveActivities,
	retrieveInstances,
	updateDatabase,
	getRuleitems,
	checkPassword,
	logEvent,
} from "./APICalls/activityAPICalls";

import { classifyInstances, getClassificationResult } from "./Classification";

import "./App.css";

import AxiomTypes from "./model/AxiomTypes";
import Activity from "./model/Activity";
import ActivityInstance from "./model/ActivityInstance";
import ExpStatus from "./model/ExpStatus";
import Ruleitem from "./model/RuleitemData";

import ActivityAxiomPane from "./components/AxiomPane/ActivityAxiomPane";
import ActivityPane from "./components/ActivityPane/ActivityPane";
import ActivityInstanceVis from "./components/ActivityVis/ActivityInstanceVis";
import ActivityInstancePane from "./components/ActivityInstancePane";
import Login from "./components/Login";
import FloatingQuestions from "./components/HowToPanel/FloatingQuestions";

import { handleAxiomPaneMessages } from "./AxiomPaneHandler";
import HowToPanel2 from "./components/HowToPanel/HowToPanel2";
import WhyNotHowToQueryController from "./Controllers/WhyNotHowToQueryController";
import QueryQuestion from "./model/QueryQuestion";
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
	const DATASETS = ["CASAS8", "Opportunity", "Opportunity_gesture", "Epic", "Task1", "Task2", "Task3", "Task4"];
	const [dataset, setDataset] = useState(DATASETS[1]);
	const [enteredUser, setEnteredUser] = useState("");
	const [enteredPass, setEnteredPass] = useState("");
	const [loggedin, setLoggedin] = useState(false);
	const [classificationRes, setClassificationRes] = useState({});
	const [explanationStatus, setExplanationStatus] = useState(ExpStatus.NONE);
	const [floatingCoords, setFloatingCoords] = useState([-1, -1]);

	function onAxiomPaneMessage(message, values) {
		if (message === AxiomTypes.MSG_CLASSIFY_CURRENT_INSTANCE) {
			let instances = [];
			for (let i = 0; i < activityInstances.length; i++) {
				instances.push(activityInstances[i].getName());
			}
			handleActInstanceChange(currentActInstanceIdx, instances);
		} else if (message === AxiomTypes.MSG_CLOSE_EVENT_STATS) {
			setSelectedInstanceEvents({});
		} else {
			let newActivities = handleAxiomPaneMessages(
				message,
				values,
				activities,
				currentActivtyIdx,
				currentActivity,
				dataset + "-" + enteredUser
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
			let instances = [];
			for (let i = 0; i < activityInstances.length; i++) {
				instances.push(activityInstances[i].getName());
			}
			handleActInstanceChange(currentActInstanceIdx, instances);
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
			logEvent(unsatisfiedAxioms, "explanations", "why_not_explanation", dataset + "-" + enteredUser);
			logEvent(activities, "activities", "activities");
			setUnsatisfiedAxioms(unsatisfiedAxioms);
			setExplanationStatus(ExpStatus.WHY_NOT_LIST);
			setFloatingCoords([-1, -1]);
		} else if (questionType === QueryQuestion.WHY) {
			const qMode = WhyFPQueryController.handleWhyQuery(queryMode);
			setWhyQueryMode(qMode);
			setExplanationStatus(ExpStatus.WHY_LIST);
			setFloatingCoords([-1, -1]);
			logEvent(unsatisfiedAxioms, "explanations", "why_explanation", dataset + "-" + enteredUser);
			logEvent(activities, "activities", "activities", dataset + "-" + enteredUser);
		} else if (questionType === QueryQuestion.WHY_NOT_WHAT) {
			const FNInstances = activityInstances.filter((instance, idx) => selectedInstancesIdx["FN"].includes(idx));
			const whatExp = WhyNotWhatQueryController.handleWhyNotWhatQuery(queriedAxiom, FNInstances);
			setWhyNotWhat(whatExp);
			setWhyWhat(null);
			setFloatingCoords([-1, -1]);
			setExplanationStatus(ExpStatus.WHY_WHY_NOT_LIST);
			logEvent(whatExp, "explanations", "why_not_what_explanation", dataset + "-" + enteredUser);
			logEvent(activities, "activities", "activities", dataset + "-" + enteredUser);
		} else if (questionType === QueryQuestion.WHY_WHAT) {
			const FPInstances = activityInstances.filter((instance, idx) =>
				selectedInstancesIdx?.["FP"]?.includes(idx)
			);
			const whyWhatExp = WhyWhatQueryController.handleWhyWhatQuery(queriedAxiom, FPInstances);
			setWhyWhat(whyWhatExp);
			setWhyNotWhat(null);
			setFloatingCoords([-1, -1]);
			setExplanationStatus(ExpStatus.WHY_WHY_LIST);
			logEvent(setWhyWhat, "explanations", "why_what_explanation", dataset + "-" + enteredUser);
			logEvent(activities, "activities", "activities", dataset + "-" + enteredUser);
		} else if (questionType === QueryQuestion.WHY_NOT_HOW_TO) {
			const whyNotHowToSuggestions = WhyNotHowToQueryController.handleWhyNotHowToQuery(
				queriedAxiom,
				currentActivity,
				classificationRes,
				activityInstances,
				selectedInstancesIdx["FN"],
				activities,
				ruleitems[currentActivity.getName()]
			);
			logEvent(whyNotHowToSuggestions, "explanations", "why_not_how_to_explanation", dataset + "-" + enteredUser);
			logEvent(activities, "activities", "activities", dataset + "-" + enteredUser);
			setWhyNotHowToSuggestions(whyNotHowToSuggestions);
			setWhyHowToSuggestions([]);
			setFloatingCoords([-1, -1]);
			setExplanationStatus(ExpStatus.WHY_NOT_HOW_TO_LIST);
		} else if (questionType === QueryQuestion.WHY_HOW_TO) {
			const whyHowToSuggestions = WhyHowToQueryController.handleWhyHowToQuery(
				queriedAxiom,
				currentActivity,
				classificationRes,
				activityInstances,
				selectedInstancesIdx["FP"],
				ruleitems[currentActivity.getName()],
				activities
			);
			logEvent(whyHowToSuggestions, "explanations", "why_how_to_explanation", dataset + "-" + enteredUser);
			logEvent(activities, "activities", "activities", dataset + "-" + enteredUser);
			setWhyHowToSuggestions(whyHowToSuggestions);
			setWhyNotHowToSuggestions([]);
			setFloatingCoords([-1, -1]);
			setExplanationStatus(ExpStatus.WHY_HOW_TO_LIST);
		}
	}

	function updateLocalAndSourceActivities(message, currentActivity, activityInstances, currentActInstanceIdx) {
		if (message !== AxiomTypes.MSG_ACTIVITY_TITLE_UPDATING) {
			updateDatabase(currentActivity, "update", dataset, enteredUser).then(() => {
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
			logEvent(activities[activityID].getName(), "activity", "activity_change", dataset + "-" + enteredUser);
		} else if (message === AxiomTypes.MSG_ADD_ACTIVITY) {
			let newActivities = [...activities];
			let newID = Activity.getUniqueID(activities);
			let newActivityName = Activity.getUniqueName(activities, "New_activity");
			newActivities.push(
				new Activity({
					id: newID,
					name: newActivityName,
					events: [],
					excludedEvents: [],
					constraints: [],
				})
			);
			logEvent(newActivities[newID].getName(), "activity", "activity_addition", dataset + "-" + enteredUser);
			setActivities(newActivities);
			setCurrentActivityIdx(newActivities.length - 1);
			updateDatabase(newActivities[newActivities.length - 1], "update", dataset);
		} else if (message === AxiomTypes.MSG_REMOVE_ACTIVITY) {
			let newActivities = [...activities];
			newActivities = newActivities.filter((activity) => {
				return activity.getID() !== activityID;
			});
			logEvent(activities[activityID].getName(), "activity", "activity_removal", dataset + "-" + enteredUser);
			setActivities(newActivities);
			setCurrentActivityIdx(newActivities.length - 1);
			updateDatabase(activities[activityID], "remove", dataset);
		}
	}

	function handleActInstanceChange(id) {
		let predActs = classifyInstances(activityInstances, activities);
		let res = getClassificationResult(activityInstances, predActs, activities);
		logEvent(id, "idx", "instance_change", dataset + "-" + enteredUser);
		logEvent(predActs, "predictions", "prediction_result", dataset + "-" + enteredUser);
		logEvent(res, "classification", "classification_result", dataset + "-" + enteredUser);
		logEvent(activities, "activities", "activities", dataset + "-" + enteredUser);
		setClassificationRes(res);
		setPredictedActivities(predActs);
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
	function handleRuleitemRequest(dataset) {
		let prom = getRuleitems(dataset);
		prom.then((data) => {
			let ruleItems = Ruleitem.getitems(data.data);
			setRuleitems(ruleItems);
		}).catch((reason) => {
			console.log("No ruleitems");
		});
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
		let activitiesPromise = retrieveActivities(dataset, enteredUser);
		if (dataset !== "Epic") {
			handleRuleitemRequest(dataset);
		}
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
					let PredActs = classifyInstances(instanceItems, activityItems);
					setCurrentActInstanceIdx(0);
					let res = getClassificationResult(instanceItems, PredActs, activityItems);
					setClassificationRes(res);
					setPredictedActivities(PredActs);
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
		checkPassword(enteredUser, enteredPass).then((res) => {
			if (res.data) {
				setLoggedin(true);
			}
		});
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
			tabIndex="0"
			onKeyDown={(ev) => {
				if (ev.code !== "Escape") {
					return;
				}
				if (explanationStatus === ExpStatus.WHY_NOT_HOW_TO_LIST) {
					setExplanationStatus(ExpStatus.WHY_NOT_LIST);
					setWhyNotWhat(null);
					setWhyWhat(null);
					setWhyNotHowToSuggestions(null);
					setWhyHowToSuggestions(null);
				} else if (explanationStatus === ExpStatus.WHY_HOW_TO_LIST) {
					setExplanationStatus(ExpStatus.WHY_LIST);
					setWhyNotWhat(null);
					setWhyWhat(null);
					setWhyNotHowToSuggestions(null);
					setWhyHowToSuggestions(null);
				} else if (explanationStatus === ExpStatus.WHY_NOT_LIST) {
					setExplanationStatus(ExpStatus.FN_SELECTED);
					setUnsatisfiedAxioms({});
					setWhyNotWhat(null);
					setWhyWhat(null);
					setWhyNotHowToSuggestions(null);
					setWhyHowToSuggestions(null);
				} else if (explanationStatus === ExpStatus.WHY_LIST) {
					setExplanationStatus(ExpStatus.FP_SELECTED);
					setWhyQueryMode(false);
					setWhyNotWhat(null);
					setWhyWhat(null);
					setWhyNotHowToSuggestions(null);
					setWhyHowToSuggestions(null);
				} else if (explanationStatus === ExpStatus.FP_SELECTED || explanationStatus === ExpStatus.FN_SELECTED) {
					setExplanationStatus(ExpStatus.NONE);
					setUnsatisfiedAxioms({});
					setWhyQueryMode(false);
					setWhyNotWhat(null);
					setWhyWhat(null);
					setWhyNotHowToSuggestions(null);
					setWhyHowToSuggestions(null);
					setSelectedInstancesIdx({});
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
					{floatingCoords[0] > 0 && (
						<div id="floating-questions" style={{ left: floatingCoords[0], top: floatingCoords[1] }}>
							<FloatingQuestions
								expStatus={explanationStatus}
								selectedIdx={selectedInstancesIdx}
								currentActivity={currentActivity}
								onQuery={handleQuery}
								queriedAxiom={queriedAxiom}
							></FloatingQuestions>
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
								dataset={dataset}
								sendMessage={onAxiomPaneMessage}
								config={config}
								ruleitems={ruleitems}
								user={enteredUser}
								onWhyNotWhatQuery={(x, y, ax, queryTrigger) => {
									logEvent(ax, "axiom", "queried_axiom_why_not_what", dataset + "-" + enteredUser);
									setQueriedAxiom(ax);
									setQmenuPos([x, y]);
									setQueryTrigger(queryTrigger);
								}}
								onWhyWhatQuery={(x, y, ax, queryTrigger) => {
									logEvent(ax, "axiom", "queried_axiom_why_what", dataset + "-" + enteredUser);
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
								if (queryMode) {
									logEvent(
										{ newTPs: newTPs, newFPs: newFPs },
										"what_if",
										"what_if_explanation",
										dataset + "-" + enteredUser
									);
								}
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
							messageCallback={onAxiomPaneMessage}
							eventStats={eventStats}
							queryTrigger={queryTrigger}
							qmenuPos={qmenuPos}
							expStatus={explanationStatus}
							unsatisfiedAxioms={unsatisfiedAxioms}
							queriedAxiom={queriedAxiom}
							explanationStatus={explanationStatus}
							onWhyNotWhatQuery={(x, y, ax, queryTrigger) => {
								logEvent(ax, "axiom", "queried_axiom_why_not_what", dataset + "-" + enteredUser);
								setQueriedAxiom(ax);
								setQmenuPos([x, y]);
								setQueryTrigger(queryTrigger);
							}}
							onWhyWhatQuery={(x, y, ax, queryTrigger) => {
								logEvent(ax, "axiom", "queried_axiom_why_what", dataset + "-" + enteredUser);
								setQueriedAxiom(ax);
								setQmenuPos([x, y]);
								setQueryTrigger(queryTrigger);
							}}
							whyQueryMode={whyQueryMode}
							selectedIdx={selectedInstancesIdx}
							ruleitems={ruleitems}
							onQuery={handleQuery}
							onWhyHover={(xx, yy, axiom) => {
								if (
									explanationStatus === ExpStatus.WHY_LIST ||
									explanationStatus === ExpStatus.WHY_NOT_LIST
								) {
									setFloatingCoords([xx, yy]);
									if (axiom !== null) {
										logEvent(
											axiom,
											"axiom",
											"queried_axiom_why/why_not",
											dataset + "-" + enteredUser
										);
										setQueriedAxiom(axiom);
									}
								}
							}}
							onWhyWhatHover={(xx, yy, axiom) => {
								setFloatingCoords([xx, yy]);
							}}
							onWhyNotAxiomClick={() => {
								if (explanationStatus !== ExpStatus.WHY_NOT_LIST) {
									setExplanationStatus(ExpStatus.WHY_NOT_LIST);
									setWhyNotWhat(null);
									setWhyWhat(null);
									setWhyNotHowToSuggestions(null);
									setWhyHowToSuggestions(null);
								}
							}}
						></HowToPanel2>
					</div>
					<div id="explanations">
						<ResultsPanel
							parentWidth={leftPaneWidth}
							instances={activityInstances}
							onInstanceClick={handleInstanceClick}
							classificationResult={classificationRes}
							selectedInstancesIdx={selectedInstancesIdx}
							currentActivity={currentActivity}
							newTPs={newTPs}
							newFPs={newFPs}
							queryMode={queryMode}
							onQuery={handleQuery}
							explanationStatus={explanationStatus}
							onInstanceSelection={(idx, type, activity) => {
								logEvent(
									selectedInstancesIdx,
									"old_idx",
									"old_selected_instance",
									dataset + "-" + enteredUser
								);
								let selInstancesIdx = {};
								if (currentActivity && currentActivity.getName() !== activity) {
									for (let i = 0; i < activities.length; i++) {
										if (activities[i].getName() === activity) {
											setCurrentActivityIdx(i);
											if (type === "FN") {
												selInstancesIdx = { FN: [idx] };
											} else {
												selInstancesIdx = { FP: [idx] };
											}
											logEvent(
												selInstancesIdx,
												"current_idx",
												"selected_instance_change",
												dataset + "-" + enteredUser
											);
											setSelectedInstancesIdx(selInstancesIdx);
										}
									}
								} else {
									selInstancesIdx = handleInstanceSelection(
										idx,
										type,
										selectedInstancesIdx,
										activity
									);
									logEvent(
										selInstancesIdx,
										"current_idx",
										"selected_instance_change",
										dataset + "-" + enteredUser
									);
									setSelectedInstancesIdx(selInstancesIdx);
								}

								if (selInstancesIdx[Object.keys(selInstancesIdx)[0]].length !== 0) {
									let queryTrigger = null;
									if (selInstancesIdx["FN"] && selInstancesIdx["FN"].length > 0) {
										setExplanationStatus(ExpStatus.FN_SELECTED);
										queryTrigger = QueryTrigger.WHY_NOT;
									} else if (selInstancesIdx["FP"] && selInstancesIdx["FP"].length > 0) {
										queryTrigger = QueryTrigger.WHY;
										setExplanationStatus(ExpStatus.FP_SELECTED);
									}
									setQueryTrigger(queryTrigger);
								} else {
									setExplanationStatus(ExpStatus.NONE);
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
