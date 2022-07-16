import { useState } from "react";

import "./ActivityItem.css";

import AxiomTypes from "../../model/AxiomTypes";
import ActivityListColors from "./ActivityListColors";

function ActivtiyItem(props) {
    const [hovered, setHovered] = useState(false);

    let style = {};
    if (props.idx === props.currentActivityIdx) {
        style = { background: "#E3DDCA" };
    }

    return (
        <div
            className="activity-item-container"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <li
                key={props.idx}
                onClick={() =>
                    props.onActivitiyListChange(
                        AxiomTypes.MSG_CHANGE_CURRENT_ACTIVITY,
                        props.activity.getID()
                    )
                }
                style={style}
                onContextMenu={(event) => {
                    event.preventDefault();
                    props.onAction(
                        props.activity.getID(),
                        event.pageX,
                        event.pageY
                    );
                }}
            >
                <text className="list-item">{props.activity.name}</text>
                {!hovered && (
                    <svg id="svg-act-color">
                        <rect
                            id="rect-act-color"
                            x={0}
                            y={0}
                            width={15}
                            height={15}
                            rx={2}
                            fill={ActivityListColors.getColor(props.idx)}
                        ></rect>
                    </svg>
                )}
                {hovered && (
                    <button
                        className="remove-activity-btn"
                        onClick={() =>
                            props.onActivitiyListChange(
                                AxiomTypes.MSG_REMOVE_ACTIVITY,
                                props.activity.getID()
                            )
                        }
                    >
                        x
                    </button>
                )}
            </li>
        </div>
    );
}

export default ActivtiyItem;
