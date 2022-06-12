
import "./EventIconThumb.css";
import EventIcons from "../../Utils/EventIcons";
import Icons from "../../icons/Icons";

import { pascalCase } from "../../Utils/utils";

function EventIconThumb(props) {
    const { config, explanationEvents, eventIndividuals } = props;
    const { ic_w, ic_h, scale, r, rc_h } = config;
    const svgWidth = Math.ceil(scale * props.tmax);
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
                    console.log(X.x1);
                    console.log(X.x2);
                    return (
                        (props.filters.includes(props.thumbEvents[idx]) ||
                            filteredNum === 0) && (
                            <g key={idx}>
                                <rect
                                    key={idx}
                                    x={X.x1}
                                    y={18}
                                    width={
                                        (X.x2 - X.x1)
                                    }
                                    height={2 * rc_h}
                                    rx={r}
                                    fill={EventIcons.getColor(props.thumbEvents[idx])}
                                // onMouseEnter={() => { setShowPositionTip(true) }}
                                ></rect>
                            </g>
                        )
                    );
                })}
                {props.iconX.map((x, idx) => {
                    let iconStyle = {};
                    if (explanationEvents) {
                        if (explanationEvents.includes(eventIndividuals[idx])) {
                            iconStyle = {
                                fill: "none",
                                stroke: "#2C87DB",
                                strokeWidth: 2,
                                opacity: 0.6,
                            };
                        }
                    }
                    const Icon = Icons.getIcon(pascalCase(props.iconEvents[idx]));
                    return (
                        (props.filters.includes(props.iconEvents[idx]) ||
                            filteredNum === 0) && (
                            <g key={idx}>
                                <Icon
                                    opacity={1}
                                    fill={Icons.getColor(
                                        pascalCase(props.iconEvents[idx])
                                    )}
                                    x={props.iconX[idx].x1 - svgWidth / 2 + ic_w / 2}
                                    y={props.iconY[idx]}
                                ></Icon>
                            </g>
                        )
                    );
                })}
            </svg>
        </div>
    );
}

export default EventIconThumb;
