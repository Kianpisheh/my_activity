import { useCallback, useState } from "react";
import AxiomManager from "../model/AxiomManager";
import "./ActivityAxiomPane.css";
import Axiom from "./Axiom";
import AxiomCrafter from "./AxiomCrafter";
import EventIcons from "../Utils/EventIcons";
import AxiomTypes from "../model/AxiomTypes";

import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";

function ActivityAxiomPane(props) {
    const [addMenuVisibility, setAddMenuVisibility] = useState("hidden");
    const [definingRule, setDefiningRule] = useState(false);
    const [ruleType, setRuleType] = useState(AxiomTypes.TYPE_INTERACTION);

    const createInteractionAxiom = useCallback(() => {
        setAddMenuVisibility("hidden");
        setDefiningRule(true);
        setRuleType(AxiomTypes.TYPE_INTERACTION);
    }, []);
    const createTimeConstraintAxiom = useCallback(() => {
        setAddMenuVisibility("hidden");
        setDefiningRule(true);
        setRuleType(AxiomTypes.TYPE_TIME_DISTANCE);
    }, []);

    function handleAxiomCreation(data) {
        setDefiningRule(false);
        props.sendMessage(AxiomTypes.MSG_AXIOM_CREATION_DONE, data);
    }

    let axioms = [];
    if (props.activity != null) {
        axioms = props.activity.getAxioms();
    }

    var objectList = [];
    if (ruleType === AxiomTypes.TYPE_INTERACTION) {
        objectList = [...Object.keys(EventIcons.getIcons())];
    } else if (
        ruleType === AxiomTypes.TYPE_TIME_DISTANCE ||
        ruleType === AxiomTypes.TYPE_DURATION
    ) {
        objectList = AxiomManager.findInteractionObjects([...axioms]);
    }

    return (
        <div className="main-container">
            <div className="Axiom-pane" style={{ width: props.width }}>
                <div className="Axioms-container">
                    <EditText
                        className="activtiy-title"
                        value={props.activity.name}
                        onChange={(value) =>
                            props.sendMessage(AxiomTypes.MSG_ACTIVITY_TITLE_UPDATED, {
                                id: props.activity["id"],
                                title: value,
                            })
                        }
                    ></EditText>
                    {axioms.map((axiom, idx) => (
                        <Axiom
                            id={idx}
                            key={idx}
                            data={axiom}
                            messageCallback={props.sendMessage}
                        ></Axiom>
                    ))}
                </div>{" "}
                <div className="add-ui">
                    <div
                        id="dummy-div"
                        className="add-menu"
                        style={{ visibility: "hidden" }}
                    >
                        <text style={{ fontSize: 13 }}>time constraint</text>
                        <div className="h-line"> </div>
                        <text style={{ fontSize: 13 }}>object interaction</text>
                    </div>
                    <button
                        id="add-axiom-btn"
                        onClick={() => setAddMenuVisibility("visible")}
                    >
                        Add
                    </button>
                    <div className="add-menu" style={{ visibility: addMenuVisibility }}>
                        <text
                            style={{ fontSize: 13, cursor: "pointer" }}
                            onClick={() => createTimeConstraintAxiom()}
                        >
                            time constraint
                        </text>
                        <div className="h-line"> </div>
                        <text
                            style={{ fontSize: 13, cursor: "pointer" }}
                            onClick={() => createInteractionAxiom()}
                        >
                            object interaction
                        </text>
                    </div>
                </div>
            </div>
            {definingRule && (
                <AxiomCrafter
                    axiomType={ruleType}
                    objects={objectList}
                    handleAxiomCreation={handleAxiomCreation}
                ></AxiomCrafter>
            )}
        </div>
    );
}

export default ActivityAxiomPane;
