import React, { useState, useContext } from "react";

import EventIcons from "../../Utils/EventIcons";
import "./TimeDistanceAxiom.css";

import AdjustableTime from "./AdjustableTime";
import WhyAxiomIdsContext from "../../contexts/WhyAxiomIdsContext";

function TimeDistanceInteraction(props) {

    const [hovered, setHovered] = useState(false);
    const whyIds = useContext(WhyAxiomIdsContext);

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

    let divStyle = {}
    if (whyIds.includes(props.id)) {
        divStyle = { borderColor: "#ADCEE8", border: "1px", borderStyle: "solid", boxShadow: "0px 0px 4px 4px #2C87DB", opacity: 0.7 }
    }


    return (
        <React.Fragment>
            <div className="time-distance-axiom" style={divStyle} onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)} >
                <AdjustableTime
                    key={"more than"}
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
                    key={"less than"}
                    id={props.id}
                    data={props.data}
                    title="less than"
                    messageCallback={props.messageCallback}
                ></AdjustableTime>
            </div>
            <div onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)} className="rem-btn">{hovered && (<button className="remove-axiom-btn">X</button>)}</div>
        </React.Fragment>
    );
}

export default TimeDistanceInteraction;
