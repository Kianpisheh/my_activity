import { useEffect, useState } from "react";
import {
	retrieveActivities,
	retrieveInstances,
	updateDatabase,
	classifyInstance,
	getRuleitems,
} from "./APICalls/activityAPICalls";

import { getClassificationResult } from "./Utils/utils";

import "./App.css";

import AxiomTypes from "./model/AxiomTypes";
import Activity from "./model/Activity";
import ActivityInstance from "./model/ActivityInstance";
import Ruleitem from "./model/RuleitemData";

import ActivityAxiomPane from "./components/AxiomPane/ActivityAxiomPane";
import ActivityPane from "./components/ActivityPane/ActivityPane";
import ActivityInstanceVis from "./components/ActivityVis/ActivityInstanceVis";
import ActivityInstancePane from "./components/ActivityInstancePane";
import ExplanationPanel from "./components/ExplanationPanel/ExplanationPanel";

import { handleAxiomPaneMessages } from "./Handlers";
import HowToPanel2 from "./components/HowToPanel/HowToPanel2";
import QuestionMenu, { QueryQuestion } from "./components/QuestionMenu/QuestionMenu";
import SystemStatus from "./model/SystemMode";
import WhyNotHowToQueryController from "./Controllers/WhyNotHowToQueryController";
import WhyNotQueryController from "./Controllers/WhyNotQueryController";
import WhyFPQueryController from "./Controllers/WhyFPQueryController";
import SystemMode from "./model/SystemMode";
import WhyNotWhatQueryController from "./Controllers/WhyNotWhatQueryController";
import WhyWhatQueryController from "./Controllers/WhyWhatQueryController";
import WhyHowToQueryController from "./Controllers/WhyHowToQueryController";

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
	const [newTPs, setNewTPs] = useState([]);
	const [newFPs, setNewFPs] = useState([]);
	const [queryMode, setQueryMode] = useState(false);
	const [explanation, setExplanations] = useState(null);
	const [whyNotWhat, setWhyNotWhat] = useState(null);
	const [whyWhat, setWhyWhat] = useState(null);
	const [selectedInstancesIdx, setSelectedInstancesIdx] = useState({});
	const [highlightedInstancesIdx, setHighlightedInstancesIdx] = useState([]);
	const [whyQueryMode, setWhyQueryMode] = useState(false);
	const [qmenuPos, setQmenuPos] = useState([-1, -1]);
	const [systemMode, setSystemMode] = useState("");
	const [queriedAxiom, setQueriedAxiom] = useState(null);

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
            setQmenuPos([-1, -1])
		} else if (questionType === QueryQuestion.WHY) {
			const qMode = WhyFPQueryController.handleWhyQuery(queryMode);
			setWhyQueryMode(qMode);
			setSystemMode(SystemMode.FP_SELECTED);
            setQmenuPos([-1, -1])
		} else if (questionType === QueryQuestion.WHY_NOT_AXIOM) {
			const whatExp = WhyNotWhatQueryController.handleWhyNotWhatQuery(queriedAxiom, activityInstances);
			setWhyNotWhat(whatExp);
			setWhyWhat(null);
            setQmenuPos([-1, -1]);
            systemMode(SystemMode.AXIOM_WHY_NOT_QUERY);
		} else if (questionType === QueryQuestion.WHY_AXIOM) {
            const FPInstances = activityInstances.filter((instance, idx) => selectedInstancesIdx?.["FP"]?.includes(idx));
            const whyWhatExp = WhyWhatQueryController.handleWhyWhatQuery(queriedAxiom, FPInstances);
            setWhyWhat(whyWhatExp);
            setWhyNotWhat(null);
            setQmenuPos([-1, -1]);
        } else if (questionType === QueryQuestion.HOW_TO) {
			const whyNotHowToSuggestions = WhyNotHowToQueryController.handleWhyNotHowToQuery(
				queriedAxiom,
				currentActivity,
				classificationRes,
				activityInstances,
				selectedInstancesIdx["FN"]
			);
            setWhyNotHowToSuggestions(whyNotHowToSuggestions);
			setWhyHowToSuggestions([]);
            setQmenuPos([-1, -1]);
		} else if (questionType === QueryQuestion.HOW_NOT_TO) {
            const whyHowToSuggestions = WhyHowToQueryController.handleWhyHowToQuery(
						queriedAxiom,
						currentActivity,
						classificationRes,
						activityInstances,
						selectedInstancesIdx["FP"],
						ruleitems
			);
            setWhyHowToSuggestions(whyHowToSuggestions);
			setWhyNotHowToSuggestions([]);
            setQmenuPos([-1, -1]);
        }
	}

	function updateLocalAndSourceActivities(message, currentActivity, activityInstances, currentActInstanceIdx) {
		if (message !== AxiomTypes.MSG_ACTIVITY_TITLE_UPDATING) {
			updateDatabase(currentActivity, "update").then(() => {
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

	function handleActInstanceChange(id, instancess) {
		setExplanations(null);
		//classify the selected activity instance
		let instances = [];
		for (let i = 0; i < activityInstances.length; i++) {
			instances.push(activityInstances[i].getName());
		}
		classifyInstance(instances).then((data) => {
			setPredictedActivities(data.data);
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

	//------------ClassisficationStutus-----------------//
	function handleInstanceClick(idx) {
		setCurrentActInstanceIdx(idx);
	}
	//-------------------------------------------------//

	//--------------Retrieving ruleitems--------------//
	function handleRuleitemRequest(idx) {
		let prom = getRuleitems();
		prom.then((data) => {
			let ruleItems = Ruleitem.getitems(data.data);
			setRuleitems(ruleItems);
		});
	}

	// load activities
	useEffect(() => {
		let activitiesPromise = retrieveActivities("http://localhost:8082/activity");
		handleRuleitemRequest();
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

	const leftPaneWidth = 250;

	let classificationRes = getClassificationResult(activityInstances, predictedActivities, currentActivity);

	return (
		<div
			className="App"
			onContextMenu={(ev) => {
				ev.preventDefault();
				if (qmenuPos[0] < 0) {
					setQmenuPos([ev.pageX - 300, ev.pageY]);
				}
			}}
			onClick={(ev) => {
                if (ev.ctrlKey) {
                    setWhyNotHowToSuggestions([]);
                    setWhyHowToSuggestions([]);
                    setQueryMode(false);
                    setQmenuPos([-1, -1]);
                    setSystemMode(SystemMode.NOTHING);
                    setWhyNotWhat(null);
                    setWhyWhat(null);
                    setWhyQueryMode(false);
                    setSelectedInstancesIdx({})
                }
            }}     
		    >
			{qmenuPos?.[0] > 0 && (
				<div id="question-menu" style={{ left: qmenuPos[0] + 20, top: qmenuPos[1] }}>
					<QuestionMenu
						selectedIdx={selectedInstancesIdx}
						currentActivity={currentActivity}
						onQuery={handleQuery}
						systemMode={systemMode}
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
					explanation={explanation}
					onScaleChange={handleScaleChange}
					currentActivityIdx={currentActivtyIdx}
					currentActInstanceIdx={currentActInstanceIdx}
					merge={[true, true]}
				></ActivityInstanceVis>
			</div>
			<div id="activities-pane">
				<ActivityPane
					activities={activities}
					onActivitiyListChange={handleActivityListChange}
					currentActivityIdx={currentActivtyIdx}
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
						onWhyNotWhatQuery={(x, y, ax) => {
							setQueriedAxiom(ax);
							setQmenuPos([x, y]);
							setSystemMode(SystemMode.UNSATISFIED_AXIOM);
						}}
                        onWhyWhatQuery={(x, y, ax) => {
							setQueriedAxiom(ax);
							setQmenuPos([x, y]);
							setSystemMode(SystemMode.SATISFIED_AXIOM);
						}}
						activityInstances={activityInstances}
						selectedInstancesIdx={selectedInstancesIdx}
						classificationResult={classificationRes}
						onWhyNotNumHover={(indeces) => setHighlightedInstancesIdx(indeces)}
						whyQueryMode={whyQueryMode}
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
					onWhyNotHowTo={(x, y) => {
                        setSystemMode(SystemMode.AXIOM_HOW_TO)
                        setQmenuPos([x, y]);
					}}
					onWhyHowTo={(x, y) => {
						setSystemMode(SystemMode.AXIOM_HOW_NOT_TO)
                        setQmenuPos([x, y]);
					}}
					classificationResult={classificationRes}
					activity={currentActivity}
					instances={activityInstances}
					selectedInstancesIdx={selectedInstancesIdx}
					onWhyNotNumHover={(indeces) => setHighlightedInstancesIdx(indeces)}
				></HowToPanel2>
			</div>
			<div id="explanations">
				<ExplanationPanel
					classificationResults={classificationRes}
					parentWidth={leftPaneWidth}
					onInstanceClick={handleInstanceClick}
					predictedActivities={predictedActivities}
					currentActInstanceIdx={currentActInstanceIdx}
					currentActivity={currentActivity}
					actInstances={activityInstances}
					onActInstanceChange={handleActInstanceChange}
					ruleItems={ruleitems}
					newTPs={newTPs}
					newFPs={newFPs}
					queryMode={queryMode}
					selectedInstancesIdx={selectedInstancesIdx}
					onRuleitemRequest={handleRuleitemRequest}
					onWhyNotExplanations={(unsatisfiedAxioms) => setUnsatisfiedAxioms(unsatisfiedAxioms)}
					onInstanceSelection={(selectedIdx) => {
						if (selectedIdx?.["FP"]?.length === 0 || selectedIdx?.["FN"]?.length === 0) {
							setSystemMode(SystemMode.NOTHING);
						} else if (Object.keys(selectedIdx)[0] === "FN") {
							setSystemMode(SystemMode.FN_SELECTED);
						} else if (Object.keys(selectedIdx)[0] === "FP") {
							setSystemMode(SystemMode.FP_SELECTED);
						}
						setSelectedInstancesIdx(selectedIdx);
					}}
					highlightedInstancesIdx={highlightedInstancesIdx}
					whyQueryMode={whyQueryMode}
					onWhyExplanation={(qMode) => setWhyQueryMode(qMode)}
				></ExplanationPanel>
			</div>
		</div>
	);
}

export default App;
