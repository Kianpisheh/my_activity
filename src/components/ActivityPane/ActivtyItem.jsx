import { useState } from "react";

import "./ActivityItem.css";

import AxiomTypes from "../../model/AxiomTypes";

function ActivtiyItem(props) {
    const [hovered, setHovered] = useState(false);

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
