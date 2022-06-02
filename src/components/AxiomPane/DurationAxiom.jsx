import { useContext } from "react";

import "./DurationAxiom.css"

import EventIcons from "../../Utils/EventIcons";
import AdjustableTime from "./AdjustableTime";
import WhyAxiomIdsContext from "../../WhyAxiomIdsContext";

function DurationAxiom(props) {

    let events = [];
    const whyIds = useContext(WhyAxiomIdsContext);


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

    let divStyle = {}
    if (whyIds.includes(props.id)) {
        divStyle = { borderColor: "#ADCEE8", border: "1px", borderStyle: "solid", boxShadow: "0px 0px 4px 4px #2C87DB", opacity: 0.7 }
    }

    return <div className="duration-axiom" style={divStyle}>
        <AdjustableTime
            id={props.id}
            key="more than"
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
            id={props.id}
            key="less than"
            data={props.data}
            title="less than"
            messageCallback={props.messageCallback}
        ></AdjustableTime>
    </div>
}


export default DurationAxiom;