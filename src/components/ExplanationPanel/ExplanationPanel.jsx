import { useState } from "react";

import "./ExplanationPanel.css";

import ResultsPanel from "./ResultsPanel";
import QuestionPanel from "./QuestionPanel";
import WhyNotPanel from "./WhyNotPanel";

import handleInstanceSelection from "./handler";
import { nonOntologicalWhyNot } from "./handler";

function ExplanationPanel(props) {
    const [selectedInstancesIdx, setSelectedInstancesIdx] = useState({});
    const [unsatisfiedAxioms, setUnsatisfiedAxioms] = useState({});
    const [highlightedInstancesIdx, setHighlightedInstancesIdx] = useState([]);

    return (
        <div className="explanation-panel-container">
            <ResultsPanel
                parentWidth={props.parentWidth}
                onInstanceClick={props.onInstanceClick}
                classificationResult={props.classificationResults}
                selectedInstancesIdx={selectedInstancesIdx}
                onInstanceSelection={(idx, type) => {
                    setSelectedInstancesIdx(
                        handleInstanceSelection(idx, type, selectedInstancesIdx)
                    );
                    props.onActInstanceChange(idx);
                }}
                highlightedInstancesIdx={highlightedInstancesIdx}
            ></ResultsPanel>
            <QuestionPanel
                classificationResult={props.classificationResults}
                predictedActivities={props.predictedActivities}
                selectedInstancesIdx={selectedInstancesIdx}
                currentActInstanceIdx={props.currentActInstanceIdx}
                actInstances={props.actInstances}
                onQuestionAsked={() => {
                    let axioms = nonOntologicalWhyNot(
                        props.actInstances.filter((instance, idx) =>
                            selectedInstancesIdx["FN"].includes(idx)
                        ),
                        selectedInstancesIdx["FN"],
                        props.currentActivity
                    );
                    setUnsatisfiedAxioms(axioms);
                }}
            ></QuestionPanel>
            <WhyNotPanel
                axioms={unsatisfiedAxioms}
                onHoverAxiom={(indeces) => setHighlightedInstancesIdx(indeces)}
            ></WhyNotPanel>
        </div>
    );
}

export default ExplanationPanel;
