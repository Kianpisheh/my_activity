import Activity from "../model/Activity";
import ActivityInstance from "../model/ActivityInstance";
import AxiomData from "../model/AxiomData";
import AxiomTypes from "../model/AxiomTypes";
import HowToAxiom from "../model/HowToAxiom";
import { getWhyNotHowToSuggestions } from "../components/HowToPanel/WhyNotSuggestions";
import { getUnsatisfiedAxioms } from "../components/ExplanationPanel/handler";

class WhyNotHowToQueryController {
	static handleWhyNotQuery(
		instances: ActivityInstance[],
		activity: Activity,
		selectedInstancesIdx: { [resType: string]: number[] },
		classificationResult: { [type: string]: any }
	) {
		// let i = 0;
		// let suggestions: HowToAxiom[] = [];
		// for (const [ax, selectedFNs] of Object.entries(unsatisfiedAxioms)) {
		// 	const axiom = AxiomData.axiomFromString(ax);
		// 	if (axiom.getType() === AxiomTypes.TYPE_INTERACTION) {
		// 		i += 1;
		// 		continue;
		// 	}
		// 	suggestions = getWhyNotHowToSuggestions(axiom, i, activity, selectedFNs, classificationResult, instances);
		// 	i += 1;
		// }
	}
}

export default WhyNotHowToQueryController;
