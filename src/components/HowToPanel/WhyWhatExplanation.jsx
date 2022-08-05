import AxiomTypes from "../../model/AxiomTypes";
import { CircleNum } from "../ResultsPanel/utils";
import { DurationAxiomStat, TimeDistanceAxiomStat } from "./WhyNotWhatExplanation";
import WhyHowToQueryController from "../../Controllers/WhyHowToQueryController"

function WhyWhatExplanation(props) {

	const { stats, activity, instances, classificationResult, selectedInstancesIdx } = props;
	if (!stats) {
		return;
	}

	const axiom = stats.getAxiom();
	const axiomType = axiom?.getType();

	let axiomStatComp = null;
	if (axiomType === AxiomTypes.TYPE_TIME_DISTANCE) {
		axiomStatComp = <TimeDistanceAxiomStat stats={stats} axiom={axiom}></TimeDistanceAxiomStat>;
	} else if (axiomType === AxiomTypes.TYPE_DURATION) {
		axiomStatComp = <DurationAxiomStat stats={stats} axiom={axiom}></DurationAxiomStat>;
	} else {
		return;
	}

	return (
		<div className="stat-container">
			{axiomStatComp}
			<div
				id="why-not-what-qmark"
				onClick={(ev) => {
					props.onWhyHowTo(ev.pageX, ev.pageY);
				}}
			>
				{CircleNum("?")}
			</div>
		</div>
	);
}

export default WhyWhatExplanation;