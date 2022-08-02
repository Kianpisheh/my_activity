import React, {useState } from "react";

import "./InteractionAxiom.css";

import { CircleNum } from "../ExplanationPanel/utils";
import AxiomTypes from "../../model/AxiomTypes";
import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/Icons";

import WhyNotHowToQueryController from "../../Controllers/WhyNotHowToQueryController";
import AxiomData from "../../model/AxiomData";

function InteractionAxiom(props) {
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
	let unsatisfiedAxiom = null;
    let numnum = {}; // event -> num
	for (const [axString, indeces] of Object.entries(props.unsatisfiedAxioms)) {
		const axType = axString.split(":")[0];
		if (axType === AxiomTypes.TYPE_INTERACTION) {
			const event = axString.split(":")[1];
            unsatisfiedAxiom = new AxiomData({type:axType, th1:-1, th2:-1, events: [event]})
			numnum[event] = indeces;
		}
	}

	let interactionIcons = [];
	for (let i = 0; i < events.length; i++) {
		const Icon = Icons.getIcon(pascalCase(events[i]), true);
		// icon opacity
		let opacity = 1;
		if (props.explanation && props.explanation.getType() === "why_not") {
			opacity = props.explanation.getEvents().includes(events[i]) ? 1 : 0.3;
		}
		interactionIcons.push(
			<div
				className="rem-object-btn-div"
				onMouseEnter={() => setObjectedHovered(i)}
				onMouseLeave={() => setObjectedHovered(-1)}
			>
				<Icon
					key={i}
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
				{!props.whyQueryMode && objectHovered === i && !numnum[events[i]] && (
					<button
						className="remove-object-btn"
						onClick={() => {
							props.messageCallback(AxiomTypes.MSG_REMOVE_OBJECT_INTERACTION, {
								axiomIdx: props.idx,
								eventType: events[i],
							});
							setSelected(new Set());
						}}
					>
						X
					</button>
				)}
				<div
					id="why-not-num-container"
					onMouseOver={() => props.onWhyNotNumHover(numnum[events[i]])}
					onMouseLeave={() => props.onWhyNotNumHover([])}
                    onClick={() => {
                        const whyNotHowToSuggestions = WhyNotHowToQueryController.handleWhyNotHowToQuery(
						unsatisfiedAxiom,
						props.activity,
						props.classificationResult,
						props.activityInstances,
						props.selectedInstancesIdx["FN"]
					);
                    props.onWhyNotHowTo(whyNotHowToSuggestions);}}
				>
					{numnum[events[i]] && CircleNum(numnum[events[i]].length)}
				</div>
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
					{hovered && (
						<button
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

export default InteractionAxiom;

// onClick={() => {
//                         const instances = props.activityInstances.filter((val, idx) => numnum[events[i]].includes(idx))
// 						const whatExp = WhyNotWhatQueryController.handleWhyNotWhatQuery(axiom, instances);
// 						props.onWhyNotWhatQuery(whatExp);
// 					}}
