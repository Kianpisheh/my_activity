import AxiomTypes from "../../model/AxiomTypes";

import TimeDistanceAxiomRepr from "./TimeDistanceAxiomRepr";
import DurationAxiomRepr from "./DurationAxiomRepr";
import InteractionAxiomRepr from "./InteractionAxiomRepr";
import InteractionNegationAxiomRepr from "./InteractionNegationAxiomRepr";
import InteractionORAxiomRepr from "./InteractionORAxiomRepr";
import QueryTrigger from "../../model/QueryTrigger";
import isEqual from "lodash.isequal";
import ExpStatus from "../../model/ExpStatus";

function WhyExplanation(props) {
	const { numInstances, activity, queriedAxiom, explanationStatus } = props;
	const samples = numInstances > 1 ? "samples" : "sample";
	const satisfies = numInstances > 1 ? "satisfies" : "satisfy";

	const axioms = activity.getAxioms();
	let whyAxioms = [];
	let i = 0;
	for (const axiom of axioms) {
		if (
			queriedAxiom !== null &&
			(explanationStatus === ExpStatus.WHY_WHY_LIST || explanationStatus === ExpStatus.WHY_HOW_TO_LIST) &&
			!isEqual(axiom, queriedAxiom)
		) {
			continue;
		}

		let axComp = null;
		if (axiom.getType() === AxiomTypes.TYPE_TIME_DISTANCE) {
			axComp = (
				<TimeDistanceAxiomRepr
					queryTrigger={props.queryTrigger}
					onWhyNotWhatQuery={props.onWhyNotWhatQuery}
					numInstances={numInstances}
					unsatisfiedAxioms={null}
					activity={activity}
					axiom={axiom}
					onWhyHover={props.onWhyHover}
					selectedWhys={props.selectedWhys}
					onWhySelection={props.onWhySelection}
					idx={i}
					expType={QueryTrigger.WHY}
				></TimeDistanceAxiomRepr>
			);
		} else if (axiom.getType() === AxiomTypes.TYPE_DURATION) {
			axComp = (
				<DurationAxiomRepr
					queryTrigger={props.queryTrigger}
					onWhyNotWhatQuery={props.onWhyNotWhatQuery}
					numInstances={numInstances}
					activity={activity}
					axiom={axiom}
					unsatisfiedAxioms={null}
					onWhyHover={props.onWhyHover}
					selectedWhys={props.selectedWhys}
					onWhySelection={props.onWhySelection}
					idx={i}
					expType={QueryTrigger.WHY}
				></DurationAxiomRepr>
			);
		} else if (axiom.getType() === AxiomTypes.TYPE_INTERACTION) {
			axComp = (
				<InteractionAxiomRepr
					queryTrigger={props.queryTrigger}
					onWhyNotWhatQuery={props.onWhyNotWhatQuery}
					numInstances={numInstances}
					activity={activity}
					axiom={axiom}
					onWhyHover={props.onWhyHover}
					unsatisfiedAxioms={null}
					selectedWhys={props.selectedWhys}
					onWhySelection={props.onWhySelection}
					idx={i}
					expType={QueryTrigger.WHY}
				></InteractionAxiomRepr>
			);
		} else if (axiom.getType() === AxiomTypes.TYPE_INTERACTION_NEGATION) {
			axComp = (
				<InteractionNegationAxiomRepr
					queryTrigger={props.queryTrigger}
					onWhyNotWhatQuery={props.onWhyNotWhatQuery}
					numInstances={numInstances}
					activity={activity}
					axiom={axiom}
					onWhyHover={props.onWhyHover}
					unsatisfiedAxioms={null}
					selectedWhys={props.selectedWhys}
					onWhySelection={props.onWhySelection}
					idx={i}
					expType={QueryTrigger.WHY}
				></InteractionNegationAxiomRepr>
			);
		} else if (axiom.getType() === AxiomTypes.TYPE_OR_INTERACTION) {
			axComp = (
				<InteractionORAxiomRepr
					queryTrigger={props.queryTrigger}
					onWhyNotWhatQuery={props.onWhyNotWhatQuery}
					numInstances={numInstances}
					onWhyHover={props.onWhyHover}
					activity={activity}
					axiom={axiom}
					unsatisfiedAxioms={null}
					idx={i}
					expType={QueryTrigger.WHY_NOT}
					onWhyNotAxiomClick={props.onWhyNotAxiomClick}
				></InteractionORAxiomRepr>
			);
		}
		whyAxioms.push(axComp);
		i += 1;
	}

	return (
		<div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
			<div style={{ marginBottom: 10 }}>
				<span className="text-explanation" style={{ color: "#5F5656", fontSize: 14, paddingBottom: 15 }}>
					The selected {samples} {satisfies} all the defined conditions for activity
				</span>
				<span style={{ color: "var(--explanation)", fontWeight: 600, fontSize: 14 }}>
					{" "}
					{activity.getName()}.
				</span>
			</div>
			<div style={{ width: "100%", display: "flex", flexDirection: "column", rowGap: 10, alignItems: "center" }}>
				{whyAxioms}
			</div>
		</div>
	);
}

export default WhyExplanation;
