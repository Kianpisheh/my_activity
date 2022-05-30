import "./ActivityPane.css";

import AxiomTypes from "../model/AxiomTypes";
import ActivtiyItem from "./ActivtyItem";

function ActivityPane(props) {
    return (
        <div className="activity-pane-container">
            <span id="title" style={{ fontSize: 12 }}>
                Registered activities
            </span>
            <div className="activities-container">
                <ul>
                    {props.activities.map((activity, idx) => {
                        return (
                            <ActivtiyItem
                                idx={idx}
                                onActivitiyListChange={props.onActivitiyListChange}
                                activity={activity}
                            ></ActivtiyItem>
                        );
                    })}
                </ul>
            </div>
            <button
                className="add-btn"
                onClick={() =>
                    props.onActivitiyListChange(AxiomTypes.MSG_ADD_ACTIVITY, null)
                }
            >
                +
            </button>
        </div>
    );
}

export default ActivityPane;
