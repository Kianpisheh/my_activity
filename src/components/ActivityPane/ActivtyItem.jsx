import { useState } from "react";

import "./ActivityItem.css";

import AxiomTypes from "../../model/AxiomTypes";

function ActivtiyItem(props) {
    const [hovered, setHovered] = useState(false);


    let style = {}
    if (props.idx === props.currentActivityIdx) {
        style = { background: "#E3DDCA" }
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
                    props.onAction(props.activity.getID(), event.pageX, event.pageY);
                }}
            >
                <text>{props.activity.name}</text>
                {hovered && (
                    <button
                        className="remove-activity-btn"
                        onClick={() => props.onActivitiyListChange(AxiomTypes.MSG_REMOVE_ACTIVITY,
                            props.activity.getID())}
                    >
                        x
                    </button>
                )}
            </li>
        </div>
    );
}

export default ActivtiyItem;
