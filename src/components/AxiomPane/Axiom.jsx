import "./Axiom.css";

import AxiomTypes from "../../model/AxiomTypes";
import InteractionAxiom from "./InteractionAxiom";
import TimeDistanceInteraction from "./TimeDistanceAxiom";
import DurationAxiom from "./DurationAxiom";
import InteractionORAxiom from "./InteractionORAxiom";

function Axiom(props) {
    let axiomComponent = null;
    let axiomType = props.data.type;
    if (axiomType === AxiomTypes.TYPE_INTERACTION) {
        axiomComponent = (
            <InteractionAxiom
                data={props.data}
                idx={props.idx}
                config={props.config}
                messageCallback={props.messageCallback}
                explanation={props.explanation}
            ></InteractionAxiom>
        );

    } else if (axiomType === AxiomTypes.TYPE_OR_INTERACTION) {
        axiomComponent = (
            <InteractionORAxiom
                data={props.data}
                idx={props.idx}
                config={props.config}
                messageCallback={props.messageCallback}
                explanation={props.explanation}
            ></InteractionORAxiom>
        );

    } else if (axiomType === AxiomTypes.TYPE_TIME_DISTANCE) {
        axiomComponent = (
            <TimeDistanceInteraction
                idx={props.idx}
                data={props.data}
                config={props.config}
                messageCallback={props.messageCallback}
                explanation={props.explanation}
                onAddTimeConstraintAxiom={props.onAddTimeConstraintAxiom}
            ></TimeDistanceInteraction>
        );
    } else if (axiomType === AxiomTypes.TYPE_DURATION) {
        axiomComponent = (
            <DurationAxiom
                idx={props.idx}
                data={props.data}
                config={props.config}
                messageCallback={props.messageCallback}
                explanation={props.explanation}
            ></DurationAxiom>
        );
    }

    return <div className="Axiom">{axiomComponent}</div>;
}

export default Axiom;

//<ORAxiom data=[e1, e2]></ORAxiom>
