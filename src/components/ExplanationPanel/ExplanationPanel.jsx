
import "./ExplanationPanel.css";

import ResultsPanel from "./ResultsPanel";

import WhyFPQueryController from "../../Controllers/WhyFPQueryController"
import WhyNotQueryController from "../../Controllers/WhyNotQueryController"
import handleInstanceSelection from "./handler";

function ExplanationPanel(props) {

	return (
		<div className="explanation-panel-container">
			<div id="res-pan">
				<ResultsPanel
					parentWidth={props.parentWidth}
					onInstanceClick={props.onInstanceClick}
					classificationResult={props.classificationResults}
					selectedInstancesIdx={props.selectedInstancesIdx}
					newTPs={props.newTPs}
					newFPs={props.newFPs}
					queryMode={props.queryMode}
					onInstanceSelection={(idx, type) => {
						const selInstancesIdx = handleInstanceSelection(idx, type, props.selectedInstancesIdx);
						props.onActInstanceChange(idx);
                        props.onInstanceSelection(selInstancesIdx);
					}}
					highlightedInstancesIdx={props.highlightedInstancesIdx}
				></ResultsPanel>
			</div>
		</div>
	);
}

export default ExplanationPanel;