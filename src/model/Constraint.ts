class Constraint {
	events: string[];
	th1: number;
	th2: number;
	type: string;
	opSize: number[];

	constructor(events_: string[], th1: number, th2: number, type: string, opSize: number[] = []) {
		this.events = events_;
		this.th1 = th1;
		this.th2 = th2;
		this.type = type;
		this.opSize = [...opSize];
	}

	getEvents(): string[] {
		return this.events;
	}

	getType() {
		return this.type;
	}

	getTh2() {
		return this.th2;
	}

	getTh1() {
		return this.th1;
	}

	getOpSize() {
		return this.opSize;
	}
}

export default Constraint;
