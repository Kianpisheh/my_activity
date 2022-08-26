import AxiomData from "../../model/AxiomData";
import AxiomTypes from "../../model/AxiomTypes";

import QueryTrigger from "../../model/QueryTrigger";

import TimeDistanceAxiomRepr from "./TimeDistanceAxiomRepr";
import DurationAxiomRepr from "./DurationAxiomRepr";
import InteractionAxiomRepr from "./InteractionAxiomRepr";

function WhyNotExplanation(props) {
	const { numInstances, activity, unsatisfiedAxioms } = props;
	const samples = numInstances > 1 ? "samples" : "sample";
	const doesDo = numInstances > 1 ? "do" : "does";
	const satisfy = numInstances > 1 ? "satisfy" : "satisfies";

	let whyNotAxioms = [];
    let i = 0;
	for (const axString of Object.keys(unsatisfiedAxioms)) {

        if (props.selectedWhys !== null && props.selectedWhys !== i) {
            i += 1;
            continue;
        }

		let axComp = null;
		const axiom = AxiomData.axiomFromString(axString);
		if (axiom.getType() === AxiomTypes.TYPE_TIME_DISTANCE) {
			axComp = (
					<TimeDistanceAxiomRepr
						qmenuPos={props.qmenuPos}
						queryTrigger={props.queryTrigger}
						onWhyNotWhatQuery={props.onWhyNotWhatQuery}
						onWhyNotNumHover={props.onWhyNotNumHover}
						numInstances={numInstances}
						unsatisfiedAxioms={unsatisfiedAxioms}
						activity={activity}
						axiom={axiom}
                        selectedWhys={props.selectedWhys}
				        onWhySelection={props.onWhySelection}
                        idx={i}
                        expType={QueryTrigger.WHY_NOT}
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
						unsatisfiedAxioms={unsatisfiedAxioms}
                        selectedWhys={props.selectedWhys}
				        onWhySelection={props.onWhySelection}
                        idx={i}
                        expType={QueryTrigger.WHY_NOT}
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
						unsatisfiedAxioms={unsatisfiedAxioms}
                        selectedWhys={props.selectedWhys}
				        onWhySelection={props.onWhySelection}
                        idx={i}
                        expType={QueryTrigger.WHY_NOT}
					></InteractionAxiomRepr>
			);
		}
		whyNotAxioms.push(axComp);
        i += 1;
	}

	return (
		<div style={{ width: "90%", display: "flex", flexDirection: "column", alignItems: "center" }}>
			<div style={{marginBottom: 5}}>
				<span className="text-explanation" style={{ color: "#5F5656", fontSize: 14 }}>
					The selected {samples} {doesDo} not {satisfy} the following defined conditions for
				</span>
				<span style={{ color: "var(--explanation)", fontWeight: 600, fontSize: 14 }}> {activity.getName()}</span>
				<span className="text-explanation" style={{ color: "#5F5656", fontSize: 14 }}>
					{" "}
					activity.
				</span>
			</div>
			<div style={{ width: "100%", display: "flex", flexDirection: "column", rowGap: 10, alignItems: "center" }}>
				{whyNotAxioms}
			</div>
		</div>
	);
}

export default WhyNotExplanation;
