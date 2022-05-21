import "./InteractionAxiom.css"

import EventIcons from "../Utils/EventIcons";

function InteractionAxiom(props) {
    let events = [];
    if (props.data != null) {
        events = props.data.getEvents();
    } else {
        return;
    }

    console.log(events);
    let interactionIcons = [];
    for (let i = 0; i < events.length; i++) {
        interactionIcons.push(
            <img key={i} width={30} height={30} src={EventIcons.get(events[i])} alt="XX"></img>
        );
    }
    return <div className="interaction-axiom">{[...interactionIcons]}</div>;
}

export default InteractionAxiom;
