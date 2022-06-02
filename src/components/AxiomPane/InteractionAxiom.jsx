import { useContext } from "react";

import "./InteractionAxiom.css"

import EventIcons from "../../Utils/EventIcons";
import WhyAxiomIdsContext from "../../WhyAxiomIdsContext";


function InteractionAxiom(props) {
    let events = [];
    const whyIds = useContext(WhyAxiomIdsContext);

    if (props.data != null) {
        events = props.data.getEvents();
    } else {
        return;
    }



    let interactionIcons = [];
    for (let i = 0; i < events.length; i++) {
        interactionIcons.push(
            <img key={i} width={30} height={30} src={EventIcons.get(events[i])} alt="XX"></img>
        );
    }

    let divStyle = {}
    if (whyIds.includes(props.id)) {
        divStyle = { borderColor: "#ADCEE8", border: "1px", borderStyle: "solid", boxShadow: "0px 0px 4px 4px #2C87DB", opacity: 0.7 }
    }

    return <div className="interaction-axiom" style={divStyle}>{[...interactionIcons]}</div>;
}

export default InteractionAxiom;
