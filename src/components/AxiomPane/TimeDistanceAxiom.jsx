import React, { useState } from "react";

import "./TimeDistanceAxiom.css";

import AdjustableTime from "./AdjustableTime";
import AxiomTypes from "../../model/AxiomTypes";
import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/Icons";

function TimeDistanceInteraction(props) {
	const [hovered, setHovered] = useState(false);

	let events = [];

	if (props.data != null) {
		events = props.data.getEvents();
	} else {
		return;
	}

	let axiomText = "";
	if (props.data.getTh1() !== null) {
		axiomText += props.data.getTh1() + " <";
	}
	axiomText += " duration";
	if (props.data.getTh2() !== null) {
		axiomText += " < " + props.data.getTh2();
	}

	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
	const Icon2 = Icons.getIcon(pascalCase(events[1]), true);
	const TimeDistIcon = Icons.getIcon("TimeDistance");

	// check if this axiom is satisfied
	let opacity = 1;
	if (props.explanation && props.explanation.getType() === "why_not") {
		opacity = props.explanation.contains(props.data) ? 1 : 0.3;
		if (props.explanation.contains(props.data)) {
			let x = 1;
		}
	}

	return (
		<div className="time-dist-axiom-container">
			<div
				className="time-axiom-main-content"
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			>
				<div className="rem-btn-td">
					{hovered && (
						<button
							className="remove-axiom-btn-td"
							onClick={() => props.messageCallback(AxiomTypes.MSG_REMOVE_AXIOM, { idx: props.idx })}
						>
							X
						</button>
					)}
				</div>
				<div className="time-upper-div">
					<div
						className="time-distance-icons"
						onClick={() =>
							props.messageCallback(AxiomTypes.MSG_TIME_DISTANCE_AXIOM_FLIP_EVENTS, { idx: props.idx })
						}
					>
						<Icon1
							style={{
								width: props.config.ic_w,
								height: props.config.ic_h,
								fill: "#3A2A0D",
							}}
							opacity={opacity}
						></Icon1>
						<TimeDistIcon
							style={{
								width: 65,
								height: 30,
								fill: "#807457",
								marginTop: "-8px",
							}}
							opacity={opacity}
						></TimeDistIcon>
						<Icon2
							style={{
								width: props.config.ic_w,
								height: props.config.ic_h,
								fill: "#3A2A0D",
							}}
							opacity={opacity}
						></Icon2>
					</div>
				</div>

				<div className="time-lower-div">
					<AdjustableTime
						key={"more than"}
						idx={props.idx}
						data={props.data}
						title="more than"
						messageCallback={props.messageCallback}
					></AdjustableTime>
					<span style={{ fontSize: 12, color: "#605f5f" }}>{axiomText}</span>
					<AdjustableTime
						key={"less than"}
						idx={props.idx}
						data={props.data}
						title="less than"
						messageCallback={props.messageCallback}
					></AdjustableTime>
				</div>
			</div>
		</div>
	);
}

export default TimeDistanceInteraction;
