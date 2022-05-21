import AxiomTypes from "./AxiomTypes";
import AxiomData from "./AxiomData";

class AxiomManager {
	static createAxiom(current_axioms, props) {
		let new_axioms = [...current_axioms];
		new_axioms.push(
			new AxiomData({
				events: props.events,
				type: props.type,
				th1: props.th1,
				th2: props.th2
			})
		);
		return new_axioms;
	}

	static findInteractionObjects(axioms) {
		let interactionAxioms = [];
		for (let i = 0; i < axioms.length; i++) {
			if (axioms[i].getType() === AxiomTypes.TYPE_INTERACTION) {
				for (let j = 0; j < axioms[i].getEvents().length; j++) {
					let e = axioms[i].getEvents()[j];
					if (!interactionAxioms.includes(e)) {
						interactionAxioms.push(e);
					}
				}
			}
		}

		return interactionAxioms;
	}

	static updateTimeConstraint(idx, axioms, time, type) {
		let new_axioms = [...axioms];

		if (type === "more than") {
			if (time < new_axioms[idx].getTh2()) {
				new_axioms[idx].setTh1(time);
			}
		} else if (type === "less than") {
			if (time > new_axioms[idx].getTh1()) {
				new_axioms[idx].setTh2(time);
			}
		}

		return new_axioms;
	}

	static updateTimeConstraintStatus(idx, axioms, active, type, time) {
		let new_axioms = [...axioms];

		if (active) {
			if (type === "more than") {
				new_axioms[idx].setTh1(1);
			} else if (type === "less than") {
				let th2 = new_axioms[idx].getTh1() === null ? 20 : new_axioms[idx].getTh1() + 10;
				new_axioms[idx].setTh2(th2);
			}
		} else {
			if (type === "more than") {
				new_axioms[idx].setTh1(null);
			} else if (type === "less than") {
				new_axioms[idx].setTh2(null);
			}
		}
		return new_axioms;
	}
}

export default AxiomManager;
