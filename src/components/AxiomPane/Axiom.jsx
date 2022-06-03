import "./Axiom.css";

import AxiomTypes from "../../model/AxiomTypes";
import InteractionAxiom from "./InteractionAxiom";
import TimeDistanceInteraction from "./TimeDistanceAxiom";
import DurationAxiom from "./DurationAxiom";

function Axiom(props) {
    let axiomComponent = null;
    let axiomType = props.data.type;
    if (axiomType === AxiomTypes.TYPE_INTERACTION) {
        axiomComponent = <InteractionAxiom data={props.data} idx={props.idx} messageCallback={props.messageCallback}></InteractionAxiom>;
    } else if (axiomType === AxiomTypes.TYPE_TIME_DISTANCE) {
        axiomComponent = (
            <TimeDistanceInteraction
                idx={props.idx}
                data={props.data}
                messageCallback={props.messageCallback}
            ></TimeDistanceInteraction>
        );
    } else if (axiomType === AxiomTypes.TYPE_DURATION) {
        axiomComponent = (
            <DurationAxiom
                idx={props.idx}
                data={props.data}
                messageCallback={props.messageCallback}
            ></DurationAxiom>
        );
    }

    return <div className="Axiom">{axiomComponent}</div>;
}

export default Axiom;
