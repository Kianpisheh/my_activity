import React, { useState, useContext } from "react";

import "./TimeDistanceAxiom.css";

import AdjustableTime from "./AdjustableTime";
import AxiomTypes from "../../model/AxiomTypes";
import WhyAxiomIdsContext from "../../contexts/WhyAxiomIdsContext";
import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/Icons";

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
    if (whyIds.includes(props.idx)) {
        divStyle = { borderColor: "#ADCEE8", border: "1px", borderStyle: "solid", boxShadow: "0px 0px 4px 4px #2C87DB", opacity: 0.7 }
    }

    const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
    const Icon2 = Icons.getIcon(pascalCase(events[1]), true);
    const TimeDistIcon = Icons.getIcon("TimeDistance");

    return (
        <React.Fragment>
            <div className="time-distance-axiom" style={divStyle} onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)} >
                <AdjustableTime
                    key={"more than"}
                    idx={props.idx}
                    data={props.data}
                    title="more than"
                    messageCallback={props.messageCallback}
                ></AdjustableTime>
                <div className="mid-section">
                    <div className="time-distance-icons" onClick={() => props.messageCallback(AxiomTypes.MSG_TIME_DISTANCE_AXIOM_FLIP_EVENTS, { idx: props.idx })}>
                        <Icon1 style={{ "width": props.config.ic_w, "height": props.config.ic_h, fill: "#3A2A0D" }}></Icon1>
                        <TimeDistIcon style={{ "width": 50, "height": 30, fill: "#3A2A0D", float: "left", padding: 10 }}></TimeDistIcon>
                        <Icon2 style={{ "width": props.config.ic_w, "height": props.config.ic_h, fill: "#3A2A0D" }}></Icon2>
                    </div>
                    <span style={{ fontSize: 12 }}>{axiomText}</span>
                </div>
                <AdjustableTime
                    key={"less than"}
                    idx={props.idx}
                    data={props.data}
                    title="less than"
                    messageCallback={props.messageCallback}
                ></AdjustableTime>
            </div>
            <div onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)} className="rem-btn">{hovered && (<button className="remove-axiom-btn" onClick={() => props.messageCallback(AxiomTypes.MSG_REMOVE_AXIOM, { idx: props.idx })}>X</button>)}</div>
        </React.Fragment>
    );
}

export default TimeDistanceInteraction;
