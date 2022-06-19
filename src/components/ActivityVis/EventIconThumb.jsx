import React from 'react';

import ReactTooltip from 'react-tooltip';

import "./EventIconThumb.css";
import Icons from "../../icons/Icons";


import { pascalCase } from "../../Utils/utils";
import { useEffect } from 'react';

function EventIconThumb(props) {
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
        <div className="event-icon-thumb-conatiner" >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={vb}
                width={svgWidth}
                height="100%"
                style={{ float: "left" }}
            >
                {props.thumbX.map((X, idx) => {
                    return (
                        (props.filters.includes(props.thumbEvents[idx]) ||
                            filteredNum === 0) && (
                            <g key={idx}>
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
                    if (props.explanationIndividuals && props.explanationIndividuals.length && !props.explanationIndividuals.includes(idx)) {
                        opacity = 0.3;
                    }

                    let IconComponent = null;
                    if (Icon) {
                        IconComponent = (
                            <Icon
                                opacity={opacity}
                                fill={Icons.getColor(
                                    pascalCase(props.iconEvents[idx])
                                )}
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
                                x={props.iconX[idx].x1}
                                y={15}
                                style={{
                                    fontSize: 8, transform: "rotate(90)"
                                }}
                            >
                                {props.iconEvents[idx]}
                            </text>
                        );
                    }
                    return (
                        (props.filters.includes(props.iconEvents[idx]) ||
                            filteredNum === 0) && (
                            <g key={idx}>{IconComponent}</g>
                        )
                    );
                })}
            </svg>
        </div >
    );
}

export default EventIconThumb;
