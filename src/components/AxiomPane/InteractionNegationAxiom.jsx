import React, { useState } from "react";

import "./InteractionAxiom.css";

import { CircleNum } from "../ResultsPanel/utils";
import AxiomTypes from "../../model/AxiomTypes";
import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/objects/Icons";

import AxiomData from "../../model/AxiomData";
import QueryTrigger from "../../model/QueryTrigger";
import { QMark } from "./Axiom";

function InteractionNegationAxiom(props) {
	const [hovered, setHovered] = useState(false);
	const [objectHovered, setObjectedHovered] = useState(-1);
	const [selected, setSelected] = useState(new Set());

	let events = [];

	if (props.data != null) {
		events = props.data.getEvents();
	} else {
		return;
	}

	if (!events.length) {
		return;
	}

	// check if each interaction is an unsatisfied axiom based on the user query
	let numnum = {}; // event -> num
	// for (const [axString, indeces] of Object.entries(props.unsatisfiedAxioms)) {
	// 	const axType = axString.split(":")[0];
	// 	if (axType === AxiomTypes.TYPE_INTERACTION) {
	// 		const event = axString.split(":")[1];
	// 		numnum[event] = indeces;
	// 	}
	// }

	let interactionIcons = [];
	for (let i = 0; i < events.length; i++) {
		const Icon = Icons.getIcon(pascalCase(events[i]), true);
		const NotIcon = Icons.getIcon("NotFound");

		// adjust the opacity if it is an unsatisfied axiom
		let opacity = numnum[events[i]] ? 0.3 : 1;

		interactionIcons.push(
			<div
				className="rem-object-btn-div"
				onMouseEnter={() => setObjectedHovered(i)}
				onMouseLeave={() => setObjectedHovered(-1)}
				key={i + "negSvg"}
			>
				<svg
					key={i}
					style={{
						width: props.config.ic_w,
						height: props.config.ic_h,
					}}
				>
					<Icon
						key={i + "icon"}
						style={{
							width: props.config.ic_w,
							height: props.config.ic_h,
							fill: "#3A2A0D",
							padding: 2,
							border: selected.has(events[i]) && "2px solid #4DB49C",
						}}
						opacity={opacity}
						onClick={(clickEvent) =>
							setSelected(handleIconSelection(selected, events[i], clickEvent, props.messageCallback))
						}
					></Icon>
					<NotIcon
						key={i + "notIcon"}
						style={{
							width: 1.2 * props.config.ic_w,
							height: 1.2 * props.config.ic_h,
							fill: "red",
							padding: 2,
						}}
						opacity={0.7}
						onClick={(clickEvent) =>
							setSelected(handleIconSelection(selected, events[i], clickEvent, props.messageCallback))
						}
					></NotIcon>
				</svg>
				{props.active && !props.whyQueryMode && objectHovered === i && !numnum[events[i]] && (
					<button
						key={i}
						className="remove-object-btn"
						onClick={() => {
							props.messageCallback(AxiomTypes.MSG_REMOVE_OBJECT_INTERACTION_EXCLUSION, {
								axiomIdx: props.idx,
								eventType: events[i],
							});
							setSelected(new Set());
						}}
					>
						X
					</button>
				)}
				{numnum[events[i]] && props.queryTrigger !== "" && (
					<div
						id="why-not-num-container"
						onMouseOver={() => props.onWhyNotNumHover(numnum[events[i]])}
						onMouseLeave={() => props.onWhyNotNumHover([])}
						onClick={(ev) => {
							ev.stopPropagation();
							let unsatisfiedAxiom = new AxiomData({
								type: AxiomTypes.TYPE_INTERACTION,
								th1: -1,
								th2: -1,
								events: [events[i]],
							});
							if (props.qmenuPos[0] > 0) {
								props.onWhyNotWhatQuery(-1, -1, unsatisfiedAxiom, QueryTrigger.WHY_NOT);
							} else {
								props.onWhyNotWhatQuery(
									ev.pageX,
									ev.pageY,
									unsatisfiedAxiom,
									QueryTrigger.WHY_NOT_WHAT
								);
							}
						}}
					>
						{numnum[events[i]] && CircleNum(numnum[events[i]].length)}
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="interaction-axiom">
			<div className="axiom-content">
				<div
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
					className="object-icons"
				>
					{[...interactionIcons]}
				</div>
				<div
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
					className="rem-btn"
					style={{ width: "0%", marginTop: "14px" }}
				>
					{hovered && !props.whyQueryMode && (
						<button
							key={0}
							className="remove-axiom-btn"
							onClick={() => {
								props.messageCallback(AxiomTypes.MSG_REMOVE_AXIOM, {
									idx: props.idx,
								});
								setSelected(new Set());
							}}
						>
							X
						</button>
					)}
					{props.whyQueryMode && props.queryTrigger !== "" && (
						<QMark
							ruleitems={props.ruleitems}
							activity={props.activity}
							classificationResult={props.classificationResult}
							onWhyWhatQuery={props.onWhyWhatQuery}
							onWhyNotWhatQuery={props.onWhyNotWhatQuery}
							onWhyHowToQuery={props.onWhyHowToQuery}
							instances={props.activityInstances}
							axiom={props.data}
							selectedIdx={props.selectedInstancesIdx["FP"]}
							qmenuPos={props.qmenuPos}
						></QMark>
					)}
				</div>
			</div>
		</div>
	);
}

function handleIconSelection(selectedSet, event, clickEvent, messageCallback) {
	let newSelectedSet = new Set(selectedSet);
	if (!clickEvent.shiftKey) {
		if (newSelectedSet.has(event)) {
			newSelectedSet.delete(event);
		} else {
			newSelectedSet.add(event);
		}
	} else {
		if (newSelectedSet.size === 2) {
			messageCallback(AxiomTypes.MSG_INTERACTION_OR_AXIOM_CREATION, {
				selectedEvents: newSelectedSet,
			});
		}
	}

	return newSelectedSet;
}

export default InteractionNegationAxiom;
