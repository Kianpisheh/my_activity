import "./ActivityInstancePane.css";
import ActivityListColors from "./ActivityPane/ActivityListColors"

function ActivtityInstancePane(props) {
    return (
        <div className="act-instance-pane-container">
            <span className="section-title" id="title">Activity instances</span>
            <div className="activity-instances">
                <ul>
                    {props.activtiyInstances.map((activity, idx) => {
                        let style =
                            props.currentActInstanceIdx === idx
                                ? { background: "#E3DDCA" }
                                : {};
                        // get activity class color
                        let color = "";
                        if (props.predictedActivities && props.predictedActivities[idx]) {
                            let actP = props.predictedActivities[idx][0];
                            props.activities.forEach((activity, k) => {
                                if (activity.getName() === actP) {
                                    color = ActivityListColors.getColor(k)
                                }
                            })
                        }
                        return (
                            <li
                                key={idx}
                                style={style}
                                onClick={() => {
                                    props.onSelectedItemChange(
                                        idx,
                                        activity.getName()
                                    );
                                }}
                            >
                                <text className="list-item">{activity.getName()}</text>
                                {(color !== "") && <svg id="svg-act-color">
                                    <rect
                                        id="rect-act-color"
                                        x={0}
                                        y={0}
                                        width={15}
                                        height={15}
                                        rx={2}
                                        fill={color}
                                    ></rect>
                                </svg>}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default ActivtityInstancePane;
