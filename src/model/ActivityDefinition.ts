import AxiomData from "./AxiomData";

class ActivityDefinition {
	dataset: string;
	activity: string;
	axioms: AxiomData[];

	constructor(dataset: string, activity: string, axiomSet: AxiomData[]) {
		this.dataset = dataset;
		this.activity = activity;
		this.axioms = axiomSet;
	}

	getAxioms() {
		return this.axioms;
	}

	static getAxiomSets(activityDefinitions: ActivityDefinition[], activity: string): AxiomData[] {
		if (activityDefinitions.length === 0) {
			return [];
		}
	}
}

export default ActivityDefinition;
