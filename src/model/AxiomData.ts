import isEqual from "lodash.isequal";
import AxiomTypes from "./AxiomTypes";

interface IAxiom {
	events: string[];
	type: string;
	th1: number;
	th2: number;
}

class AxiomData {
	events: string[];
	type: string;
	th1: number;
	th2: number;
	opSize: number[]; // size=2; events=[[2,1], 4] -> opSize=[2,1]

	constructor(axiom: IAxiom, opSize: number[] = []) {
		this.events = axiom["events"];
		this.type = axiom["type"];
		this.th1 = axiom["th1"];
		this.th2 = axiom["th2"];
		this.opSize = [...opSize];
		if (opSize.length === 0 && axiom["type"] === AxiomTypes.TYPE_DURATION) {
			this.opSize = [1];
		}
	}

	getType() {
		return this.type;
	}

	flipEvents() {
		if (this.events.length !== 2) {
			return;
		}

		const e2 = this.events[1];
		this.events[1] = this.events[0];
		this.events[0] = e2;
	}

	getEvents() {
		return this.events;
	}

	getOpSize() {
		return this.opSize;
	}

	setEvents(evs: string[]) {
		this.events = [...evs];
	}

	setOpSize(sizes: number[]) {
		this.opSize = [...sizes];
	}

	removeEvent(eventType: string) {
		this.events = this.events.filter((ev) => ev !== eventType);
	}

	getTh1() {
		return this.th1;
	}

	getTh2() {
		return this.th2;
	}

	setTh1(th1: number) {
		this.th1 = th1;
	}

	setTh2(th2: number) {
		this.th2 = th2;
	}

	getAxiomString() {
		if (this.type === AxiomTypes.TYPE_TIME_DISTANCE) {
			return (
				AxiomTypes.TYPE_TIME_DISTANCE +
				":" +
				this.events[0] +
				":" +
				this.events[1] +
				":" +
				this.th1 +
				":" +
				this.th2
			);
		} else if (this.type === AxiomTypes.TYPE_DURATION) {
			return AxiomTypes.TYPE_DURATION + ":" + this.events[0] + ":" + this.th1 + ":" + this.th2;
		} else if (this.type === AxiomTypes.TYPE_INTERACTION) {
			return AxiomTypes.TYPE_INTERACTION + ":" + this.events[0];
		} else if (this.type === AxiomTypes.TYPE_INTERACTION_NEGATION) {
			return AxiomTypes.TYPE_INTERACTION_NEGATION + ":" + this.events[0];
		}
	}

	static axiomFromString(axiomString: string) {
		const { axType, events, th1, th2 } = AxiomData.destrcutAxiomFromString(axiomString);
		const axiom = new AxiomData({
			events: events,
			type: axType,
			th1: th1,
			th2: th2,
		});
		return axiom;
	}

	private subSetEither(arr1: any, arr2: any) {
		let intersect = new Set([...arr1].filter((i) => arr2.includes(i)));
		if (intersect.size === arr1.length || intersect.size === arr2.length) {
			return true;
		}
		return false;
	}

	static destrcutAxiomFromString(axiomString: string) {
		const axiomParts = axiomString.split(":");
		const axType = axiomParts[0];

		let events = [];
		let th1: number;
		let th2: number;
		if (axType === AxiomTypes.TYPE_INTERACTION || axType === AxiomTypes.TYPE_INTERACTION_NEGATION) {
			events.push(axiomParts[1]);
		} else if (axType === AxiomTypes.TYPE_OR_INTERACTION) {
			events = [...axiomParts.slice(1, axiomParts.length)];
		} else if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
			events.push(axiomParts[1]);
			events.push(axiomParts[2]);
			th1 = +axiomParts[3];
			th2 = +axiomParts[4];
		} else if (axType === AxiomTypes.TYPE_DURATION) {
			events.push(axiomParts[1]);
			th1 = +axiomParts[2];
			th2 = +axiomParts[3];
		}

		return { axType: axType, events: events, th1: th1, th2: th2 };
	}

	static isUnique(axioms: AxiomData[], axiomQ: AxiomData) {
		for (const ax of axioms) {
			if (ax.getType() === axiomQ.getType()) {
				if (ax.getType().includes(AxiomTypes.TYPE_TIME_DISTANCE)) {
					if (isEqual(ax.getEvents(), axiomQ.getEvents())) {
						return false;
					}
				}
				if (isEqual(ax.getEvents().sort(), axiomQ.getEvents().sort())) {
					return false;
				}
			}

			if (isEqual(ax, axiomQ)) {
				return false;
			}
		}

		return true;
	}

	static updateTemporalAxiom(axioms: AxiomData[], axiomQ: AxiomData) {
		// precondition: axiomQ is a termporal axiom
		for (const ax of axioms) {
			if (ax.getType() === axiomQ.getType()) {
				if (isEqual(ax.getEvents(), axiomQ.getEvents())) {
					ax.setTh1(axiomQ.getTh1());
					ax.setTh2(axiomQ.getTh2());
				}
			}
		}

		return axioms;
	}

	static removeSubsetOR(axioms: AxiomData[]) {
		let newAxioms: AxiomData[] = [];

		for (let i = 0; i < axioms.length; i++) {
			let ax1 = axioms[i];
			if (ax1.getType() === AxiomTypes.TYPE_OR_INTERACTION) {
				let subset = false;
				let submAxiom = null;
				let axIdx2 = 0;
				for (let j = 0; j < newAxioms.length; j++) {
					let ax2 = newAxioms[j];
					if (ax2.getType() !== AxiomTypes.TYPE_OR_INTERACTION) {
						continue;
					}
					let intersect = new Set([...ax1.getEvents()].filter((i) => ax2.getEvents().includes(i)));
					if (intersect.size === ax1.getEvents().length || intersect.size === ax2.getEvents().length) {
						subset = true;
						axIdx2 = j;
						submAxiom = new AxiomData(
							{
								events: ax2.events,
								th1: ax2.getTh1(),
								th2: ax2.getTh2(),
								type: ax2.getType(),
							},
							ax2.opSize
						);
					}
				}
				if (subset) {
					// replace if the new one is larger
					if (ax1.getEvents().length > submAxiom.getEvents().length) {
						newAxioms[axIdx2] = JSON.parse(JSON.stringify(ax1));
					}
				} else {
					newAxioms.push(ax1);
				}
			} else {
				newAxioms.push(ax1);
			}
		}

		return newAxioms;
	}
}

export default AxiomData;
