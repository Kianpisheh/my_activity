import "./DurationAxiom.css"

import EventIcons from "../Utils/EventIcons";
import AdjustableTime from "./AdjustableTime";

function DurationAxiom(props) {

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

    return <div className="duration-axiom">
        <AdjustableTime
            data={props.data}
            title="more than"
            messageCallback={props.messageCallback}
        ></AdjustableTime>
        <div className="mid-section">
            <img
                width={30}
                height={30}
                src={EventIcons.get(events[0])}
                alt="XX"
            ></img>
            <img width={60} src={EventIcons.get("time_distance")} alt="XX"></img>
            <span style={{ fontSize: 12 }}>{axiomText}</span>
        </div>
        <AdjustableTime
            data={props.data}
            title="less than"
            messageCallback={props.messageCallback}
        ></AdjustableTime>
    </div>
}


export default DurationAxiom;