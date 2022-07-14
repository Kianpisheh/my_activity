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

    let axioms = [];
    if (props.activity != null) {
        axioms = props.activity.getAxioms();
    }

    function handleAxiomCreation(data, ev) {
        setDefiningRule(false);
        props.sendMessage(AxiomTypes.MSG_AXIOM_CREATION_DONE, data);
    }

    var objectList = [];
    if (ruleType === AxiomTypes.TYPE_INTERACTION) {
        objectList = [...Icons.getEventList()];
    } else if (
        ruleType === AxiomTypes.TYPE_TIME_DISTANCE ||
        ruleType === AxiomTypes.TYPE_DURATION
    ) {
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
                            color: "#555555",
                            backgroundColor: "transparent",
                            marginLeft: 0,
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
                        <span
                            style={{
                                fontSize: 13,
                                color: "#555555",
                                fontWeight: 400,
                                display: "flex",
                                marginLeft: "7.5%",
                                width: "110px",
                                height: "100%",
                                marginBottom: "5px"
                            }}
                        >
                            Interaction axioms
                        </span>
                        <div style={{ display: "flex", marginLeft: 10 }}>
                            <button
                                className="add-int-btn" onClick={() => createInteractionAxiom()}>
                                +
                            </button>
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
                            onAddTimeConstraintAxiom={createInteractionAxiom}
                        ></Axiom>
                    </div>
                    <hr id="divider" style={{ marginTop: 13, marginBottom: 13 }} />
                    <div style={{ display: "flex", width: "100%", alignContent: "center", height: "30px" }}>
                        <span
                            style={{
                                fontSize: 13,
                                color: "#555555",
                                fontWeight: 400,
                                display: "flex",
                                marginLeft: "7.5%",
                                width: "110px",
                                marginBottom: "5px"
                            }}
                        >
                            Temporal axioms
                        </span>
                        <div style={{ display: "flex", marginLeft: 10 }}>
                            <button
                                className="add-int-btn" onClick={() => createTimeConstraintAxiom()}>
                                +
                            </button>
                        </div>
                    </div>
                    <div className="temporal-axioms-container">
                        {axioms.slice(1).map((axiom, idx) => (
                            <Axiom
                                idx={idx}
                                key={idx}
                                data={axiom}
                                config={props.config}
                                messageCallback={props.sendMessage}
                                explanation={props.explanation}
                                onAddTimeConstraintAxiom={createTimeConstraintAxiom}
                            ></Axiom>
                        ))}
                    </div>{" "}
                </div>
            </div>
            <div className="axiom-crafter-container">
                {definingRule && (
                    <AxiomCrafter
                        config={props.config}
                        axiomType={ruleType}
                        objects={objectList}
                        handleAxiomCreation={handleAxiomCreation}
                    ></AxiomCrafter>
                )}
            </div>
        </div>
    );
}

export default ActivityAxiomPane;
