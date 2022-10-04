import "./TimeDistanceAxiomRepr.css";

import Icons from "../../icons/objects/Icons";
import { pascalCase } from "../../Utils/utils";
import { getWhyNotNum } from "../AxiomPane/Axiom";

import isEqual from "lodash.isequal";

import AxiomData from "../../model/AxiomData";
import QueryTrigger from "../../model/QueryTrigger";
import React from "react";

function InteractionORAxiomRepr(props) {
	const events = props.axiom.getEvents();

	// dimentions
	const icSize = 25;
	const br = props.selectedWhys === props.idx ? "solid" : "none";

	// check if this is an unsatisfied axiom based on the user query
	let numnum = null;
	let selFNIds = [];
	if (props.unsatisfiedAxioms) {
		numnum = getWhyNotNum(
			props.unsatisfiedAxioms,
			props.axiom,
			props.onWhyNotWhatQuery,
			props.onWhyNotHover,
			props.queryTrigger,
			props.qmenuPos
		);

		for (const [axiomString, ids] of Object.entries(props.unsatisfiedAxioms)) {
			const ax = AxiomData.axiomFromString(axiomString);
			if (isEqual(ax, props.axiom)) {
				selFNIds = [...ids];
				break;
			}
		}
	}

	return (
		<React.Fragment>
			<div
				className="interaction-or-axiom"
				onClick={() => props.onWhyNotAxiomClick()}
				onMouseOver={() => props.onWhyNotHover(selFNIds)}
				onMouseLeave={() => props.onWhyNotHover([])}
				onMouseEnter={(ev) => {
					const domRect = ev.target.getBoundingClientRect();
					props.onWhyHover(domRect.x + domRect.width, domRect.y, props.axiom);
				}}
			>
				{events.map((ev, idx) => {
					const Icon = Icons.getIcon(pascalCase(ev), true);
					return (
						<React.Fragment>
							<Icon
								style={{
									width: icSize,
									height: icSize,
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
			</div>
		</React.Fragment>
	);
}

export default InteractionORAxiomRepr;
