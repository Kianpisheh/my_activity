import { useState } from "react";

import "./AdjustableTime.css";

import EventIcons from "../Utils/EventIcons";
import AxiomTypes from "../model/AxiomTypes";

function AdjustableTime(props) {
    let th = props.data.getTh2();
    if (props.title === "more than") {
        th = props.data.getTh1();
    } else if (props.title === "less than") {
        th = props.data.getTh2();
    }
    let active0 = true;
    if (th === null) {
        active0 = false;
    }

    if (!active0) {
        th =
            props.title === "more than"
                ? AxiomTypes.VALUE_DEFAULT_TH1
                : AxiomTypes.VALUE_DEFAULT_TH2;
    }

    // const [time, setTime] = useState(th);
    const [active, setActive] = useState(active0);

    let time = null;
    if (props.title === "more than") {
        time = props.data.getTh1();
    } else if (props.title === "less than") {
        time = props.data.getTh2();
    }

    return (
        <div
            className="time-distance-container"
            style={{ opacity: active ? "1" : "0.3" }}
        >
            <span style={{ fontSize: 12 }}>{props.title}</span>
            <div className="time-distance-adjust">
                <input
                    type="image"
                    src={EventIcons.get("decrease_sec")}
                    className="sec-btn"
                    alt="sec-btn"
                    style={{ width: 18, height: 18 }}
                    onMouseDown={() => {
                        if (active) {
                            props.messageCallback(AxiomTypes.MSG_TIME_CONSTRAINT_UPDATED, {
                                id: props.id,
                                time: time - 1,
                                type: props.title,
                            });
                        }
                    }}
                />
                <input id="sec" value={(time === null) ? "-------" : time + "  sec"} style={{ width: 45 }} />
                <input
                    type="image"
                    src={EventIcons.get("increase_sec")}
                    className="sec-btn"
                    alt="sec-btn"
                    style={{ width: 18, height: 18 }}
                    onMouseDown={() => {
                        if (active) {
                            props.messageCallback(AxiomTypes.MSG_TIME_CONSTRAINT_UPDATED, {
                                id: props.id,
                                time: time + 1,
                                type: props.title,
                            });
                        }
                    }}
                />
            </div>
            <input
                className="time-adjust-checkbox"
                type="checkbox"
                onChange={() =>
                    setActive(!active,
                        props.messageCallback(
                            AxiomTypes.MSG_TIME_CONSTRAINT_STATUS_UPDATED,
                            {
                                id: props.data.getID(),
                                active: !active,
                                time: time,
                                type: props.title,
                            }
                        )
                    )
                }

                checked={active}
            ></input>
        </div >
    );
}

export default AdjustableTime;
