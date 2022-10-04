import React, { useState } from "react";

import "./DurationAxiom.css";

import AdjustableTime from "./AdjustableTime";
import AxiomTypes from "../../model/AxiomTypes";
import Icons from "../../icons/objects/Icons";
import { pascalCase } from "../../Utils/utils";
import { getWhyNotNum, QMark } from "./Axiom";

function DurationAxiom(props) {
	const [hovered, setHovered] = useState(false);

	const axiom = props.data;
	const events = axiom.getEvents();
	const TimeDistIcon = Icons.getIcon("TimeDistance3");

	// check if this is an unsatisfied axiom based on the user query
	// const numnum = getWhyNotNum(
	// 	props.unsatisfiedAxioms,
	// 	props.data,
	// 	props.onWhyNotWhatQuery,
	// 	props.onWhyNotHover,
	//     props.queryTrigger,
	//     props.qmenuPos
	// );

	// let opacity = numnum ? 0.3 : 1;

	let icons1 = [];
	const opSize = props.data.getOpSize();
	let iconSize = [25 + 15 * (opSize[0] - 1), 25];
	for (let i = 0; i < events.length; i++) {
		const Icon1 = Icons.getIcon(pascalCase(events[i]), true);
		icons1.push(<Icon1 style={{ fill: "#3A2A0D", width: iconSize[0], height: iconSize[1] }}></Icon1>);
		if (i < events.length - 1) {
			icons1.push(<p style={{ fontSize: 9 }}>OR</p>);
		}
	}

	return (
		<div
			className="temp-adj-axiom-container2"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<div className="duration-adj-icons">
				<div className="icon-container" style={{ width: 30 * (opSize[0] - 1) + 25, height: 25, columnGap: 5 }}>
					{icons1}
				</div>
				<div className="icon-container" style={{ width: 100, height: 10 }}>
					<TimeDistIcon style={{ fill: "#807457", width: 100, height: 10 }}></TimeDistIcon>
				</div>
			</div>
			<div id="vertical-line-sep" style={{ borderLeft: "1px solid #A5A2A2", height: "80%" }}></div>
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
						active={props.active}
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
						active={props.active}
					></AdjustableTime>
				</span>
			</div>
			<div className="rem-btn-td2">
				{props.active && !props.whyQueryMode && hovered && (
					<button
						className="remove-axiom-btn-td"
						onClick={() => props.messageCallback(AxiomTypes.MSG_REMOVE_AXIOM, { idx: props.idx })}
					>
						X
					</button>
				)}
			</div>
			{!props.whyQueryMode && props.queryTrigger !== ""}
			{props.whyQueryMode && props.queryTrigger !== "" && (
				<QMark
					onWhyWhatQuery={props.onWhyWhatQuery}
					instances={props.activityInstances}
					axiom={axiom}
					selectedIdx={props.selectedInstancesIdx["FP"]}
					onQuestionMenu={props.onQuestionMenu}
					qmenuPos={props.qmenuPos}
				></QMark>
			)}
		</div>
	);
}

export default DurationAxiom;
