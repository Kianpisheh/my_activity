import AxiomTypes from "../../model/AxiomTypes";

import TimeDistanceAxiomRepr from "./TimeDistanceAxiomRepr";
import DurationAxiomRepr from "./DurationAxiomRepr";
import InteractionAxiomRepr from "./InteractionAxiomRepr";
import QueryTrigger from "../../model/QueryTrigger";

function WhyExplanation(props) {
	const { numInstances, activity } = props;
	const samples = numInstances > 1 ? "samples" : "sample";
	const satisfies = numInstances > 1 ? "satisfies" : "satisfy";


    const axioms = activity.getAxioms()
    let whyAxioms = [];
    let i = 0;
	for (const axiom of axioms) {

        if (props.selectedWhys !== null && props.selectedWhys !== i) {
            i += 1;
            continue;
        }

		let axComp = null;
		if (axiom.getType() === AxiomTypes.TYPE_TIME_DISTANCE) {
			axComp = (
					<TimeDistanceAxiomRepr
						qmenuPos={props.qmenuPos}
						queryTrigger={props.queryTrigger}
						onWhyNotWhatQuery={props.onWhyNotWhatQuery}
						onWhyNotNumHover={props.onWhyNotNumHover}
						numInstances={numInstances}
						unsatisfiedAxioms={null}
						activity={activity}
						axiom={axiom}
                        selectedWhys={props.selectedWhys}
				        onWhySelection={props.onWhySelection}
                        idx={i}
                        expType={QueryTrigger.WHY}
					></TimeDistanceAxiomRepr>
			);
		} else if (axiom.getType() === AxiomTypes.TYPE_DURATION) {
			axComp = (
					<DurationAxiomRepr
						qmenuPos={props.qmenuPos}
						queryTrigger={props.queryTrigger}
						onWhyNotWhatQuery={props.onWhyNotWhatQuery}
						onWhyNotNumHover={props.onWhyNotNumHover}
						numInstances={numInstances}
						activity={activity}
						axiom={axiom}
						unsatisfiedAxioms={null}
                        selectedWhys={props.selectedWhys}
				        onWhySelection={props.onWhySelection}
                        idx={i}
                        expType={QueryTrigger.WHY}
					></DurationAxiomRepr>
			);
		} else if (axiom.getType() === AxiomTypes.TYPE_INTERACTION) {
			axComp = (
					<InteractionAxiomRepr
						qmenuPos={props.qmenuPos}
						queryTrigger={props.queryTrigger}
						onWhyNotWhatQuery={props.onWhyNotWhatQuery}
						onWhyNotNumHover={props.onWhyNotNumHover}
						numInstances={numInstances}
						activity={activity}
						axiom={axiom}
						unsatisfiedAxioms={null}
                        selectedWhys={props.selectedWhys}
				        onWhySelection={props.onWhySelection}
                        idx={i}
                        expType={QueryTrigger.WHY}
					></InteractionAxiomRepr>
			);
		}
		whyAxioms.push(axComp);
        i += 1;
	}


	return (
		<div style={{ width: "90%" }}>
			<span className="text-explanation" style={{ color: "#5F5656", fontSize: 14 }}>
				The selected {samples} {satisfies} all the defined conditions for activity
			</span>
            <span style={{ color: "var(--explanation)", fontWeight: 600, fontSize: 14  }}> {activity.getName()}.</span>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", rowGap: 10, alignItems: "center" }}>
				{whyAxioms}
			</div>
		</div>
	);
}

export default WhyExplanation;
