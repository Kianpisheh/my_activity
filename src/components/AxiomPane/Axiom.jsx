import "./Axiom.css";

import AxiomTypes from "../../model/AxiomTypes";
import InteractionAxiom from "./InteractionAxiom";
import TimeDistanceAxiom from "./TimeDistanceAxiom";
import DurationAxiom from "./DurationAxiom";
import InteractionORAxiom from "./InteractionORAxiom";

import AxiomData from "../../model/AxiomData";

import isEqual from "lodash.isequal";
import { CircleNum, CircleQMark } from "../ResultsPanel/utils";

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
				onWhyWhatQuery={props.onWhyWhatQuery}
				activityInstances={props.activityInstances}
				onWhyNotNumHover={props.onWhyNotNumHover}
				classificationResult={props.classificationResult}
				activity={props.activity}
				selectedInstancesIdx={props.selectedInstancesIdx}
				onWhyNotHowTo={props.onWhyNotHowTo}
				onWhyHowToQuery={props.onWhyHowToQuery}
				stats={props.whyNotWhat}
				whyQueryMode={props.whyQueryMode}
				ruleitems={props.ruleitems}
                onQuestionMenu={props.onQuestionMenu}
			></InteractionAxiom>
		);
	} else if (axiomType === AxiomTypes.TYPE_OR_INTERACTION) {
		axiomComponent = (
			<InteractionORAxiom
				data={props.data}
				idx={props.idx}
				config={props.config}
				messageCallback={props.messageCallback}
				unsatisfiedAxioms={props.unsatisfiedAxioms}
				onUnsatisfiedAxiomClick={props.onUnsatisfiedAxiomClick}
				activityInstances={props.activityInstances}
				onWhyNotNumHover={props.onWhyNotNumHover}
				onWhyWhatQuery={props.onWhyWhatQuery}
				whyQueryMode={props.whyQueryMode}
				onWhyNotWhatQuery={props.onWhyNotWhatQuery}
				ruleitems={props.ruleitems}
			></InteractionORAxiom>
		);
	} else if (axiomType === AxiomTypes.TYPE_TIME_DISTANCE) {
		axiomComponent = (
			<TimeDistanceAxiom
				idx={props.idx}
				data={props.data}
				config={props.config}
				messageCallback={props.messageCallback}
				unsatisfiedAxioms={props.unsatisfiedAxioms}
				onUnsatisfiedAxiomClick={props.onUnsatisfiedAxiomClick}
				onWhyNotWhatQuery={props.onWhyNotWhatQuery}
				onWhyWhatQuery={props.onWhyWhatQuery}
				activityInstances={props.activityInstances}
				onWhyNotNumHover={props.onWhyNotNumHover}
				whyQueryMode={props.whyQueryMode}
				selectedInstancesIdx={props.selectedInstancesIdx}
                onQuestionMenu={props.onQuestionMenu}
			></TimeDistanceAxiom>
		);
	} else if (axiomType === AxiomTypes.TYPE_DURATION) {
		axiomComponent = (
			<DurationAxiom
				idx={props.idx}
				data={props.data}
				config={props.config}
				messageCallback={props.messageCallback}
				unsatisfiedAxioms={props.unsatisfiedAxioms}
				onUnsatisfiedAxiomClick={props.onUnsatisfiedAxiomClick}
				onWhyNotWhatQuery={props.onWhyNotWhatQuery}
				onWhyWhatQuery={props.onWhyWhatQuery}
				activityInstances={props.activityInstances}
				onWhyNotNumHover={props.onWhyNotNumHover}
				whyQueryMode={props.whyQueryMode}
				selectedInstancesIdx={props.selectedInstancesIdx}
                onQuestionMenu={props.onQuestionMenu}
			></DurationAxiom>
		);
	}

	return <div className="Axiom">{axiomComponent}</div>;
}

export default Axiom;

export function getWhyNotNum(unsatisfiedAxioms, axiom, onWhyNotWhatQuery, activityInstances, onWhyNotNumHover, onQuestionMenu) {
	let numnum = null;
	for (const [axiomString, selFNIds] of Object.entries(unsatisfiedAxioms)) {
		const ax = AxiomData.axiomFromString(axiomString);
		if (isEqual(ax, axiom)) {
			numnum = (
				<div
					id="why-not-num-container"
					onMouseOver={() => onWhyNotNumHover(selFNIds)}
					onMouseLeave={() => onWhyNotNumHover([])}
					onClick={(ev) => onWhyNotWhatQuery(ev.pageX, ev.pageY, ax)}
				>
					{CircleNum(selFNIds.length)}
				</div>
			);
		}
	}
	return numnum;
}

export function QMark(props) {
	const { axiom, instances, onWhyWhatQuery, selectedIdx, onWhyHowToQuery, activity, classificationResult } = props;

	return (
		<div
			id="qmark-container"
			onClick={(ev) => {
				if (axiom.getType() === AxiomTypes.TYPE_INTERACTION) {
					// const suggestions = WhyHowToQueryController.handleWhyHowToQuery(
					// 	axiom,
					// 	activity,
					// 	classificationResult,
					// 	instances,
					// 	selectedIdx,
					// 	props.ruleitems
					// );
					// onWhyHowToQuery(suggestions);
				}
				onWhyWhatQuery(ev.pageX, ev.pageY, axiom);
			}}
		>
			{CircleQMark()}
		</div>
	);
}
