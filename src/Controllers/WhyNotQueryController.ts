import Activity from "../model/Activity";
import ActivityInstance from "../model/ActivityInstance";
import { getUnsatisfiedAxioms } from "../components/ResultsPanel/handler";

class WhyNotQueryController {
	static handleWhyNotQuery(
		instances: ActivityInstance[],
		activity: Activity,
		selectedInstancesIdx: { [resType: string]: number[] }
	) {
		return getUnsatisfiedAxioms(instances, selectedInstancesIdx["FN"], activity);
	}
}

export default WhyNotQueryController;
