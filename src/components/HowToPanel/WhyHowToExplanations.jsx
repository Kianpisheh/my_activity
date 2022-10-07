import AxiomTypes from "../../model/AxiomTypes";
import {
	DurationAdjustmentAxiom,
	InteractionAdditionAxiom,
	TemporalAdjustmentAxiom,
	InteractionORAdditionAxiom,
} from "./WhyNotHowToExplanations";

function WhyHowToExplanations(props) {
	const { suggestions, onWhyHowToAxiomHover, currentActivity } = props;
	if (!Object.keys(suggestions).length) {
		return;
	}

	let suggestionItems = [];
	let i = 0;
	for (const suggestion of suggestions) {
		const { axiom } = suggestion;
		const suggestionType = suggestion.getType();
		if (suggestionType === "time_contraction") {
			if (axiom.getType() === AxiomTypes.TYPE_DURATION) {
				suggestionItems.push(
					<DurationAdjustmentAxiom
						suggestionId={i}
						suggestion={suggestion}
						onWhyHowToAxiomHover={onWhyHowToAxiomHover}
						timeRemoval={suggestionType === "time_removal"}
						messageCallback={props.messageCallback}
					></DurationAdjustmentAxiom>
				);
			} else if (axiom.getType() === AxiomTypes.TYPE_TIME_DISTANCE) {
				suggestionItems.push(
					<TemporalAdjustmentAxiom
						suggestionId={i}
						suggestion={suggestion}
						onWhyHowToAxiomHover={onWhyHowToAxiomHover}
						timeRemoval={suggestionType === "time_removal"}
						messageCallback={props.messageCallback}
					></TemporalAdjustmentAxiom>
				);
			}
		} else if (suggestionType === "interaction_addition") {
			suggestionItems.push(
				<InteractionAdditionAxiom
					suggestionId={i}
					suggestion={suggestion}
					currentActivity={currentActivity}
					onWhyHowToAxiomHover={onWhyHowToAxiomHover}
					messageCallback={props.messageCallback}
				></InteractionAdditionAxiom>
			);
		} else if (suggestionType === "interaction_or") {
			suggestionItems.push(
				<InteractionORAdditionAxiom
					suggestion={suggestion}
					onWhyHowToAxiomHover={onWhyHowToAxiomHover}
					messageCallback={props.messageCallback}
				></InteractionORAdditionAxiom>
			);
		}
		i += 1;
	}

	return (
		<div className="suggestions-container" style={{ maxHeight: "inherit", boxSizing: "border-box" }}>
			{suggestionItems}
		</div>
	);
}

export default WhyHowToExplanations;
