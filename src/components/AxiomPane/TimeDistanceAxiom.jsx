import React, { useState } from "react";

import "./TimeDistanceAxiom.css";

import AdjustableTime from "./AdjustableTime";
import AxiomTypes from "../../model/AxiomTypes";
import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/Icons";
import { getWhyNotNum, QMark } from "./Axiom";

function TimeDistanceAxiom(props) {
	const [hovered, setHovered] = useState(false);

	let events = [];

	if (props.data != null) {
		events = props.data.getEvents();
	} else {
		return;
	}

	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
	const Icon2 = Icons.getIcon(pascalCase(events[1]), true);
	const TimeDistIcon = Icons.getIcon("TimeDistance2");

	// check if this is an unsatisfied axiom based on the user query
	// const numnum = getWhyNotNum(
	// 	props.unsatisfiedAxioms,
	// 	props.data,
	// 	props.onWhyNotWhatQuery,
	// 	props.onWhyNotNumHover,
	//     props.queryTrigger,
	//     props.qmenuPos
	// );

	// let opacity = numnum ? 0.3 : 1;

	return (
		<div
			className="temp-adj-axiom-container2"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<div className="temp-adj-icons">
				<div className="icon-container">
					<Icon1 style={{ fill: "#3A2A0D", width: 25, height: 25 }}></Icon1>
				</div>
				<div className="icon-container" style={{ width: 100, height: 25 }}>
					<TimeDistIcon style={{ fill: "#807457", width: 100, height: 25 }}></TimeDistIcon>
				</div>
				<div className="icon-container" style={{ width: 25, height: 25 }}>
					<Icon2 style={{ fill: "#3A2A0D", width: 25, height: 25 }}></Icon2>
				</div>
			</div>
			<div
				id="vertical-line-sep"
				style={{ borderLeft: "1px solid #A5A2A2", height: "80%", alignSelf: "center" }}
			></div>
			<div className="temp-adj-limits2">
				<span style={{ display: "flex", flexDirection: "row" }}>
					<p style={{ width: 110 }}>
						at least <span style={{ fontWeight: 600 }}>{props.data.getTh1()}</span> sec later{" "}
					</p>
					<AdjustableTime
						key={"more than"}
						idx={props.idx}
						data={props.data}
						title="more than"
						messageCallback={props.messageCallback}
					></AdjustableTime>
				</span>
				<span style={{ display: "flex", flexDirection: "row" }}>
					<p style={{ width: 110 }}>
						at most <span style={{ fontWeight: 600 }}>{props.data.getTh2()}</span> sec later
					</p>
					<AdjustableTime
						key={"less than"}
						idx={props.idx}
						data={props.data}
						title="less than"
						messageCallback={props.messageCallback}
					></AdjustableTime>
				</span>
			</div>
			<div className="rem-btn-td2">
				{!props.whyQueryMode && hovered && (
					<button
						className="remove-axiom-btn-td"
						onClick={() => props.messageCallback(AxiomTypes.MSG_REMOVE_AXIOM, { idx: props.idx })}
					>
						X
					</button>
				)}
			</div>
			{!props.whyQueryMode}
			{props.whyQueryMode && props.queryTrigger !== "" && (
				<QMark
					onWhyWhatQuery={props.onWhyWhatQuery}
					instances={props.activityInstances}
					axiom={props.data}
					selectedIdx={props.selectedInstancesIdx["FP"]}
				></QMark>
			)}
		</div>
	);
}

export default TimeDistanceAxiom;

export function getStartIdx(axioms, axiomType) {
	for (let i = 0; i < axioms.length; i++) {
		const axType = axioms[i].getType();
		if (axType === axiomType) {
			return i;
		}
	}
	return null;
}
