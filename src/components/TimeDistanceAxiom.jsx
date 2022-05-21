import EventIcons from "../Utils/EventIcons";
import "./TimeDistanceAxiom.css";

import AdjustableTime from "./AdjustableTime";

function TimeDistanceInteraction(props) {
    let events = [];
    if (props.data != null) {
        events = props.data.getEvents();
    } else {
        return;
    }

    let axiomText = "";
    if (props.data.getTh1() !== null) {
        axiomText += props.data.getTh1() + " <"
    }
    axiomText += " duration";
    if (props.data.getTh2() !== null) {
        axiomText += " < " + props.data.getTh2();
    }

    return (
        <div className="time-distance-axiom">
            <AdjustableTime
                id={props.id}
                data={props.data}
                title="more than"
                messageCallback={props.messageCallback}
            ></AdjustableTime>
            <div className="mid-section">
                <div className="time-distance-icons">
                    <img
                        width={30}
                        height={30}
                        src={EventIcons.get(events[0])}
                        alt="XX"
                    ></img>
                    <img width={60} src={EventIcons.get("time_distance")} alt="XX"></img>
                    <img
                        width={30}
                        height={30}
                        src={EventIcons.get(events[1])}
                        alt="XX"
                    ></img>
                </div>
                <span style={{ fontSize: 12 }}>{axiomText}</span>
            </div>
            <AdjustableTime
                id={props.id}
                data={props.data}
                title="less than"
                messageCallback={props.messageCallback}
            ></AdjustableTime>
        </div>
    );
}

export default TimeDistanceInteraction;
