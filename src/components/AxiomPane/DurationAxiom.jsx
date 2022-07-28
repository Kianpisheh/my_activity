import React, { useContext, useState } from "react";

import "./DurationAxiom.css";

import AdjustableTime from "./AdjustableTime";
import WhyAxiomIdsContext from "../../contexts/WhyAxiomIdsContext";
import AxiomTypes from "../../model/AxiomTypes";
import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";

function DurationAxiom(props) {
    const [hovered, setHovered] = useState(false);

    const axiom = props.data;
	const th1 = axiom.getTh1();
	const th2 = axiom.getTh2();
	const events = axiom.getEvents();
	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
	const TimeDistIcon = Icons.getIcon("TimeDistance3");

    // check if this is an unsatisfied axiom based on the user query
	let numnum = [];
	// for (const [axiomString, selFNIds] of Object.entries(props.unsatisfiedAxioms)) {
	// 	const ax = AxiomData.axiomFromString(axiomString);
	// 	if (isEqual(ax, props.data)) {
	// 		numnum = (
	// 			<div id="why-not-num-container" onClick={() => props.onUnsatisfiedAxiomClick}>
	// 				{CircleNum(selFNIds.length)}
	// 			</div>
	// 		);
	// 	}
	// }

    return (
		<div
			className="temp-adj-axiom-container2"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<div className="duration-adj-icons">
				<div className="icon-container">
					<Icon1 style={{ fill: "#3A2A0D", width: 25, height: 25, marginTop: -15 }}></Icon1>
				</div>
				<div className="icon-container" style={{ width: 100, height: 10, marginTop: -17 }}>
					<TimeDistIcon style={{ fill: "#807457", width: 100, height: 10 }}></TimeDistIcon>
				</div>
			</div>
			<div id="vertical-line-sep" style={{ borderLeft: "1px solid #A5A2A2", height: "80%" }}></div>
			<div className="temp-adj-limits2">
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
                {(hovered && numnum.length === 0) && (
                    <button
                        className="remove-axiom-btn-td"
                    onClick={() => props.messageCallback(AxiomTypes.MSG_REMOVE_AXIOM, { idx: props.idx })}
                    >
                    X
                </button>
                )}
			</div>
            {numnum}
		</div>
	);
}

export default DurationAxiom;
