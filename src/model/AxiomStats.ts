import ActivityInstance from "./ActivityInstance";
import AxiomData from "./AxiomData";

class AxiomStat {
	minTimeDistance: number;
	maxTimeDistance: number;
	minDuration1: number;
	maxDuration1: number;
	minDuration2: number;
	maxDuration2: number;
	events: string[];
	axiom: AxiomData;
	numInstances: number;

	constructor(events: string[], axiom: AxiomData) {
		this.events = events;
		this.axiom = axiom;
		this.numInstances = 1;
	}

	setMinTimeDistance(td: number) {
		this.minTimeDistance = td;
	}

	setMaxTimeDistance(td: number) {
		this.maxTimeDistance = td;
	}

	setMinDuration1(d: number) {
		this.minDuration1 = d;
	}

	setMinDuration2(d: number) {
		this.minDuration2 = d;
	}

	setMaxDuration1(d: number) {
		this.maxDuration1 = d;
	}

	setMaxDuration2(d: number) {
		this.maxDuration2 = d;
	}

	getAxiom() {
		return this.axiom;
	}

	updateTimeDistance(td: number) {
		if (!this.maxTimeDistance) {
			this.maxTimeDistance = td;
		} else if (td > this.maxTimeDistance) {
			this.maxTimeDistance = td;
		}

		if (!this.minTimeDistance) {
			this.minTimeDistance = td;
		} else if (td < this.minTimeDistance) {
			this.minTimeDistance = td;
		}
	}

	hasTimeDistance() {
		return this.minTimeDistance && this.maxTimeDistance;
	}

	updateEventDuration(d: number, event: string) {
		if (event === this.events[0]) {
			if (!this.maxDuration1) {
				this.maxDuration1 = d;
			} else if (d > this.maxDuration1) {
				this.maxDuration1 = d;
			}

			if (!this.minDuration1) {
				this.minDuration1 = d;
			} else if (d < this.minDuration1) {
				this.minDuration1 = d;
			}
		} else if (event === this.events[1]) {
			if (!this.maxDuration2) {
				this.maxDuration2 = d;
			} else if (d > this.maxDuration2) {
				this.maxDuration2 = d;
			}

			if (!this.minDuration2) {
				this.minDuration2 = d;
			} else if (d < this.minDuration2) {
				this.minDuration2 = d;
			}
		}
	}

	merge(other: AxiomStat): AxiomStat {
		if (other.events !== this.events) {
			return null;
		}

		let outputAxStat = new AxiomStat(this.events, this.axiom);
		outputAxStat.maxTimeDistance = Math.max(
			this.maxTimeDistance ? this.maxTimeDistance : -Infinity,
			other.maxTimeDistance ? other.maxTimeDistance : -Infinity
		);
		outputAxStat.minTimeDistance = Math.min(
			this.minTimeDistance ? this.minTimeDistance : Infinity,
			other.minTimeDistance ? other.minTimeDistance : Infinity
		);

		outputAxStat.minDuration1 = Math.min(
			this.minDuration1 ? this.minDuration1 : Infinity,
			other.minDuration1 ? other.minDuration1 : Infinity
		);

		outputAxStat.maxDuration1 = Math.max(
			this.maxDuration1 ? this.maxDuration1 : -Infinity,
			other.maxDuration1 ? other.maxDuration1 : -Infinity
		);

		outputAxStat.minDuration2 = Math.min(
			this.minDuration2 ? this.minDuration2 : Infinity,
			other.minDuration2 ? other.minDuration2 : Infinity
		);

		outputAxStat.maxDuration2 = Math.max(
			this.maxDuration2 ? this.maxDuration2 : -Infinity,
			other.maxDuration2 ? other.maxDuration2 : -Infinity
		);

		outputAxStat.numInstances = this.numInstances + other.numInstances;

		return outputAxStat;
	}

	static getAxiomStats(instances: ActivityInstance[], axiom: AxiomData) {
		let stats: AxiomStat = null;

		let i = 0;
		let axiomStat: AxiomStat = new AxiomStat(axiom.events, axiom);
		for (const instance of instances) {
			const stat = instance.getStat(axiom);
			if (i === 0) {
				axiomStat = stat;
			} else {
				axiomStat = axiomStat.merge(stat);
			}
			i += 1;
		}
		stats = axiomStat;

		return stats;
	}
}

export default AxiomStat;
