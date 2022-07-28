import Activity from "../model/Activity";
import ActivityInstance from "../model/ActivityInstance";
import HowToAxiom from "../model/HowToAxiom";
import { getWhyHowToSuggestions } from "../components/HowToPanel/WhySuggestions";

class WhyFPQueryController {
	static handleWhyQuery(
		instances: ActivityInstance[],
		activity: Activity,
		selectedInstancesIdx: { [resType: string]: number[] },
		classificationResult: { [type: string]: any }
	) {
		const axioms = activity.getAxioms();
		let suggestions: HowToAxiom[] = [];
		suggestions = getWhyHowToSuggestions(
			selectedInstancesIdx["FP"],
			axioms[1],
			1,
			activity,
			classificationResult,
			instances
		);
		return suggestions;
	}
}

export default WhyFPQueryController;
