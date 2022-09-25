import React, { useState, useContext } from "react";

import "./InteractionORAxiom.css";

import AxiomTypes from "../../model/AxiomTypes";
import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/objects/Icons";

function InteractionOR(props) {
	const [hovered, setHovered] = useState(false);

	let events = [];
	if (props.data != null) {
		events = props.data.getEvents();
	} else {
		return;
	}

	return (
		<React.Fragment>
			<div
				className="interaction-or-axiom"
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			>
				{events.map((ev, idx) => {
					const Icon = Icons.getIcon(pascalCase(ev), true);
					return (
						<React.Fragment>
							<Icon
								style={{
									width: props.config.ic_w,
									height: props.config.ic_h,
									fill: "#3A2A0D",
								}}
							></Icon>
							{idx < events.length - 1 && (
								<span key={idx + "or_int"} style={{ fontSize: 14 }}>
									OR
								</span>
							)}
						</React.Fragment>
					);
				})}

				{props.active && hovered && (
					<button
						className="remove-axiom-btn-or"
						onClick={() => {
							props.messageCallback(AxiomTypes.MSG_REMOVE_AXIOM, {
								idx: props.idx,
							});
						}}
					>
						X
					</button>
				)}
			</div>
		</React.Fragment>
	);
}

export default InteractionOR;
