import "./HowToPanel2.css";

import WhyNotHowToExplanations from "./WhyNotHowToExplanations";

import WhyHowToExplanations from "./WhyHowToExplanations";
import WhyNotWhatExplanation from "./WhyNotWhatExplanation";
import WhyWhatExplanation from "./WhyWhatExplanation";
import WhyExplanation from "./WhyExplanation";
import WhyNotExplanation from "./WhyNotExplanation";
import EventStatExplanation from "./EventStatExplanation";
import NoSuggestions from "./NoSuggestions";

import QueryTrigger from "../../model/QueryTrigger";
import ExpStatus from "../../model/ExpStatus";
import AxiomTypes from "../../model/AxiomTypes";

function HowToPanel2(props) {
	const {
		whyWhat,
		whyNotWhat,
		whyNotHowTosuggestions,
		whyHowTosuggestions,
		selectedInstancesIdx,
		instances,
		activity,
		unsatisfiedAxioms,
		ruleitems,
	} = props;

	let whyExplanation = [];
	if (Object.keys(unsatisfiedAxioms).length !== 0) {
		const selectedInstances = instances.filter((instance, idx) =>
			Object.values(selectedInstancesIdx)[0].includes(idx)
		);
		const numInstances = selectedInstances.length;
		whyExplanation.push(
			<WhyNotExplanation
				queryTrigger={props.queryTrigger}
				onWhyNotWhatQuery={props.onWhyNotWhatQuery}
				onWhyNotHover={props.onWhyNotHover}
				numInstances={numInstances}
				activity={activity}
				onWhyHover={props.onWhyHover}
				unsatisfiedAxioms={unsatisfiedAxioms}
				queriedAxiom={props.queriedAxiom}
				explanationStatus={props.explanationStatus}
				onWhyNotAxiomClick={props.onWhyNotAxiomClick}
				ruleitems={ruleitems}
				messageCallback={props.messageCallback}
			></WhyNotExplanation>
		);
	} else if (
		selectedInstancesIdx["FP"]?.length &&
		(props.whyQueryMode || props.queryTrigger === QueryTrigger.WHY_WHAT)
	) {
		const selectedInstances = instances.filter((instance, idx) => selectedInstancesIdx["FP"].includes(idx));
		const numInstances = selectedInstances.length;
		whyExplanation.push(
			<WhyExplanation
				queryTrigger={props.queryTrigger}
				numInstances={numInstances}
				onWhyNotWhatQuery={props.onWhyNotWhatQuery}
				queriedAxiom={props.queriedAxiom}
				explanationStatus={props.explanationStatus}
				activity={activity}
				onWhyHover={props.onWhyHover}
				messageCallback={props.messageCallback}
			></WhyExplanation>
		);
	}

	let eventInstanceExplanation = null;
	if (props.eventStats && props.eventStats.length) {
		eventInstanceExplanation = (
			<EventStatExplanation
				stats={props.eventStats}
				instances={props.instances}
				messageCallback={props.messageCallback}
				onWhyNotHover={props.onWhyNotHover}
				onTimeSliderChange={props.onTimeSliderChange}
				selectedInstanceEvents={props.selectedInstanceEvents}
				user={props.user}
				dataset={props.dataset}
			></EventStatExplanation>
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
				onWhyWhatHover={props.onWhyWhatHover}
				explanationStatus={props.explanationStatus}
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
				onWhyWhatHover={props.onWhyWhatHover}
				unsatisfiedAxioms={unsatisfiedAxioms}
				explanationStatus={props.explanationStatus}
			></WhyWhatExplanation>
		);
	}

	let suggestions = [];

	if (whyNotHowTosuggestions && whyNotHowTosuggestions.length) {
		suggestions.push(
			<WhyNotHowToExplanations
				suggestions={whyNotHowTosuggestions}
				onWhyHowToAxiomHover={props.onWhyHowToAxiomHover}
				ruleitems={ruleitems}
				messageCallback={props.messageCallback}
				activity={activity}
				dataUser={props.dataset + "-" + props.user}
			></WhyNotHowToExplanations>
		);
	} else if (whyHowTosuggestions && whyHowTosuggestions.length) {
		suggestions.push(
			<WhyHowToExplanations
				suggestions={whyHowTosuggestions}
				onWhyHowToAxiomHover={props.onWhyHowToAxiomHover}
				currentActivity={activity}
				messageCallback={props.messageCallback}
				dataUser={props.dataset + "-" + props.user}
			></WhyHowToExplanations>
		);
	}

	let noSuggestions = false;
	const howStatus =
		props.expStatus === ExpStatus.WHY_NOT_HOW_TO_LIST || props.expStatus === ExpStatus.WHY_HOW_TO_LIST;
	if (suggestions.length === 0 && howStatus) {
		suggestions.push(<NoSuggestions></NoSuggestions>);
		noSuggestions = true;
	}

	return (
		<div
			className="exp-container"
			onClick={() => {
				props.onWhyHover(-1, -1, null);
				props.onWhyWhatHover(-1, -1);
			}}
		>
			<div id="exp-title-section">
				<span className="section-title">Explanations</span>
			</div>
			{whyExplanation.length > 0 && <hr id="exp-divider" style={{ marginTop: 13, marginBottom: 13 }} />}
			{whyExplanation.length > 0 && (
				<span style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, color: "var(--explanation)" }}>
					Why?
				</span>
			)}
			{whyExplanation.length > 0 && (
				<div style={{ display: "flex", width: "85%", justifyContent: "center" }}>
					<div className="why-explanation-container" style={{ marginBottom: 20 }}>
						{[...whyExplanation]}
					</div>
					<div style={{ width: 0 }}>
						<button
							key={0}
							style={{ backgroundColor: "#E26F5F" }}
							className="remove-axiom-btn"
							onClick={() => {
								let message = "";
								if (props.expStatus === ExpStatus.WHY_LIST) {
									message = AxiomTypes.MSG_GO_TO_FP_SELECTED_STATUS;
								} else if (props.expStatus === ExpStatus.WHY_NOT_LIST) {
									message = AxiomTypes.MSG_GO_TO_FN_SELECTED_STATUS;
								}
								props.messageCallback(message, {});
							}}
						>
							X
						</button>
					</div>
				</div>
			)}
			{whyExplanation.length > 0 && <hr id="exp-divider" style={{ marginTop: 13, marginBottom: 13 }} />}
			{whatExplanation.length > 0 && (
				<span style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, color: "var(--explanation)" }}>
					Why?
				</span>
			)}
			{<div className="axiom-explanations-container">{[...whatExplanation]}</div>}
			{suggestions.length > 0 && whatExplanation.length > 0 && (
				<hr id="exp-divider" style={{ marginTop: 13, marginBottom: 13 }} />
			)}
			{suggestions.length > 0 && howStatus && (
				<span style={{ fontSize: 22, fontWeight: 700, color: "var(--explanation)" }}>How?</span>
			)}
			{
				<div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
					<div className="how-to-explanations-container">{[...suggestions]}</div>
					{suggestions.length > 0 && (
						<div style={{ width: 0 }}>
							<button
								key={0}
								style={{ marginLeft: 15, backgroundColor: "#E26F5F" }}
								className="remove-axiom-btn"
								onClick={() => {
									let message = "";
									if (props.expStatus === ExpStatus.WHY_HOW_TO_LIST) {
										message = AxiomTypes.MSG_GO_TO_WHY_LIST_STATUS;
									} else if (props.expStatus === ExpStatus.WHY_NOT_HOW_TO_LIST) {
										message = AxiomTypes.MSG_GO_TO_WHY_NOT_LIST_STATUS;
									}
									props.messageCallback(message, {});
								}}
							>
								X
							</button>
						</div>
					)}
				</div>
			}
			<div className="event-instance-container">{eventInstanceExplanation}</div>
		</div>
	);
}
export default HowToPanel2;
