import AxiomData from "./AxiomData";

class HowToAxiom {
	type: string;
	axiom: AxiomData;
	axIdx: number;
	suggestedAxiomData: number[] | any;
	policy: string;
	newFPs: { [activity: string]: number[] };
	newTPs: { [activity: string]: number[] };

	constructor(
		type: string,
		axiom: AxiomData,
		axIdx: number,
		data: any,
		policy: string,
		newTPs: { [activity: string]: number[] },
		newFPs: { [activity: string]: number[] }
	) {
		this.type = type;
		this.axiom = axiom;
		this.axIdx = axIdx;
		this.suggestedAxiomData = data;
		this.policy = policy;
		this.newFPs = newFPs;
		this.newTPs = newTPs;
	}

	getType() {
		return this.type;
	}

	getItems() {
		this.axiom.getEvents();
	}

	getAxiomData() {
		return this.suggestedAxiomData;
	}
}

export default HowToAxiom;
