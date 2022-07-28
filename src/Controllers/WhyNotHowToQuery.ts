import Activity from "../model/Activity";
import ActivityInstance from "../model/ActivityInstance";
import AxiomData from "../model/AxiomData";
import AxiomTypes from "../model/AxiomTypes";
import HowToAxiom from "../model/HowToAxiom";
import { getWhyNotHowToSuggestions } from "../components/HowToPanel/WhyNotSuggestions";

class WhyNotHowToQueryController {
	static handleWhyNotHowToQuery(
		unsatisfiedAxiom: AxiomData,
		activity: Activity,
		classificationResult: { [type: string]: any },
		instances: ActivityInstance[],
		selectedInstancesIdx: number[]
	) {
		let i = 0;
		let suggestions: HowToAxiom[] = [];
		suggestions = getWhyNotHowToSuggestions(
			unsatisfiedAxiom,
			i,
			activity,
			selectedInstancesIdx,
			classificationResult,
			instances
		);
		return suggestions;
	}
}

export default WhyNotHowToQueryController;
