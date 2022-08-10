import "./HowToPanel2.css";

import WhyNotHowToExplanations from "./WhyNotHowToExplanations";
import WhyHowToExplanations from "./WhyHowToExplanations";
import WhyNotWhatExplanation from "./WhyNotWhatExplanation";
import WhyWhatExplanation from "./WhyWhatExplanation";
import WhyExplanation from "./WhyExplanation";
import WhyNotExplanation from "./WhyNotExplanation";
import EventStatExplanation from "./EventStatExplanation";

import SystemMode from "../../model/SystemMode";

function HowToPanel2(props) {
	const {
		whyWhat,
		whyNotWhat,
		whyNotHowTosuggestions,
		whyHowTosuggestions,
		systemMode,
		selectedInstancesIdx,
		instances,
        activity
	} = props;

	let whyExplanation = [];
	if (systemMode === SystemMode.UNSATISFIED_AXIOM) {
		const selectedInstances = instances.filter((instance, idx) =>
			Object.values(selectedInstancesIdx)[0].includes(idx)
		);
		const numInstances = selectedInstances.length;
		whyExplanation.push(<WhyNotExplanation numInstances={numInstances} systemMode={systemMode} activity={activity}></WhyNotExplanation>);
	} else if (systemMode === SystemMode.WHY_ASKED) {
        const selectedInstances = instances.filter((instance, idx) =>
			Object.values(selectedInstancesIdx)[0].includes(idx)
		);
		const numInstances = selectedInstances.length;
		whyExplanation.push(<WhyExplanation numInstances={numInstances} systemMode={systemMode} activity={activity}></WhyExplanation>);
    }

    let x = 0;
    if (props.eventStats && props.eventStats.length) {
        x = <EventStatExplanation stats={props.eventStats} instances={props.instances}></EventStatExplanation>
    }
	let whatExplanation = [];

	if (whyNotWhat) {
		whatExplanation.push(
			<WhyNotWhatExplanation
				stats={whyNotWhat}
				onWhyNotHowTo={props.onWhyNotHowTo}
				classificationResult={props.classificationResult}
				activity={props.activity}
				instances={props.instances}
				selectedInstancesIdx={props.selectedInstancesIdx}
                qmenuPos={props.qmenuPos}
			></WhyNotWhatExplanation>
		);
	} else if (whyWhat) {
		whatExplanation.push(
			<WhyWhatExplanation
				stats={whyWhat}
				onWhyHowTo={props.onWhyHowTo}
				classificationResult={props.classificationResult}
				activity={props.activity}
				instances={props.instances}
				selectedInstancesIdx={props.selectedInstancesIdx}
                qmenuPos={props.qmenuPos}
			></WhyWhatExplanation>
		);
	}

	let suggestions = [];

	if (whyNotHowTosuggestions && whyNotHowTosuggestions.length) {
		suggestions.push(
			<WhyNotHowToExplanations
				suggestions={whyNotHowTosuggestions}
				onWhyHowToAxiomHover={props.onWhyHowToAxiomHover}
			></WhyNotHowToExplanations>
		);
	} else if (whyHowTosuggestions && whyHowTosuggestions.length) {
		suggestions.push(
			<WhyHowToExplanations
				suggestions={whyHowTosuggestions}
				onWhyHowToAxiomHover={props.onWhyHowToAxiomHover}
			></WhyHowToExplanations>
		);
	}

	return (
		<div className="exp-container">
			<div id="exp-title-section">
				<span className="section-title">Explanations</span>
			</div>
			{whatExplanation.length > 0 && (
				<span style={{ fontSize: 22, fontWeight: 700, color: "var(--explanation)" }}>Why?</span>
			)}
			<div className="axiom-explanations-container">{[...whatExplanation]}</div>
			{suggestions.length > 0 && whatExplanation.length > 0 && (
				<hr id="exp-divider" style={{ marginTop: 13, marginBottom: 13 }} />
			)}
			{suggestions.length > 0 && (
				<span style={{ fontSize: 22, fontWeight: 700, color: "var(--explanation)" }}>How?</span>
			)}
			<div className="how-to-explanations-container">{[...suggestions]}</div>
			{whyExplanation.length > 0 && whatExplanation.length === 0 && (
				<span style={{ fontSize: 22, fontWeight: 700, color: "var(--explanation)" }}>Why?</span>
			)}
			{whyExplanation.length > 0 && whatExplanation.length === 0 && (
				<div className="why-explanation-container">{[...whyExplanation]}</div>
			)}
            {x !== 0 && x}
		</div>
	);
}
export default HowToPanel2;
