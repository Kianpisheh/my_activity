import { useCallback, useState } from "react";
import AxiomManager from "../../model/AxiomManager";
import "./ActivityAxiomPane.css";
import Axiom from "./Axiom";
import AxiomCrafter from "./AxiomCrafter";
import AxiomTypes from "../../model/AxiomTypes";

import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import Icons from "../../icons/Icons";

function ActivityAxiomPane(props) {
    const [definingRule, setDefiningRule] = useState(false);
    const [ruleType, setRuleType] = useState(AxiomTypes.TYPE_INTERACTION);

    // const createInteractionAxiom = useCallback(() => {
    //     setDefiningRule(true);
    //     setRuleType(AxiomTypes.TYPE_INTERACTION);
    // }, []);
    // const createTimeConstraintAxiom = useCallback((axType) => {
    //     setDefiningRule(true);
    //     if (axType !== "") {
    //         setRuleType(axType);
    //     }
    // }, []);

    let axioms = [];
    if (props.activity != null) {
        axioms = props.activity.getAxioms();
    }

    function handleAxiomCreation(data) {
        setDefiningRule(false);
        setRuleType(data.type);
        props.sendMessage(AxiomTypes.MSG_AXIOM_CREATION_DONE, data);
    }

    var objectList = [];
    if (ruleType === AxiomTypes.TYPE_INTERACTION) {
        objectList = [...Icons.getEventList()];
    } else if (
        ruleType === AxiomTypes.TYPE_TEMPORAL) {
        objectList = AxiomManager.findInteractionObjects([...axioms]);
    }

    return (
        <div className="ax-container">
            <div className="main-container">
                <div
                    id="title-div"
                    onBlur={() =>
                        props.sendMessage(AxiomTypes.MSG_TIME_CONSTRAINT_UPDATED, {
                            id: props.activity["id"],
                            title: "value",
                        })
                    }
                >
                    <EditText
                        className="activtiy-title"
                        value={props.activity.name}
                        style={{
                            fontSize: 13,
                            fontWeight: "600",
                            color: "#6a603f",
                            backgroundColor: "transparent",
                            marginLeft: 0,
                            marginTop: 0,
                            padding: 0,
                        }}
                        onChange={(value) =>
                            props.sendMessage(
                                AxiomTypes.MSG_ACTIVITY_TITLE_UPDATING,
                                {
                                    id: props.activity["id"],
                                    title: value,
                                }
                            )
                        }
                    ></EditText>
                </div>
                <div className="Axiom-pane">
                    <div style={{
                        display: "flex", width: "100%", alignContent: "center", height: "30px"
                    }}>
                        <span className="sub-section-title">Interaction axioms</span>
                        <div style={{ display: "flex", marginLeft: 10 }}>
                            <button className="add-int-btn" onClick={() => { setRuleType(AxiomTypes.TYPE_INTERACTION); setDefiningRule(true); }}>+</button>
                        </div>
                    </div>
                    <div className="interaction-axioms-container">
                        <Axiom
                            idx={0}
                            key={0}
                            data={axioms[0]}
                            config={props.config}
                            messageCallback={props.sendMessage}
                            explanation={props.explanation}
                        ></Axiom>
                    </div>
                    <hr id="divider" style={{ marginTop: 13, marginBottom: 13 }} />
                    <div style={{ display: "flex", width: "100%", alignContent: "center", height: "30px" }}>
                        <span className="sub-section-title">Temporal axioms</span>
                        <div style={{ display: "flex", marginLeft: 10 }}>
                            <button
                                className="add-int-btn" onClick={() => { setRuleType(AxiomTypes.TYPE_TEMPORAL); setDefiningRule(true) }}>
                                +
                            </button>
                        </div>
                    </div>
                    <div className="temporal-axioms-container">
                        {axioms.slice(1).map((axiom, idx) => (
                            <Axiom
                                idx={idx + 1}
                                key={idx + 1}
                                data={axiom}
                                config={props.config}
                                messageCallback={props.sendMessage}
                                explanation={props.explanation}
                            ></Axiom>
                        ))}
                    </div>{" "}
                </div>
            </div>
            <div className="axiom-crafter-container">
                {definingRule && (
                    <AxiomCrafter
                        config={props.config}
                        objects={objectList}
                        handleAxiomCreation={handleAxiomCreation}
                        ruleType={ruleType}
                    ></AxiomCrafter>
                )}
            </div>
        </div>
    );
}

export default ActivityAxiomPane;
