import AxiomData from "./AxiomData";

class HowToAxiom {
	type: string;
	axiom: AxiomData;
	axIdx: number;
	suggestedAxiomData: number[] | any;
	policy: string;
	newFPs: number[];
	newTPs: number[];

	constructor(
		type: string,
		axiom: AxiomData,
		axIdx: number,
		data: any,
		policy: string,
		newTPs: number[],
		newFPs: number[]
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
