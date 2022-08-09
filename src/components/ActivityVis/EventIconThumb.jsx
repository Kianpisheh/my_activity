import React from "react";

import ReactTooltip from "react-tooltip";

import "./EventIconThumb.css";
import Shadow from "./Shadow";
import Tooltip from "./Tooltip";
import LocationOverlay from "./LocationOverlay";
import Icons from "../../icons/Icons";

import { pascalCase } from "../../Utils/utils";
import { useEffect, useState } from "react";

function EventIconThumb(props) {
	const [hovered, setHovered] = useState(-1);

	const { config } = props;
	const { ic_w, ic_h, scale, r, rc_h } = config;

	useEffect(() => {
		ReactTooltip.rebuild();
	});

	if (!props.thumbEvents || !props.thumbX || !props.iconX || !props.iconEvents || !props.iconY) {
		return;
	}
	const xMax = props.thumbX[props.thumbX.length - 1].x2 + 3 * ic_w;
	const svgWidth = Math.ceil(scale[props.idx] * xMax);
	const vb = "0 0 " + svgWidth + " " + ic_h;

	let filteredNum = 0;
	for (let i = 0; i < props.iconEvents.length; i++) {
		if (props.filters.includes(props.iconEvents[i].getType())) {
			filteredNum += 1;
		}
	}

	const locationOverlay = false && (
		<LocationOverlay eventsX={props.thumbX} events={props.thumbEvents}></LocationOverlay>
	);

	return (
		<div className="event-icon-thumb-conatiner" tabIndex={-1} onClick={() => console.log("first")}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox={vb}
				width={svgWidth}
				height="100%"
				style={{ float: "left" }}
			>
				{props.thumbX.map((X, idx) => {
					// timeline opacity
					//TODO: timeline inds are diff from icon inds numb
					let timelineOpacity = 1;
					if (
						props.explanationIndividuals &&
						props.explanationIndividuals.length &&
						!props.explanationIndividuals.includes(idx)
					) {
						timelineOpacity = 0.1;
					}

					return (
						(props.filters.includes(props.thumbEvents[idx].getType()) || filteredNum === 0) && (
							<g key={idx + "_gg"}>
								<rect
									key={idx}
									x={X.x1}
									y={18}
									width={X.x2 - X.x1}
									height={2 * rc_h}
									rx={r}
									fill={Icons.getColor(pascalCase(props.thumbEvents[idx].getType()))}
									// onMouseEnter={() => { setShowPositionTip(true) }}
								></rect>
							</g>
						)
					);
				})}

				{props.iconX.map((x, idx) => {
					const Icon = Icons.getIcon(pascalCase(props.iconEvents[idx].getType()));

					// icon opacity
					let opacity = 1;
					if (
						props.explanationIndividuals &&
						props.explanationIndividuals.length &&
						!props.explanationIndividuals.includes(idx)
					) {
						opacity = 0.1;
					}

					let IconComponent = null;
					if (Icon) {
						IconComponent = (
							<Icon
								key={idx}
								onMouseEnter={() => {
									if (hovered === -1) {
										setHovered(idx);
									}
								}}
								onClick={() =>
									props.onInstanceEventSelection(pascalCase(props.iconEvents[idx].getType()), idx)
								}
								onMouseLeave={() => setHovered(-1)}
								opacity={opacity}
								fill={Icons.getColor(pascalCase(props.iconEvents[idx].getType()))}
								pointerEvents={"bounding-box"}
								x={props.iconX[idx].x1 - svgWidth / 2 + ic_w / 2}
								y={props.iconY[idx]}
							></Icon>
						);
					} else {
						IconComponent = (
							<text
								key={idx}
								x={props.iconX[idx].x1}
								y={15}
								style={{
									fontSize: 8,
									transform: "rotate(90)",
								}}
							>
								{props.iconEvents[idx].getType()}
							</text>
						);
					}

					const tooltip = (
						<Tooltip
							key={idx + "_tt"}
							x={props.iconX[idx].x1 + ic_w / 2}
							y={props.iconY[idx] - 5}
							text={props.iconEvents[idx].getType()}
						></Tooltip>
					);
					const shadow = (
						<Shadow
							key={idx}
							id={idx}
							x={props.iconX[idx].x1}
							y={props.iconY[idx]}
							width={ic_w}
							height={ic_h}
						></Shadow>
					);

					let highlight = false;
                    if (props.selectedInstanceEvents) {
                        if (props.selectedInstanceEvents[pascalCase(props.iconEvents[idx].getType())] === idx) {
                            highlight = true;
                        }
                    }

					return (
						<g key={idx + "_g2"}>
							[
							{props.explanationIndividuals.length &&
								props.explanationIndividuals.includes(idx) &&
								shadow}
							,
							{(props.filters.includes(props.iconEvents[idx].getType()) || filteredNum === 0) && (
								<g key={idx + "_g"}>
									{hovered === idx && tooltip}
									{IconComponent}
									{highlight && (
										<rect
											width={ic_w}
											height={ic_h}
											x={props.iconX[idx].x1}
											y={props.iconY[idx]}
											fill="none"
											stroke="var(--explanation)"
											strokeWidth={2}
										></rect>
									)}
								</g>
							)}
							]
						</g>
					);
				})}
				{locationOverlay}
			</svg>
		</div>
	);
}

export default EventIconThumb;
