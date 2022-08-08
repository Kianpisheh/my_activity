import React, { useState } from "react";

import "./DurationAxiom.css";

import AdjustableTime from "./AdjustableTime";
import AxiomTypes from "../../model/AxiomTypes";
import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";
import { getWhyNotNum, QMark } from "./Axiom";


function DurationAxiom(props) {
    const [hovered, setHovered] = useState(false);

    const axiom = props.data;
	const events = axiom.getEvents();
	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
	const TimeDistIcon = Icons.getIcon("TimeDistance3");

    // check if this is an unsatisfied axiom based on the user query
	const numnum = getWhyNotNum(
		props.unsatisfiedAxioms,
		props.data,
		props.onWhyNotWhatQuery,
		props.activityInstances,
		props.onWhyNotNumHover,
        props.onQuestionMenu
	);

    let opacity = numnum ? 0.3 : 1;

    return (
		<div
			className="temp-adj-axiom-container2"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<div className="duration-adj-icons" style={{opacity: opacity}}>
				<div className="icon-container">
					<Icon1 style={{ fill: "#3A2A0D", width: 25, height: 25, marginTop: -15 }}></Icon1>
				</div>
				<div className="icon-container" style={{ width: 100, height: 10, marginTop: -17 }}>
					<TimeDistIcon style={{ fill: "#807457", width: 100, height: 10 }}></TimeDistIcon>
				</div>
			</div>
			<div id="vertical-line-sep" style={{ borderLeft: "1px solid #A5A2A2", height: "80%", opacity: opacity }}></div>
			<div className="temp-adj-limits2" style={{opacity: opacity}}>
				<span style={{display: "flex", flexDirection: "row"}}>
					<p style={{width: 110}}>
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
				<span style={{display: "flex", flexDirection: "row"}}>
					<p style={{width: 110}}>
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
                {(!props.whyQueryMode && hovered && !numnum) && (
                    <button
                        className="remove-axiom-btn-td"
                    onClick={() => props.messageCallback(AxiomTypes.MSG_REMOVE_AXIOM, { idx: props.idx })}
                    >
                    X
                </button>
                )}
			</div>
            {!props.whyQueryMode && numnum}
            {props.whyQueryMode && (
				<QMark
					onWhyWhatQuery={props.onWhyWhatQuery}
					instances={props.activityInstances}
					axiom={axiom}
                    selectedIdx={props.selectedInstancesIdx["FP"]}
                    onQuestionMenu={props.onQuestionMenu}
				></QMark>
			)}
		</div>
	);
}

export default DurationAxiom;
