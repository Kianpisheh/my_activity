import React, { useContext, useState } from "react";

import "./InteractionAxiom.css";

import WhyAxiomIdsContext from "../../contexts/WhyAxiomIdsContext";
import AxiomTypes from "../../model/AxiomTypes";
import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/Icons";

function InteractionAxiom(props) {
    const [hovered, setHovered] = useState(false);
    const [objectHovered, setObjectedHovered] = useState(-1);
    const [selected, setSelected] = useState(new Set());

    let events = [];
    const whyIds = useContext(WhyAxiomIdsContext);

    if (props.data != null) {
        events = props.data.getEvents();
    } else {
        return;
    }

    if (!events.length) {
        return
    }

    let interactionIcons = [];
    for (let i = 0; i < events.length; i++) {
        const Icon = Icons.getIcon(pascalCase(events[i]), true);
        // icon opacity
        let opacity = 1;
        if (props.explanation && props.explanation.getType() === "why_not") {
            opacity = props.explanation.getEvents().includes(events[i]) ? 1 : 0.3;
        }
        interactionIcons.push(
            <div
                className="rem-object-btn-div"
                onMouseEnter={() => setObjectedHovered(i)}
                onMouseLeave={() => setObjectedHovered(-1)}
            >
                <Icon
                    key={i}
                    style={{
                        width: props.config.ic_w,
                        height: props.config.ic_h,
                        fill: "#3A2A0D",
                        padding: 2,
                        border: selected.has(events[i]) && "2px solid #4DB49C",
                    }}
                    opacity={opacity}
                    onClick={(clickEvent) =>
                        setSelected(handleIconSelection(selected, events[i], clickEvent, props.messageCallback))
                    }
                ></Icon>
                {objectHovered === i && (
                    <button
                        className="remove-object-btn"
                        onClick={() => {
                            props.messageCallback(
                                AxiomTypes.MSG_REMOVE_OBJECT_INTERACTION,
                                {
                                    axiomIdx: props.idx,
                                    eventType: events[i],
                                }
                            );
                            setSelected(new Set());
                        }}
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
        <div className="interaction-axiom">
            <div className="axiom-content">
                <div
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="object-icons"
                    style={divStyle}
                >
                    {[...interactionIcons]}
                </div>
                <div
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="rem-btn"
                    style={{ width: "0%", marginTop: "14px" }}
                >
                    {hovered && (
                        <button
                            className="remove-axiom-btn"
                            onClick={() => {
                                props.messageCallback(AxiomTypes.MSG_REMOVE_AXIOM, {
                                    idx: props.idx,
                                });
                                setSelected(new Set());
                            }}
                        >
                            X
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function handleIconSelection(selectedSet, event, clickEvent, messageCallback) {
    let newSelectedSet = new Set(selectedSet);
    if (!clickEvent.shiftKey) {
        if (newSelectedSet.has(event)) {
            newSelectedSet.delete(event);
        } else {
            newSelectedSet.add(event);
        }
    } else {
        if (newSelectedSet.size === 2) {
            messageCallback(AxiomTypes.MSG_INTERACTION_OR_AXIOM_CREATION, { selectedEvents: newSelectedSet });
            console.log("message sent");
        }
    }

    return newSelectedSet;
}

export default InteractionAxiom;
