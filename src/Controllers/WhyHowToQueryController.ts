import Activity from "../model/Activity";
import ActivityInstance from "../model/ActivityInstance";
import AxiomData from "../model/AxiomData";
import HowToAxiom from "../model/HowToAxiom";
import { getWhyHowToSuggestions } from "../components/HowToPanel/WhySuggestions";

class WhyHowToQueryController {
	static handleWhyHowToQuery(
		axiom: AxiomData,
		activity: Activity,
		classificationResult: { [type: string]: any },
		instances: ActivityInstance[],
		selectedInstancesIdx: number[]
	) {
		let i = 0;
		let suggestions: HowToAxiom[] = [];
		suggestions = getWhyHowToSuggestions(selectedInstancesIdx, axiom, i, activity, classificationResult, instances);
		return suggestions;
	}
}

export default WhyHowToQueryController;
