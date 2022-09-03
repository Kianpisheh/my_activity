import AxiomTypes from "./AxiomTypes";
import AxiomData from "./AxiomData";

interface IProps {
	[key: string]: any;
}

class AxiomManager {
	static createAxiom(current_axioms: AxiomData[], props: IProps) {
		let newAxioms = [...current_axioms];

		newAxioms.push(
			new AxiomData({
				events: props["events"],
				type: props["type"],
				th1: props["th1"],
				th2: props["th2"],
			})
		);
		return newAxioms;
	}

	static findInteractionObjects(axioms: AxiomData[]) {
		let interactionAxioms: string[] = [];
		for (let i = 0; i < axioms?.length; i++) {
			if (axioms?.[i]?.getType() === AxiomTypes.TYPE_INTERACTION) {
				let l = axioms?.[i]?.getEvents()?.length ?? 0;
				for (let j = 0; j < l; j++) {
					let e = axioms?.[i]?.getEvents()[j];
					if (e && !interactionAxioms.includes(e)) {
						interactionAxioms.push(e);
					}
				}
			}
		}

		return interactionAxioms;
	}

	static updateTimeConstraint(idx: number, axioms: AxiomData[], time: number, type: string) {
		let newAxioms = [...axioms];

		if (type === "more than") {
			let th2: number = newAxioms?.[idx]?.getTh2() ?? -1;
			if (time < th2 || th2 === -1) {
				newAxioms?.[idx]?.setTh1(time);
			}
		} else if (type === "less than") {
			let th1: number = newAxioms?.[idx]?.getTh1() ?? -1;
			if (time > th1) {
				newAxioms?.[idx]?.setTh2(time);
			}
		}

		return newAxioms;
	}

	static updateTimeConstraintStatus(idx: number, axioms: AxiomData[], active: boolean, type: string) {
		let newAxioms = [...axioms];

		if (active) {
			if (type === "more than") {
				newAxioms?.[idx]?.setTh1(1);
			} else if (type === "less than") {
				let th1: number = newAxioms?.[idx]?.getTh1() ?? -1;
				let th2 = th1 === -1 ? 20 : th1 + 10;
				newAxioms?.[idx]?.setTh2(th2);
			}
		} else {
			if (type === "more than") {
				newAxioms?.[idx]?.setTh1(-1);
			} else if (type === "less than") {
				newAxioms?.[idx]?.setTh2(-1);
			}
		}
		return newAxioms;
	}

	static removeObjectInteraction(axiomIdx: number, eventType: string, axioms: AxiomData[]): AxiomData[] {
		let newAxioms = [...axioms];

		let toRemove: number[] = [];
		newAxioms.forEach((axiom, idx) => {
			if (axiom.getEvents().includes(eventType)) {
				if (axiom.getType() === AxiomTypes.TYPE_INTERACTION) {
					newAxioms?.[idx]?.removeEvent(eventType);
				} else if (
					axiom.getType() === AxiomTypes.TYPE_DURATION ||
					axiom.getType() === AxiomTypes.TYPE_TIME_DISTANCE
				) {
					toRemove.push(idx);
				}
			}
		});

		// remove time constraint axioms
		newAxioms = newAxioms.filter((axiom, idx) => !toRemove.includes(idx));

		return newAxioms;
	}

	static removeObjectInteractionExclusion(axiomIdx: number, eventType: string, axioms: AxiomData[]): AxiomData[] {
		let newAxioms = [...axioms];
		newAxioms.forEach((axiom, idx) => {
			if (axiom.getEvents().includes(eventType)) {
				if (axiom.getType() === AxiomTypes.TYPE_INTERACTION_NEGATION) {
					newAxioms?.[idx]?.removeEvent(eventType);
				}
			}
		});

		return newAxioms;
	}
}

export default AxiomManager;
