import { useState } from "react";
import AxiomTypes from "../../model/AxiomTypes";
import "./AxiomCrafter.css";
import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/Icons";

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
                    const Icon = Icons.getIcon(pascalCase(key));
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
                            {Icon && <Icon style={{ "width": props.config.ic_w, "height": props.config.ic_h, fill: "#3A2A0D" }}></Icon>}
                            <text style={{ fontSize: 9, textAlign: "center", padding: 0 }}>{key}</text>
                        </li>
                    );
                })}
            </ul>
            <button
                id="axiom-crafter-done-btn"
                onClick={(ev) => props.handleAxiomCreation({ events: selectedItems, type: props.axiomType, th1: initialTh1, th2: initialTh2 }, ev)}
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
