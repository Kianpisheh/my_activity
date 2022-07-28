import Activity from "../model/Activity";
import ActivityInstance from "../model/ActivityInstance";
import { getUnsatisfiedAxioms } from "../components/ExplanationPanel/handler";

class WhyNotQueryController {
	static handleWhyNotQuery(
		instances: ActivityInstance[],
		activity: Activity,
		selectedInstancesIdx: { [resType: string]: number[] },
		classificationResult: { [type: string]: any }
	) {
		return getUnsatisfiedAxioms(instances, selectedInstancesIdx["FN"], activity);
	}
}

export default WhyNotQueryController;
