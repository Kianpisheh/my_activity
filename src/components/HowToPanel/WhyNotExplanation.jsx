import AxiomData from "../../model/AxiomData";
import AxiomTypes from "../../model/AxiomTypes";

import QueryTrigger from "../../model/QueryTrigger";

import TimeDistanceAxiomRepr from "./TimeDistanceAxiomRepr";
import DurationAxiomRepr from "./DurationAxiomRepr";
import InteractionAxiomRepr from "./InteractionAxiomRepr";
import isEqual from "lodash.isequal";
import ExpStatus from "../../model/ExpStatus";

function WhyNotExplanation(props) {
	const { numInstances, activity, unsatisfiedAxioms, queriedAxiom, explanationStatus } = props;
	const samples = numInstances > 1 ? "samples" : "sample";
	const doesDo = numInstances > 1 ? "do" : "does";
	const satisfy = numInstances > 1 ? "satisfy" : "satisfies";

	let whyNotAxioms = [];
	let i = 0;
	for (const axString of Object.keys(unsatisfiedAxioms)) {
		let axComp = null;
		const axiom = AxiomData.axiomFromString(axString);
		if (
			queriedAxiom !== null &&
			(explanationStatus === ExpStatus.WHY_WHY_NOT_LIST || explanationStatus === ExpStatus.WHY_NOT_HOW_TO_LIST) &&
			!isEqual(axiom, queriedAxiom)
		) {
			continue;
		}
		if (axiom.getType() === AxiomTypes.TYPE_TIME_DISTANCE) {
			axComp = (
				<TimeDistanceAxiomRepr
					queryTrigger={props.queryTrigger}
					onWhyNotWhatQuery={props.onWhyNotWhatQuery}
					onWhyNotNumHover={props.onWhyNotNumHover}
					numInstances={numInstances}
					unsatisfiedAxioms={unsatisfiedAxioms}
					onWhyHover={props.onWhyHover}
					activity={activity}
					axiom={axiom}
					idx={i}
					expType={QueryTrigger.WHY_NOT}
					onWhyNotAxiomClick={props.onWhyNotAxiomClick}
				></TimeDistanceAxiomRepr>
			);
		} else if (axiom.getType() === AxiomTypes.TYPE_DURATION) {
			axComp = (
				<DurationAxiomRepr
					queryTrigger={props.queryTrigger}
					onWhyNotWhatQuery={props.onWhyNotWhatQuery}
					onWhyNotNumHover={props.onWhyNotNumHover}
					numInstances={numInstances}
					onWhyHover={props.onWhyHover}
					activity={activity}
					axiom={axiom}
					unsatisfiedAxioms={unsatisfiedAxioms}
					idx={i}
					expType={QueryTrigger.WHY_NOT}
					onWhyNotAxiomClick={props.onWhyNotAxiomClick}
				></DurationAxiomRepr>
			);
		} else if (
			axiom.getType() === AxiomTypes.TYPE_INTERACTION ||
			axiom.getType() === AxiomTypes.TYPE_INTERACTION_NEGATION
		) {
			axComp = (
				<InteractionAxiomRepr
					queryTrigger={props.queryTrigger}
					onWhyNotWhatQuery={props.onWhyNotWhatQuery}
					onWhyNotNumHover={props.onWhyNotNumHover}
					numInstances={numInstances}
					onWhyHover={props.onWhyHover}
					activity={activity}
					axiom={axiom}
					unsatisfiedAxioms={unsatisfiedAxioms}
					idx={i}
					expType={QueryTrigger.WHY_NOT}
					onWhyNotAxiomClick={props.onWhyNotAxiomClick}
				></InteractionAxiomRepr>
			);
		}
		whyNotAxioms.push(axComp);
		i += 1;
	}

	return (
		<div style={{ width: "90%", display: "flex", flexDirection: "column", alignItems: "center" }}>
			<div style={{ marginBottom: 5 }}>
				<span className="text-explanation" style={{ color: "#5F5656", fontSize: 14 }}>
					The selected {samples} {doesDo} not {satisfy} the following defined conditions for
				</span>
				<span style={{ color: "var(--explanation)", fontWeight: 600, fontSize: 14 }}>
					{" "}
					{activity.getName()}
				</span>
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
