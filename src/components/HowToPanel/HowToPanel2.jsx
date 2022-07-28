import "./HowToPanel2.css";

import WhyNotHowToExplanations from "./WhyNotHowToExplanations";
import WhyNotWhatExplanation from "./WhyNotWhatExplanation";

function HowToPanel2(props) {
	const { whyNotWhat, suggestions } = props;

	let explanationsContent = [];

	if (whyNotWhat) {
		explanationsContent.push(
			<WhyNotWhatExplanation
				stats={whyNotWhat}
				onWhyNotHowTo={props.onWhyNotHowTo}
			></WhyNotWhatExplanation>
		);
	}

	if (suggestions && suggestions.length) {
		explanationsContent.push(
			<WhyNotHowToExplanations
				suggestions={suggestions}
				onWhyHowToAxiomHover={props.onWhyHowToAxiomHover}
			></WhyNotHowToExplanations>
		);
	}

	return <div className="exp-container">{[...explanationsContent]}</div>;
}
export default HowToPanel2;
