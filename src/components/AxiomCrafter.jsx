import { useState } from "react";
import AxiomTypes from "../model/AxiomTypes";
import "./AxiomCrafter.css";
import EventIcons from "../Utils/EventIcons";

function AxiomCrafter(props) {
    const [selectedItems, setSelectedItems] = useState([]);

    let initialTh1 = null;
    let initialTh2 = null;
    if (props.axiomType === AxiomTypes.TYPE_TIME_DISTANCE || props.axiomType === AxiomTypes.TYPE_DURATION) {
        initialTh1 = 5;
        initialTh2 = 20;
    }

    return (
        <div className="axiom-crafter-container">
            <ul>
                {props.objects.map((key, idx) => {
                    let itemBorder = "none";
                    if (selectedItems.includes(key)) {
                        itemBorder = "2px solid #4D8E7F";
                    }
                    return (
                        <li
                            key={idx}
                            style={{ border: itemBorder }}
                            onClick={() => {
                                let new_items = addToSelected(
                                    key,
                                    selectedItems,
                                    props.axiomType
                                );
                                setSelectedItems(new_items);
                            }}
                        >
                            <img
                                src={EventIcons.get(key)}
                                alt="XX"
                                width={20}
                                height={20}
                            ></img>
                            <text style={{ fontSize: 12 }}>{key}</text>
                        </li>
                    );
                })}
            </ul>
            <button
                id="axiom-crafter-done-btn"
                onClick={() => props.handleAxiomCreation({ events: selectedItems, type: props.axiomType, th1: initialTh1, th2: initialTh2 })}
            >
                Done
            </button>
        </div>
    );
}

function addToSelected(key, items, axiomType) {
    if (!items.includes(key)) {
        if ((axiomType === AxiomTypes.TYPE_TIME_DISTANCE) && (items.length > 1)) {
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
