import "./InteractionAxiom.css"

import ImagesObject from "./ImagesObject";

function InteractionAxiom(props) {
    let events = props.data.events;
    let interactionIcons = [];
    for (let i = 0; i < events.length; i++) {
        interactionIcons.push(
            <img key={i} width={30} height={30} src={ImagesObject[events[i]]} alt="XX"></img>
        );
    }
    return <div className="interaction-axiom">{[...interactionIcons]}</div>;
}

export default InteractionAxiom;
