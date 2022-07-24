import { useState } from "react";

import "./ExplanationPanel.css";

import ResultsPanel from "./ResultsPanel";
import QuestionPanel from "./QuestionPanel";
import WhyAndWhyNotPanel from "./WhyAndWhyNotPanel";
import HowToPanel from "./HowToPanel";
import RuleitemsPane from "./RuleitemsPane";

import handleInstanceSelection from "./handler";
import { answerQuestion, handleWhyNotAxiomClick, handleWhyQuery } from "./handler";

function ExplanationPanel(props) {
	const [selectedInstancesIdx, setSelectedInstancesIdx] = useState({});
	const [unsatisfiedAxioms, setUnsatisfiedAxioms] = useState({});
	const [highlightedInstancesIdx, setHighlightedInstancesIdx] = useState([]);
	const [whyNotHowToSuggestion, setWhyNotHowToSuggestion] = useState({});
	const [newTPs, setNewTPs] = useState([]);
	const [newFPs, setNewFPs] = useState([]);
	const [fpAxiomStats, setFPAxiomStats] = useState({});
	const [questionType, setQuestionType] = useState("");

	console.log(selectedInstancesIdx);

	return (
		<div className="explanation-panel-container">
			<div id="res-pan">
				<ResultsPanel
					parentWidth={props.parentWidth}
					onInstanceClick={props.onInstanceClick}
					classificationResult={props.classificationResults}
					selectedInstancesIdx={selectedInstancesIdx}
					newTPs={newTPs}
					newFPs={newFPs}
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
					onWhyQuery={() =>
						handleWhyQuery(
							props.actInstances,
							props.currentActivity,
							selectedInstancesIdx,
							props.classificationResults
						)
					}
					onQuestionAsked={(questionType) => {
						const data = answerQuestion(
							questionType,
							props.actInstances,
							props.currentActivity,
							selectedInstancesIdx
						);

						setQuestionType(questionType);
						if (data["dType"] === "axiom_stats") {
							setFPAxiomStats(data["data"]);
						} else if (data["dType"] === "unsatisfied_axioms") {
							setUnsatisfiedAxioms(data["data"]);
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
					onAxiomClick={(indeces, ax) => {
						setWhyNotHowToSuggestion(
							handleWhyNotAxiomClick(props.actInstances, indeces, ax, props.classificationResults["TN"])
						);
					}}
				></WhyAndWhyNotPanel>
			</div>
			<div id="how-to-pan">
				<HowToPanel
					whyNotHowToSuggestion={whyNotHowToSuggestion}
					onHowToAxiomHover={(newTPs, newFPs) => {
						setNewTPs(newTPs);
						setNewFPs(newFPs);
					}}
				></HowToPanel>
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
