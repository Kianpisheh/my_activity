import AxiomTypes from "../../model/AxiomTypes";
import { DurationAxiomStat, TimeDistanceAxiomStat } from "./WhyNotWhatExplanation";

function WhyWhatExplanation(props) {
	const { stats, instances, selectedInstancesIdx } = props;
	if (!stats) {
		return;
	}

	const axiom = stats.getAxiom();
	const axiomType = axiom?.getType();
	let selectedInstances = instances.filter((instance, idx) => selectedInstancesIdx["FP"].includes(idx));

	let axiomStatComp = null;
	// let axiomStatText = null;
	if (axiomType === AxiomTypes.TYPE_TIME_DISTANCE) {
		// axiomStatText = <TimeDistanceAxiomStatText stats={stats}></TimeDistanceAxiomStatText>;
		axiomStatComp = (
			<TimeDistanceAxiomStat
				stats={stats}
				selectedInstances={selectedInstances}
				axiom={axiom}
				onWhyNotHowTo={props.onWhyNotHowTo}
				onWhyHowTo={props.onWhyHowTo}
				selectedInstancesIdx={selectedInstancesIdx}
				onWhyWhatSelection={props.onWhyWhatSelection}
				onWhyWhatHover={props.onWhyWhatHover}
			></TimeDistanceAxiomStat>
		);
	} else if (axiomType === AxiomTypes.TYPE_DURATION) {
		// axiomStatText = <DurationAxiomStatText stats={stats}></DurationAxiomStatText>;
		axiomStatComp = (
			<DurationAxiomStat
				stats={stats}
				selectedInstances={selectedInstances}
				axiom={axiom}
				onWhyNotHowTo={props.onWhyNotHowTo}
				onWhyHowTo={props.onWhyHowTo}
				onWhyWhatSelection={props.onWhyWhatSelection}
				selectedInstancesIdx={selectedInstancesIdx}
				onWhyWhatHover={props.onWhyWhatHover}
			></DurationAxiomStat>
		);
		// } else if (axiomType === AxiomTypes.TYPE_INTERACTION) {
		// 	axiomStatComp = (
		// 		<InteractionAxiomStat
		// 			stats={stats}
		// 			selectedInstances={selectedInstances}
		// 			axiom={axiom}
		// 			onWhyNotHowTo={props.onWhyNotHowTo}
		// 			onWhyHowTo={props.onWhyHowTo}
		// 			selectedInstancesIdx={selectedInstancesIdx}
		// 			onWhyWhatSelection={props.onWhyWhatSelection}
		// 			onWhyWhatHover={props.onWhyWhatHover}
		// 		></InteractionAxiomStat>
		// 	);
		// } else {
		return;
	}

	return (
		<div className="stat-container">
			{/* <div className="text-explanation-container">{axiomStatText}</div> */}
			<div className="stat-axiom-explanation-container" style={{ cursor: "pointer" }}>
				{axiomStatComp}
			</div>
		</div>
	);
}

export default WhyWhatExplanation;
