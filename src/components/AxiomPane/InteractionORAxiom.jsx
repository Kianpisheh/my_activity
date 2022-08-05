import React, { useState, useContext } from "react";

import "./InteractionORAxiom.css";

import AxiomTypes from "../../model/AxiomTypes";
import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/Icons";

function InteractionOR(props) {
    const [hovered, setHovered] = useState(false);

    let events = [];
    if (props.data != null) {
        events = props.data.getEvents();
    } else {
        return;
    }

    
    const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
    const Icon2 = Icons.getIcon(pascalCase(events[1]), true);

    return (
        <React.Fragment>
            <div
                className="interaction-or-axiom"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <Icon1
                    style={{
                        width: props.config.ic_w,
                        height: props.config.ic_h,
                        fill: "#3A2A0D",
                    }}
                ></Icon1>
                <span style={{ fontSize: 14 }}>OR</span>
                <Icon2
                    style={{
                        width: props.config.ic_w,
                        height: props.config.ic_h,
                        fill: "#3A2A0D",
                    }}
                ></Icon2>
                {hovered && (
                    <button
                        className="remove-axiom-btn-or"
                        onClick={() => {
                            props.messageCallback(AxiomTypes.MSG_REMOVE_AXIOM, {
                                idx: props.idx,
                            })
                        }
                        }
                    >
                        X
                    </button>
                )}

            </div>
        </React.Fragment>
    );
}

export default InteractionOR;
