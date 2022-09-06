import Activity from "../model/Activity";
import ActivityInstance from "../model/ActivityInstance";
import AxiomData from "../model/AxiomData";
import HowToAxiom from "../model/HowToAxiom";
import { getWhyNotHowToSuggestions } from "../components/HowToPanel/WhyNotSuggestions";
import RuleitemData from "../model/RuleitemData";

class WhyNotHowToQueryController {
	static handleWhyNotHowToQuery(
		unsatisfiedAxiom: AxiomData,
		activity: Activity,
		classificationResult: { [type: string]: any },
		instances: ActivityInstance[],
		selectedInstancesIdx: number[],
		activities: Activity[],
		ruleitems: RuleitemData[]
	) {
		let i = 0;
		let suggestions: HowToAxiom[] = [];
		suggestions = getWhyNotHowToSuggestions(
			unsatisfiedAxiom,
			i,
			activity,
			selectedInstancesIdx,
			classificationResult,
			instances,
			activities,
			ruleitems
		);
		return suggestions;
	}
}

export default WhyNotHowToQueryController;
