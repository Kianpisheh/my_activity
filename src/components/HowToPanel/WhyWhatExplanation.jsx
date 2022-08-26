import AxiomTypes from "../../model/AxiomTypes";
import QueryTrigger from "../../model/QueryTrigger";
import { CircleNum } from "../ResultsPanel/utils";
import { DurationAxiomStat, TimeDistanceAxiomStat, InteractionAxiomStat } from "./WhyNotWhatExplanation";

import { TimeDistanceAxiomStatText } from "./WhyNotWhatExplanation";
import { DurationAxiomStatText } from "./WhyNotWhatExplanation";

function WhyWhatExplanation(props) {

	const { stats, activity, instances, classificationResult, selectedInstancesIdx } = props;
	if (!stats) {
		return;
	}

	const axiom = stats.getAxiom();
	const axiomType = axiom?.getType();
    let selectedInstances = instances.filter((instance,idx) => selectedInstancesIdx["FP"].includes(idx));

	let axiomStatComp = null;
	let axiomStatText = null;
	if (axiomType === AxiomTypes.TYPE_TIME_DISTANCE) {
		axiomStatText = <TimeDistanceAxiomStatText stats={stats}></TimeDistanceAxiomStatText>;
		axiomStatComp = <TimeDistanceAxiomStat stats={stats}
				selectedInstances={selectedInstances}
				axiom={axiom}
				qmenuPos={props.qmenuPos}
				onWhyNotHowTo={props.onWhyNotHowTo}
				onWhyHowTo={props.onWhyHowTo}
                selectedInstancesIdx={selectedInstancesIdx}
				onWhyWhatSelection={props.onWhyWhatSelection}></TimeDistanceAxiomStat>;
	} else if (axiomType === AxiomTypes.TYPE_DURATION) {
        axiomStatText = <DurationAxiomStatText stats={stats}></DurationAxiomStatText>;
		axiomStatComp = <DurationAxiomStat stats={stats}
				selectedInstances={selectedInstances}
				axiom={axiom}
				qmenuPos={props.qmenuPos}
				onWhyNotHowTo={props.onWhyNotHowTo}
				onWhyHowTo={props.onWhyHowTo}
				onWhyWhatSelection={props.onWhyWhatSelection}
                selectedInstancesIdx={selectedInstancesIdx}>
                </DurationAxiomStat>;
	} else if (axiomType === AxiomTypes.TYPE_INTERACTION) {
        axiomStatComp = 
        <InteractionAxiomStat stats={stats}
				selectedInstances={selectedInstances}
				axiom={axiom}
				qmenuPos={props.qmenuPos}
				onWhyNotHowTo={props.onWhyNotHowTo}
				onWhyHowTo={props.onWhyHowTo}
                selectedInstancesIdx={selectedInstancesIdx}
				onWhyWhatSelection={props.onWhyWhatSelection}>
            </InteractionAxiomStat>
    } else {
		return;
	}

	return (
		<div className="stat-container">
			<div className="text-explanation-container">{axiomStatText}</div>
			<div className="stat-axiom-explanation-container" style={{cursor: "pointer"}}>
                {axiomStatComp}
            </div>
			{/* <div
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
			</div> */}
		</div>
	);
}

export default WhyWhatExplanation;