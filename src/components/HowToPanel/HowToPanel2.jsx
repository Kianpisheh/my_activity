import "./HowToPanel2.css";

import WhyNotHowToExplanations from "./WhyNotHowToExplanations";
import WhyHowToExplanations from "./WhyHowToExplanations";
import WhyNotWhatExplanation from "./WhyNotWhatExplanation";
import WhyWhatExplanation from "./WhyWhatExplanation";

function HowToPanel2(props) {
	const {whyWhat, whyNotWhat, whyNotHowTosuggestions, whyHowTosuggestions } = props;

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

	return <div className="exp-container">
        <div className="title-section">
            <span className="section-title">Explanations</span>
        </div>
            <div className="axiom-explanations-container">
                {[...whatExplanation]}
            </div>
           {suggestions.length > 0 && <hr id="exp-divider" style={{ marginTop: 13, marginBottom: 13 }} />}
           <div className="how-to-explanations-container">
                {[...suggestions]}
            </div>
        </div>;
}
export default HowToPanel2;
