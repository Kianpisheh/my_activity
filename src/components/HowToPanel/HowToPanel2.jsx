import "./HowToPanel2.css";

import WhyNotHowToExplanations from "./WhyNotHowToExplanations";
import { useState } from "react";

import WhyHowToExplanations from "./WhyHowToExplanations";
import WhyNotWhatExplanation from "./WhyNotWhatExplanation";
import WhyWhatExplanation from "./WhyWhatExplanation";
import WhyExplanation from "./WhyExplanation";
import WhyNotExplanation from "./WhyNotExplanation";
import EventStatExplanation from "./EventStatExplanation";

import QueryTrigger from "../../model/QueryTrigger";
import QuestionMenu from "../QuestionMenu/QuestionMenu";

function HowToPanel2(props) {
	const [selectedWhys, setSelectedWhy] = useState(null);
	const [selectedHows, setSelectedHow] = useState(null);
	const [selectedwhyWhat, setSelectedwhyWhat] = useState(false);

	const {
		whyWhat,
		whyNotWhat,
		whyNotHowTosuggestions,
		whyHowTosuggestions,
		selectedInstancesIdx,
		instances,
		activity,
		queryTrigger,
		unsatisfiedAxioms,
		whyQueryMode,
	} = props;

	let whyExplanation = [];
	if (Object.keys(unsatisfiedAxioms).length !== 0) {
		const selectedInstances = instances.filter((instance, idx) =>
			Object.values(selectedInstancesIdx)[0].includes(idx)
		);
		const numInstances = selectedInstances.length;
		whyExplanation.push(
			<WhyNotExplanation
				qmenuPos={props.qmenuPos}
				queryTrigger={props.queryTrigger}
				onWhyNotWhatQuery={props.onWhyNotWhatQuery}
				onWhyNotNumHover={props.onWhyNotNumHover}
				numInstances={numInstances}
				activity={activity}
				unsatisfiedAxioms={unsatisfiedAxioms}
				selectedWhys={selectedWhys}
				onWhySelection={(axIdx) => {
                    if (selectedWhys === axIdx) {
                        setSelectedWhy(null);
                    } else {
                        setSelectedWhy(axIdx);
                    }
                }}
			></WhyNotExplanation>
		);
	} else if (selectedInstancesIdx["FP"]?.length && (props.whyQueryMode || props.queryTrigger === QueryTrigger.WHY_WHAT)) {
		const selectedInstances = instances.filter((instance, idx) =>
			selectedInstancesIdx["FP"].includes(idx)
		);
		const numInstances = selectedInstances.length;
		whyExplanation.push(
			<WhyExplanation
                qmenuPos={props.qmenuPos}
				queryTrigger={props.queryTrigger}
				numInstances={numInstances}
				onWhyNotWhatQuery={props.onWhyNotWhatQuery}
				activity={activity}
				selectedWhys={selectedWhys}
				onWhySelection={(axIdx) => {
                    if (selectedWhys === axIdx) {
                        setSelectedWhy(null);
                    } else {
                        setSelectedWhy(axIdx);
                    }
                }}
			></WhyExplanation>
		);
	}

	let eventInstanceExplanation = null;
	if (props.eventStats && props.eventStats.length) {
		eventInstanceExplanation = (
			<EventStatExplanation stats={props.eventStats} instances={props.instances}></EventStatExplanation>
		);
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
                onWhyWhatSelection={() => {
                    if (selectedwhyWhat) {
                        setSelectedwhyWhat(false);
                    } else {
                        setSelectedwhyWhat(true);
                    }
                }}
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
                selectedwhyWhat={selectedwhyWhat}
                onWhyWhatSelection={() => {
                    if (selectedwhyWhat) {
                        setSelectedwhyWhat(false);
                    } else {
                        setSelectedwhyWhat(true);
                    }
                }}
			></WhyWhatExplanation>
		);
	}

	let suggestions = [];

	if (whyNotHowTosuggestions && whyNotHowTosuggestions.length) {
		suggestions.push(
			<WhyNotHowToExplanations
				suggestions={whyNotHowTosuggestions}
				onWhyHowToAxiomHover={props.onWhyHowToAxiomHover}
				selectedHows={selectedHows}
				onHowSelection={() => console.log("first")}
			></WhyNotHowToExplanations>
		);
	} else if (whyHowTosuggestions && whyHowTosuggestions.length) {
		suggestions.push(
			<WhyHowToExplanations
				suggestions={whyHowTosuggestions}
				onWhyHowToAxiomHover={props.onWhyHowToAxiomHover}
				selectedHows={selectedHows}
				onHowSelection={() => console.log("first")}
			></WhyHowToExplanations>
		);
	}

	return (
		<div className="exp-container">
			<div id="exp-title-section">
				<span className="section-title">Explanations</span>
			</div>
			{props.queryTrigger !== "" && (
				<div id="question-menu">
					<QuestionMenu
						selectedIdx={props.selectedIdx}
						currentActivity={props.activity}
						onQuery={props.onQuery}
						queryTrigger={props.queryTrigger}
					></QuestionMenu>
				</div>
			)}
            {whyExplanation.length > 0 && <hr id="exp-divider" style={{ marginTop: 13, marginBottom: 13 }} />}
			{whyExplanation.length > 0 && (
				<span style={{ fontSize: 22, fontWeight: 700, color: "var(--explanation)" }}>Why?</span>
			)}
			{whyExplanation.length > 0 && <div className="why-explanation-container" style={{marginBottom: 20}}>{[...whyExplanation]}</div>}
            {whyExplanation.length > 0 && <hr id="exp-divider" style={{ marginTop: 13, marginBottom: 13 }} />}
			{selectedWhys !== null && whatExplanation.length > 0 && (
				<span style={{ fontSize: 22, fontWeight: 700, color: "var(--explanation)" }}>Why?</span>
			)}
			{selectedWhys !== null && <div className="axiom-explanations-container">{[...whatExplanation]}</div>}
			{selectedWhys !== null && suggestions.length > 0 && whatExplanation.length > 0 && (
				<hr id="exp-divider" style={{ marginTop: 13, marginBottom: 13 }} />
			)}
			{selectedWhys !== null && suggestions.length > 0 && (
				<span style={{ fontSize: 22, fontWeight: 700, color: "var(--explanation)" }}>How?</span>
			)}
			{selectedWhys !== null && <div className="how-to-explanations-container">{[...suggestions]}</div>}
			<div className="event-instance-container">{eventInstanceExplanation}</div>
		</div>
	);
}
export default HowToPanel2;
