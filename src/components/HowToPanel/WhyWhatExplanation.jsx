import AxiomTypes from "../../model/AxiomTypes";
import QueryTrigger from "../../model/QueryTrigger";
import { CircleNum } from "../ResultsPanel/utils";
import { DurationAxiomStat, TimeDistanceAxiomStat } from "./WhyNotWhatExplanation";

import { TimeDistanceAxiomStatText } from "./WhyNotWhatExplanation";
import { DurationAxiomStatText } from "./WhyNotWhatExplanation";
import {InteractionAxiomWhyWhatText} from "./WhyNotWhatExplanation"

function WhyWhatExplanation(props) {

	const { stats, activity, instances, classificationResult, selectedInstancesIdx } = props;
	if (!stats) {
		return;
	}

	const axiom = stats.getAxiom();
	const axiomType = axiom?.getType();

	let axiomStatComp = null;
	let axiomStatText = null;
	if (axiomType === AxiomTypes.TYPE_TIME_DISTANCE) {
		axiomStatText = <TimeDistanceAxiomStatText stats={stats}></TimeDistanceAxiomStatText>;
		axiomStatComp = <TimeDistanceAxiomStat stats={stats} axiom={axiom}></TimeDistanceAxiomStat>;
	} else if (axiomType === AxiomTypes.TYPE_DURATION) {
        axiomStatText = <DurationAxiomStatText stats={stats}></DurationAxiomStatText>;
		axiomStatComp = <DurationAxiomStat stats={stats} axiom={axiom}></DurationAxiomStat>;
	} else if (axiomType === AxiomTypes.TYPE_INTERACTION) {
        //return axiomStatText = <InteractionAxiomWhyWhatText></InteractionAxiomWhyWhatText>;
    } else {
		return;
	}

	return (
		<div className="stat-container">
			<div className="text-explanation-container">{axiomStatText}</div>
			<div className="stat-axiom-explanation-container">{axiomStatComp}</div>
			<div
				id="why-not-what-qmark"
				onClick={(ev) => {
                    if (props.qmenuPos[0] > 0) {
					    props.onWhyHowTo(-1, -1, QueryTrigger.WHY_What);
                    } else {
					    props.onWhyHowTo(ev.pageX, ev.pageY, QueryTrigger.WHY_HOW_TO);
                    }
				}}
			>
				{CircleNum("?")}
			</div>
		</div>
	);
}

export default WhyWhatExplanation;