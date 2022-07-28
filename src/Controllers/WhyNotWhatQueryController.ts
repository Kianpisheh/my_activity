import ActivityInstance from "../model/ActivityInstance";
import AxiomData from "../model/AxiomData";
import AxiomStat from "../model/AxiomStats";

class WhyNotWhatQueryController {
	static handleWhyNotWhatQuery(unsatisfiedAxiom: AxiomData, instances: ActivityInstance[]) {
		let stats = AxiomStat.getAxiomStats(instances, unsatisfiedAxiom);
		return stats;
	}
}

export default WhyNotWhatQueryController;
