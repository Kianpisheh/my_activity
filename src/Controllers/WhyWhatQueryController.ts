import ActivityInstance from "../model/ActivityInstance";
import AxiomData from "../model/AxiomData";
import AxiomStat from "../model/AxiomStats";

class WhyWhatQueryController {
	static handleWhyWhatQuery(axiom: AxiomData, instances: ActivityInstance[]) {
		let stats = AxiomStat.getAxiomStats(instances, axiom);
		return stats;
	}
}

export default WhyWhatQueryController;
