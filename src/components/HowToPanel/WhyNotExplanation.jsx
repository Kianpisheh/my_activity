import AxiomData from "../../model/AxiomData";
import AxiomTypes from "../../model/AxiomTypes";

import TimeDistanceAxiomRepr from "./TimeDistanceAxiomRepr";
import DurationAxiomRepr from "./DurationAxiomRepr";
import InteractionAxiomRepr from "./InteractionAxiomRepr";

function WhyNotExplanation(props) {
	const { numInstances, activity, unsatisfiedAxioms } = props;
	const samples = numInstances > 1 ? "samples" : "sample";
	const doesDo = numInstances > 1 ? "do" : "does";
	const theyNeed = numInstances > 1 ? "they need" : "it needs";

	let whyNotAxioms = [];
	for (const axString of Object.keys(unsatisfiedAxioms)) {
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
				></DurationAxiomRepr>
			);
		} else if (axiom.getType() === AxiomTypes.TYPE_INTERACTION) {
            axComp = (<InteractionAxiomRepr
					qmenuPos={props.qmenuPos}
					queryTrigger={props.queryTrigger}
					onWhyNotWhatQuery={props.onWhyNotWhatQuery}
					onWhyNotNumHover={props.onWhyNotNumHover}
					numInstances={numInstances}
					activity={activity}
					axiom={axiom}
					unsatisfiedAxioms={unsatisfiedAxioms}
			></InteractionAxiomRepr>)
        }
		whyNotAxioms.push(axComp);
	}

	return (
		<div style={{ width: "90%", display: "flex", flexDirection: "column", alignItems: "center" }}>
			<div>
				<span className="text-explanation" style={{ color: "#5F5656" }}>
					The selected {samples} {doesDo} not satisfy the indicated conditions on the left pane.
				</span>
				<span className="text-explanation" style={{ color: "#5F5656" }}>
					{" "}
					To recognize the selected {samples} correctly as
				</span>
				<span style={{ color: "var(--explanation)", fontWeight: 600 }}> {activity.getName()},</span>
				<span className="text-explanation" style={{ color: "#5F5656" }}>
					{" "}
					{theyNeed} to satisfy
				</span>
				<span style={{ color: "var(--explanation)", fontWeight: 600 }}> all</span>
				<span style={{ color: "#5F5656" }}> the defined conditions on the left pane.</span>
			</div>
			<div style={{ width: "100%", display: "flex", flexDirection: "column", rowGap: 10, alignItems: "center" }}>
				{whyNotAxioms}
			</div>
		</div>
	);
}

export default WhyNotExplanation;
