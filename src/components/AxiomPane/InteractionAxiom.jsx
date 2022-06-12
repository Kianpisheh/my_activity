import React, { useContext, useState } from "react";

import "./InteractionAxiom.css";

import EventIcons from "../../Utils/EventIcons";
import WhyAxiomIdsContext from "../../contexts/WhyAxiomIdsContext";
import AxiomTypes from "../../model/AxiomTypes";

function InteractionAxiom(props) {
    const [hovered, setHovered] = useState(false);
    const [objectHovered, setObjectedHovered] = useState(-1);

    let events = [];
    const whyIds = useContext(WhyAxiomIdsContext);

    if (props.data != null) {
        events = props.data.getEvents();
    } else {
        return;
    }

    let interactionIcons = [];
    for (let i = 0; i < events.length; i++) {
        interactionIcons.push(
            <div
                className="rem-object-btn-div"
                onMouseEnter={() => setObjectedHovered(i)}
                onMouseLeave={() => setObjectedHovered(-1)}
            >
                <img
                    key={i}
                    width={30}
                    height={30}
                    src={EventIcons.get(events[i])}
                    alt="XX"
                ></img>
                {objectHovered === i && (
                    <button
                        className="remove-object-btn"
                        onClick={() =>
                            props.messageCallback(AxiomTypes.MSG_REMOVE_OBJECT_INTERACTION, {
                                axiomIdx: props.idx,
                                eventType: events[i]
                            })
                        }
                    >
                        X
                    </button>
                )}
            </div>
        );
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

    return (
        <React.Fragment>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="interaction-axiom"
                style={divStyle}
            >
                {[...interactionIcons]}
            </div>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="rem-btn"
            >
                {hovered && (
                    <button
                        className="remove-axiom-btn"
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
        </React.Fragment>
    );
}

export default InteractionAxiom;
