import "./HowToPanel2.css";

import WhyNotHowToExplanations from "./WhyNotHowToExplanations";
import WhyNotWhatExplanation from "./WhyNotWhatExplanation";

function HowToPanel2(props) {
	const { whyNotWhat, suggestions } = props;

    let whyNotWhatExplanation = [];

	if (whyNotWhat) {
		whyNotWhatExplanation.push(
			<WhyNotWhatExplanation
				stats={whyNotWhat}
				onWhyNotHowTo={props.onWhyNotHowTo}
                classificationResult={props.classificationResult}
                activity={props.activity}
                instances={props.instances}
                selectedInstancesIdx={props.selectedInstancesIdx}
			></WhyNotWhatExplanation>
		);
	}

    let whyNotHowToExplanation = [];

	if (suggestions && suggestions.length) {
		whyNotHowToExplanation.push(
			<WhyNotHowToExplanations
				suggestions={suggestions}
				onWhyHowToAxiomHover={props.onWhyHowToAxiomHover}
			></WhyNotHowToExplanations>
		);
	}

	return <div className="exp-container">
            {[...whyNotWhatExplanation]}
           {whyNotHowToExplanation.length > 0 && <hr id="exp-divider" style={{ marginTop: 13, marginBottom: 13 }} />}
            {[...whyNotHowToExplanation]}
        </div>;
}
export default HowToPanel2;
