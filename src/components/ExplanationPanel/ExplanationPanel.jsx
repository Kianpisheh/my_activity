import { useState } from "react";

import "./ExplanationPanel.css";

import ResultsPanel from "./ResultsPanel";
import QuestionPanel from "./QuestionPanel";

import WhyFPQueryController from "../../Controllers/WhyFPQueryController"
import WhyNotQueryController from "../../Controllers/WhyNotQueryController"
import handleInstanceSelection from "./handler";

function ExplanationPanel(props) {
	const [selectedInstancesIdx, setSelectedInstancesIdx] = useState({});
	const [highlightedInstancesIdx, setHighlightedInstancesIdx] = useState([]);

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
							const whyHowToSuggestions = WhyFPQueryController.handleWhyQuery(
								props.actInstances,
								props.currentActivity,
								selectedInstancesIdx,
								props.classificationResults
							);
							props.onWhyHowToSuggestions(whyHowToSuggestions);
						} else if (queryType === "FN") {
							const unsatisfiedAxioms = WhyNotQueryController.handleWhyNotQuery(
								props.actInstances,
								props.currentActivity,
								selectedInstancesIdx,
								props.classificationResults
							);
							props.onWhyNotExplanations(unsatisfiedAxioms);
							//props.onWhyHowToSuggestions(unsatisfiedAxioms);
						}
					}}
				></QuestionPanel>
			</div>
			{/* <div id="why-not-pan">
				<WhyAndWhyNotPanel
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
			</div> */}
		</div>
	);
}

export default ExplanationPanel;







// eslint-disable-next-line no-lone-blocks
{/* <div id="how-to-pan">
                <RuleitemsPane
                    currentActivityInstance={props.actInstances[props.currentActInstanceIdx]}
                    ruleitems={props.ruleitems}
                    onRuleitemRequest={props.onRuleitemRequest}
                    classificationResult={props.classificationResults}
                ></RuleitemsPane>
            </div> */}