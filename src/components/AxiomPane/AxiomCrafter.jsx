import { useState } from "react";
import AxiomTypes from "../../model/AxiomTypes";
import "./AxiomCrafter.css";
import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/Icons";

function AxiomCrafter(props) {
    const [selectedItems, setSelectedItems] = useState([]);

    let initialTh1 = null;
    let initialTh2 = null;
    if (props.ruleType === AxiomTypes.TYPE_TEMPORAL) {
        initialTh1 = 5;
        initialTh2 = 20;
    }

    let axiomType = "";
    if (props.ruleType === AxiomTypes.TYPE_INTERACTION) {
        axiomType = AxiomTypes.TYPE_INTERACTION;
    }

    if (props.ruleType === AxiomTypes.TYPE_TEMPORAL) {
        axiomType =
            selectedItems.length > 1
                ? AxiomTypes.TYPE_TIME_DISTANCE
                : AxiomTypes.TYPE_DURATION;
    }

    return (
        <div id="ax-crafter-container">
            <div id="ax-crafter-header">
                <span id="header-title">Select items</span>
            </div>
            <div className="axiom-crafter-icons">
                {props.objects.map((key, idx) => {
                    let itemBorder = "none";
                    if (selectedItems.includes(key)) {
                        itemBorder = "2px solid #4D8E7F";
                    }
                    const Icon = Icons.getIcon(pascalCase(key));
                    return (
                        <div
                            className="craft-icon-container"
                            key={idx}
                            style={{ border: itemBorder }}
                            onClick={(ev) => {
                                let new_items = addToSelected(
                                    key,
                                    selectedItems,
                                    props.ruleType,
                                    ev.shiftKey
                                );
                                setSelectedItems(new_items);
                            }}
                        >
                            {Icon && (
                                <Icon
                                    style={{
                                        width: props.config.ic_w,
                                        height: props.config.ic_h,
                                        fill: "#3A2A0D",
                                    }}
                                ></Icon>
                            )}
                            <text
                                style={{
                                    fontSize: 9,
                                    textAlign: "center",
                                    padding: 0,
                                }}
                            >
                                {key}
                            </text>
                        </div>
                    );
                })}
            </div>
            <div id="axiom-done-btn-div">
                <button
                    id="axiom-crafter-done-btn"
                    onClick={() =>
                        props.handleAxiomCreation({
                            events: selectedItems,
                            type: axiomType,
                            th1: initialTh1,
                            th2: initialTh2,
                        })
                    }
                >
                    Done
                </button>
            </div>
        </div>
    );
}

function addToSelected(key, items, ruleType, shiftKey) {
    if (!items.includes(key) || shiftKey) {
        if (ruleType === AxiomTypes.TYPE_TEMPORAL && items.length > 1) {
            // remove the oldest
            items = items.filter((item) => item !== items[0]);
        }
        items = items.concat(key);
    } else {
        items = items.filter((item) => item !== key);
    }

    return items;
}

export default AxiomCrafter;
