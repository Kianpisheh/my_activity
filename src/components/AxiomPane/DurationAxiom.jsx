import React, { useContext, useState } from "react";

import "./DurationAxiom.css";

import AdjustableTime from "./AdjustableTime";
import WhyAxiomIdsContext from "../../contexts/WhyAxiomIdsContext";
import AxiomTypes from "../../model/AxiomTypes";
import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";

function DurationAxiom(props) {
    const [hovered, setHovered] = useState(false);

    let events = [];
    const whyIds = useContext(WhyAxiomIdsContext);

    if (props.data != null) {
        events = props.data.getEvents();
    } else {
        return;
    }

    let axiomText = "";
    if (props.data.getTh1() !== -1) {
        axiomText += props.data.getTh1() + " <";
    }
    axiomText += " duration";
    if (props.data.getTh2() !== -1) {
        axiomText += " < " + props.data.getTh2();
    }

    let divStyle = {};
    if (whyIds.includes(props.idx)) {
        divStyle = {
            borderColor: "#ADCEE8",
            border: "1px",
            borderStyle: "solid",
            boxShadow: "0px 0px 4px 4px #2C87DB",
            opacity: 0.7,
        };
    }
    const Icon = Icons.getIcon(pascalCase(events[0]), true);
    const TimeDistIcon = Icons.getIcon("TimeDistance");
    return (
        <div className="time-dist-axiom-container">
            <div className="time-axiom-main-content-2" onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}>
                <div
                    className="rem-btn-td"
                >
                    {hovered && (
                        <button
                            className="remove-axiom-btn-td"
                            onClick={() =>
                                props.messageCallback(AxiomTypes.MSG_REMOVE_AXIOM, {
                                    idx: props.idx,
                                })
                            }
                        >
                            X
                        </button>
                    )}
                </div>
                <div className="time-upper-div">
                    <div className="time-distance-icons-2">
                        <Icon
                            style={{
                                width: props.config.ic_w,
                                height: props.config.ic_h,
                                fill: "#3A2A0D",
                            }}
                        ></Icon>
                    </div>
                </div>
                <div className="time-lower-div">
                    <AdjustableTime
                        idx={props.idx}
                        key="more than"
                        data={props.data}
                        title="more than"
                        messageCallback={props.messageCallback}
                    ></AdjustableTime>
                    <span style={{ fontSize: 12, color: "#605f5f" }}>{axiomText}</span>
                    <AdjustableTime
                        idx={props.idx}
                        key="less than"
                        data={props.data}
                        title="less than"
                        messageCallback={props.messageCallback}
                    ></AdjustableTime>
                </div>
            </div>
        </div>
    );
}

export default DurationAxiom;
