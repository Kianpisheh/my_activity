import { useState } from "react";

import "./ExplanationPanel.css";

import ResultsPanel from "./ResultsPanel";
import QuestionPanel from "./QuestionPanel";
import WhyAndWhyNotPanel from "./WhyAndWhyNotPanel";
import HowToPanel from "./HowToPanel";
import RuleitemsPane from "./RuleitemsPane";

import handleInstanceSelection from "./handler";
import { answerQuestion, handleWhyQuery, handleWhyNotQuery } from "./handler";

function ExplanationPanel(props) {
	const [selectedInstancesIdx, setSelectedInstancesIdx] = useState({});
	const [unsatisfiedAxioms, setUnsatisfiedAxioms] = useState({});
	const [highlightedInstancesIdx, setHighlightedInstancesIdx] = useState([]);
	const [fpAxiomStats, setFPAxiomStats] = useState({});
	const [questionType, setQuestionType] = useState("");

	return (
		<div className="explanation-panel-container">
			<div id="res-pan">
				<ResultsPanel
					parentWidth={props.parentWidth}
					onInstanceClick={props.onInstanceClick}
					classificationResult={props.classificationResults}
					selectedInstancesIdx={selectedInstancesIdx}
					newTPs={props.newTPs}
					newFPs={props.newFPs}
					queryMode={props.queryMode}
					onInstanceSelection={(idx, type) => {
						setSelectedInstancesIdx(handleInstanceSelection(idx, type, selectedInstancesIdx));
						props.onActInstanceChange(idx);
					}}
					highlightedInstancesIdx={highlightedInstancesIdx}
				></ResultsPanel>
			</div>
			<div id="quest-pan">
				<QuestionPanel
					classificationResult={props.classificationResults}
					predictedActivities={props.predictedActivities}
					selectedInstancesIdx={selectedInstancesIdx}
					currentActInstanceIdx={props.currentActInstanceIdx}
					actInstances={props.actInstances}
					onQuery={(queryType) => {
						if (queryType === "FP") {
							const whyHowToSuggestions = handleWhyQuery(
								props.actInstances,
								props.currentActivity,
								selectedInstancesIdx,
								props.classificationResults
							);
							props.onWhyHowToSuggestions(whyHowToSuggestions);
						} else if (queryType === "FN") {
							const whyNotHowToSuggestions = handleWhyNotQuery(
								props.actInstances,
								props.currentActivity,
								selectedInstancesIdx,
								props.classificationResults
							);
							props.onWhyHowToSuggestions(whyNotHowToSuggestions);
						}
					}}
				></QuestionPanel>
			</div>
			<div id="why-not-pan">
				<WhyAndWhyNotPanel
					axioms={unsatisfiedAxioms}
					axiomStats={fpAxiomStats}
					questionType={questionType}
					currentActivity={props.currentActivity}
					onWhyNotAxiomHover={(indeces) => {
						setHighlightedInstancesIdx(indeces);
					}}
					// onAxiomClick={(indeces, ax) => {
					// 	setWhyNotHowToSuggestion(
					// 		handleWhyNotAxiomClick(props.actInstances, indeces, ax, props.classificationResults["TN"])
					// 	);
					// }}
				></WhyAndWhyNotPanel>
			</div>
			<div id="how-to-pan">
				{/* <HowToPanel
					whyNotHowToSuggestion={whyNotHowToSuggestion}
					onHowToAxiomHover={(newTPs, newFPs) => {
						setNewTPs(newTPs);
						setNewFPs(newFPs);
					}}
				></HowToPanel> */}
			</div>
			{/* <div id="how-to-pan">
                <RuleitemsPane
                    currentActivityInstance={props.actInstances[props.currentActInstanceIdx]}
                    ruleitems={props.ruleitems}
                    onRuleitemRequest={props.onRuleitemRequest}
                    classificationResult={props.classificationResults}
                ></RuleitemsPane>
            </div> */}
		</div>
	);
}

export default ExplanationPanel;
