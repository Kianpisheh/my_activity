import React, { useState } from "react";

import "./TimeDistanceAxiom.css";

import AdjustableTime from "./AdjustableTime";
import AxiomTypes from "../../model/AxiomTypes";
import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/objects/Icons";
import { QMark } from "./Axiom";

function TimeDistanceAxiom(props) {
	const [hovered, setHovered] = useState(false);

	let events = [];

	if (props.data != null) {
		events = props.data.getEvents();
	} else {
		return;
	}

	let icons1 = [];
	let icons2 = [];
	const opSize = props.data.getOpSize();
	let iconSize = [25 + 15 * (opSize[0] - 1), 25 + 15 * (opSize[1] - 1)];

	if (props.data.getType() === AxiomTypes.TYPE_TIME_DISTANCE) {
		const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
		icons1 = [<Icon1 style={{ fill: "#3A2A0D", width: 25, height: 25 }}></Icon1>];
		const Icon2 = Icons.getIcon(pascalCase(events[1]), true);
		icons2 = [<Icon2 style={{ fill: "#3A2A0D", width: 25, height: 25 }}></Icon2>];
	} else if (props.data.getType() === AxiomTypes.TYPE_OR_TIME_DISTANCE) {
		const evNum = props.data.getOpSize();
		for (let i = 0; i < events.length; i++) {
			const Icon1 = Icons.getIcon(pascalCase(events[i]), true);
			if (i < evNum[0]) {
				icons1.push(<Icon1 style={{ fill: "#3A2A0D", width: iconSize[0], height: iconSize[1] }}></Icon1>);
				if (i < evNum[0] - 1) {
					icons1.push(<p style={{ fontSize: 9 }}>OR</p>);
				}
			} else {
				icons2.push(<Icon1 style={{ fill: "#3A2A0D", width: iconSize[0], height: iconSize[1] }}></Icon1>);
				if (i < evNum[0] + evNum[1] - 1) {
					icons2.push(<p style={{ fontSize: 9 }}>OR</p>);
				}
			}
		}
	}

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
				<div
					className="icon-container"
					style={{ width: 30 * (opSize[0] - 1) + 25, height: 30 * (opSize[0] - 1) + 25 }}
				>
					{icons1}
				</div>
				<div className="icon-container" style={{ width: 100, height: 25 }}>
					<TimeDistIcon style={{ fill: "#807457", width: 100, height: 25 }}></TimeDistIcon>
				</div>
				<div
					className="icon-container"
					style={{ width: 30 * (opSize[1] - 1) + 25, height: 30 * (opSize[1] - 1) + 25 }}
				>
					{icons2}
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
