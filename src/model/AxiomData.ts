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

	constructor(axiom: IAxiom) {
		this.events = axiom["events"];
		this.type = axiom["type"];
		this.th1 = axiom["th1"];
		this.th2 = axiom["th2"];
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

	setEvents(evs: string[]) {
		this.events = [...evs];
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
		const { axType, event1, event2, th1, th2 } = AxiomData.destrcutAxiomFromString(axiomString);
		let events: string[] = [];
		if (axType === AxiomTypes.TYPE_INTERACTION || axType === AxiomTypes.TYPE_INTERACTION_NEGATION) {
			events = [event1];
		}
		if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
			events.push(event2);
		}
		const axiom = new AxiomData({
			events: events,
			type: axType,
			th1: th1,
			th2: th2,
		});
		return axiom;
	}

	static destrcutAxiomFromString(axiomString: string) {
		const axType = axiomString.split(":")[0];
		const event1: string = axiomString.split(":")[1];
		const event2: string = axiomString.split(":")[2];
		let th1: number = +axiomString.split(":")[3];
		let th2: number = +axiomString.split(":")[4]; // axType: time_distance
		if (axType === AxiomTypes.TYPE_DURATION) {
			th1 = +axiomString.split(":")[2];
			th2 = +axiomString.split(":")[3];
		}

		return { axType: axType, event1: event1, event2: event2, th1: th1, th2: th2 };
	}
}

export default AxiomData;
