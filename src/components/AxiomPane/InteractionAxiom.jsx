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

    console.log(selected);

    let interactionIcons = [];
    for (let i = 0; i < events.length; i++) {
        const Icon = Icons.getIcon(pascalCase(events[i]), true);
        interactionIcons.push(
            <div
                className="rem-object-btn-div"
                onMouseEnter={() => setObjectedHovered(i)}
                onMouseLeave={() => setObjectedHovered(-1)}
            >
                <Icon
                    style={{
                        width: props.config.ic_w,
                        height: props.config.ic_h,
                        fill: "#3A2A0D",
                        padding: 2,
                        border: selected.has(events[i]) && "2px solid #4DB49C",
                    }}
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
        </React.Fragment>
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
