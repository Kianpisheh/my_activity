import "./Axiom.css";

import AxiomTypes from "../../model/AxiomTypes";
import InteractionAxiom from "./InteractionAxiom";
import TimeDistanceAxiom from "./TimeDistanceAxiom";
import DurationAxiom from "./DurationAxiom";
import InteractionORAxiom from "./InteractionORAxiom";

import AxiomData from "../../model/AxiomData";
import WhyNotWhatQueryController from "../../Controllers/WhyNotWhatQueryController";

import isEqual from "lodash.isequal";
import { CircleNum } from "../ExplanationPanel/utils";

function Axiom(props) {
	let axiomComponent = null;
	let axiomType = props.data.type;
	if (axiomType === AxiomTypes.TYPE_INTERACTION) {
		axiomComponent = (
			<InteractionAxiom
				data={props.data}
				idx={props.idx}
				config={props.config}
				messageCallback={props.messageCallback}
				explanation={props.explanation}
				unsatisfiedAxioms={props.unsatisfiedAxioms}
				onUnsatisfiedAxiomClick={props.onUnsatisfiedAxiomClick}
                onWhyNotWhatQuery={props.onWhyNotWhatQuery}
                activityInstances={props.activityInstances}
                onWhyNotNumHover={props.onWhyNotNumHover}
			></InteractionAxiom>
		);
	} else if (axiomType === AxiomTypes.TYPE_OR_INTERACTION) {
		axiomComponent = (
			<InteractionORAxiom
				data={props.data}
				idx={props.idx}
				config={props.config}
				messageCallback={props.messageCallback}
				explanation={props.explanation}
				unsatisfiedAxioms={props.unsatisfiedAxioms}
				onUnsatisfiedAxiomClick={props.onUnsatisfiedAxiomClick}
                activityInstances={props.activityInstances}
                onWhyNotNumHover={props.onWhyNotNumHover}
			></InteractionORAxiom>
		);
	} else if (axiomType === AxiomTypes.TYPE_TIME_DISTANCE) {
		axiomComponent = (
			<TimeDistanceAxiom
				idx={props.idx}
				data={props.data}
				config={props.config}
				messageCallback={props.messageCallback}
				explanation={props.explanation}
				unsatisfiedAxioms={props.unsatisfiedAxioms}
				onUnsatisfiedAxiomClick={props.onUnsatisfiedAxiomClick}
                onWhyNotWhatQuery={props.onWhyNotWhatQuery}
                activityInstances={props.activityInstances}
                onWhyNotNumHover={props.onWhyNotNumHover}
			></TimeDistanceAxiom>
		);
	} else if (axiomType === AxiomTypes.TYPE_DURATION) {
		axiomComponent = (
			<DurationAxiom
				idx={props.idx}
				data={props.data}
				config={props.config}
				messageCallback={props.messageCallback}
				explanation={props.explanation}
				unsatisfiedAxioms={props.unsatisfiedAxioms}
				onUnsatisfiedAxiomClick={props.onUnsatisfiedAxiomClick}
                onWhyNotWhatQuery={props.onWhyNotWhatQuery}
                activityInstances={props.activityInstances}
                onWhyNotNumHover={props.onWhyNotNumHover}
			></DurationAxiom>
		);
	}

	return <div className="Axiom">{axiomComponent}</div>;
}

export default Axiom;

export function getWhyNotNum(unsatisfiedAxioms, axiom, onWhyNotWhatQuery, activityInstances, onWhyNotNumHover) {
	let numnum = [];
	for (const [axiomString, selFNIds] of Object.entries(unsatisfiedAxioms)) {
		const ax = AxiomData.axiomFromString(axiomString);
		if (isEqual(ax, axiom)) {
			const instances = activityInstances.filter((inst, idx) => selFNIds.includes(idx));
			numnum = (
				<div
					id="why-not-num-container"
					onMouseOver={() => onWhyNotNumHover(selFNIds)}
					onMouseLeave={() => onWhyNotNumHover([])}
                    onClick={() => {
						const whatExp = WhyNotWhatQueryController.handleWhyNotWhatQuery(axiom, instances);
						onWhyNotWhatQuery(whatExp);
					}}
				>
					{CircleNum(selFNIds.length)}
				</div>
			);
		}
	}
	return numnum;
}
