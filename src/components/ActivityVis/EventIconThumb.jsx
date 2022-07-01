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

    if (
        !props.thumbEvents ||
        !props.thumbX ||
        !props.iconX ||
        !props.iconEvents ||
        !props.iconY
    ) {
        return;
    }
    const xMax = props.thumbX[props.thumbX.length - 1].x2;
    const svgWidth = Math.ceil(scale[props.idx] * xMax);
    const vb = "0 0 " + svgWidth + " " + ic_h;

    let filteredNum = 0;
    for (let i = 0; i < props.iconEvents.length; i++) {
        if (props.filters.includes(props.iconEvents[i])) {
            filteredNum += 1;
        }
    }

    return (
        <div className="event-icon-thumb-conatiner">
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
                        (props.filters.includes(props.thumbEvents[idx]) ||
                            filteredNum === 0) && (
                            <g key={idx + "_gg"}>
                                <rect
                                    key={idx}
                                    x={X.x1}
                                    y={18}
                                    width={X.x2 - X.x1}
                                    height={2 * rc_h}
                                    rx={r}
                                    fill={Icons.getColor(
                                        pascalCase(props.thumbEvents[idx])
                                    )}
                                // onMouseEnter={() => { setShowPositionTip(true) }}
                                ></rect>
                            </g>
                        )
                    );
                })}

                {props.iconX.map((x, idx) => {
                    const Icon = Icons.getIcon(
                        pascalCase(props.iconEvents[idx])
                    );

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
                                onMouseLeave={() => setHovered(-1)}
                                opacity={opacity}
                                fill={Icons.getColor(
                                    pascalCase(props.iconEvents[idx])
                                )}
                                pointerEvents={"bounding-box"}
                                x={
                                    props.iconX[idx].x1 -
                                    svgWidth / 2 +
                                    ic_w / 2
                                }
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
                                {props.iconEvents[idx]}
                            </text>
                        );
                    }

                    const tooltip = <Tooltip key={idx + "_tt"} x={props.iconX[idx].x1 + ic_w / 2} y={props.iconY[idx] - 5} text={props.iconEvents[idx]}></Tooltip>
                    const shadow = <Shadow key={idx} id={idx} x={props.iconX[idx].x1} y={props.iconY[idx]} width={ic_w} height={ic_h}></Shadow>
                    const locationOverlay = <LocationOverlay location={props.location}></LocationOverlay>

                    return (
                        <g key={idx + "_g2"}>
                            [{props.explanationIndividuals.length && props.explanationIndividuals.includes(idx) && shadow},
                            {(props.filters.includes(props.iconEvents[idx]) ||
                                filteredNum === 0) &&
                                <g key={idx + "_g"}>
                                    {hovered === idx && tooltip}
                                    {IconComponent}
                                </g>}]
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default EventIconThumb;
