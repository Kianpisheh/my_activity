import ActivityInstanceEvent, { IEvent } from "./ActivityInstanceEvent";
import Activity from "./Activity";
import Constraint from "./Constraint";
import AxiomData from "./AxiomData";
import AxiomTypes from "./AxiomTypes";
import AxiomStat from "./AxiomStats";

export interface IActivityInstance {
	name: string;
	type: string;
	events: IEvent[];
}

class ActivityInstance {
	name: string;
	type: string;
	events: ActivityInstanceEvent[];

	constructor(instanceObj: IActivityInstance) {
		this.name = instanceObj["name"];
		this.type = instanceObj["type"];
		this.events = [];
		instanceObj["events"].forEach((ev) => {
			this.events.push(new ActivityInstanceEvent(ev));
		});
	}

	getType() {
		return this.type;
	}

	setType(type: string) {
		this.type = type;
	}

	getEvents() {
		return this.events;
	}

	setEvents(events: ActivityInstanceEvent[]) {
		this.events = events;
	}

	getTimes() {
		let timestamps: object[] = [];
		this.events.map((ev) => {
			return timestamps.push(ev.getTime());
		});

		return timestamps;
	}

	getEventList(): string[] {
		return this.events.map((ev) => {
			return ev.getType();
		});
	}

	getEventIndividuals(): string[] {
		return this.events.map((ev) => {
			return ev.getName();
		});
	}

	getMaxTime(): number {
		let maxTime = this.events?.[0]?.["endTime"] ?? 0;
		this.events.forEach((ev) => {
			if (ev["endTime"] > maxTime) {
				maxTime = ev["endTime"];
			}
		});
		return (maxTime ??= 0);
	}

	getName(): string {
		return this.name;
	}

	hasEvent(event: string) {
		for (const ev of this.events) {
			if (ev.getType() === event.toLowerCase()) {
				return true;
			}
		}
		return false;
	}

	getStat(axiom: AxiomData) {
		let axiomStat = new AxiomStat(axiom.getEvents(), axiom);

		const axiomType = axiom.getType();

		// time_distance or duratiom axioms
		const axiomEvents: string[] = axiom.getEvents();
		if (axiomType === AxiomTypes.TYPE_TIME_DISTANCE) {
			const eventInstances1 = this.getEvent(axiomEvents[0]);
			const eventInstances2 = this.getEvent(axiomEvents[1]);

			for (let i = 0; i < eventInstances1.length; i++) {
				const duration1 = eventInstances1[i].getEndTime() - eventInstances1[i].getStartTime();
				axiomStat.updateEventDuration(duration1, axiomEvents[0]);
				for (let j = 0; j < eventInstances2.length; j++) {
					const timeDsitance = eventInstances2[j].getStartTime() - eventInstances1[i].getEndTime();
					if (timeDsitance < 0) {
						continue;
					}
					axiomStat.updateTimeDistance(timeDsitance);
					if (j === 0) {
						const duration2 = eventInstances2[j].getEndTime() - eventInstances2[j].getStartTime();
						axiomStat.updateEventDuration(duration2, axiomEvents[1]);
					}
				}
			}
		} else if (AxiomTypes.TYPE_DURATION) {
			const eventInstances = this.getEvent(axiomEvents[0]);
			for (let i = 0; i < eventInstances.length; i++) {
				const duration1 = eventInstances[i].getEndTime() - eventInstances[i].getStartTime();
				axiomStat.updateEventDuration(duration1, axiomEvents[0]);
			}
		}

		return axiomStat;
	}

	notSatisfied(activity: Activity) {
		let actInstanceEvents = this.getEventList();
		let notSatisfiedInteractionAxs: string[] = [];
		let notSatisfiedTemporalAxs = [];

		// first check interaction axioms
		for (const ev of activity.getEvents()) {
			if (!actInstanceEvents.includes(ev.toLocaleLowerCase())) {
				notSatisfiedInteractionAxs.push("interaction:" + ev);
			}
		}

		// now check temporal axioms
		let constraints = activity.getConstraints();
		for (const constraint of constraints) {
			// not satisfied constraint events
			let notSatevents = constraint.events.filter((ev) => notSatisfiedInteractionAxs.includes(ev.toLowerCase()));
			if (notSatevents.length || !this.isConstraintSatisfied(constraint)) {
				if (constraint.type === "time_distance") {
					notSatisfiedTemporalAxs.push(
						"time_distance:" +
							constraint.events[0] +
							":" +
							constraint.events[1] +
							":" +
							constraint.th1 +
							":" +
							constraint.th2
					);
				} else if (constraint.type === "duration") {
					notSatisfiedTemporalAxs.push(
						"duration:" + constraint.events[0] + ":" + constraint.th1 + ":" + constraint.th2
					);
				}
				continue;
			}
		}

		return notSatisfiedInteractionAxs.concat(notSatisfiedTemporalAxs);
	}

	isConstraintSatisfied(constraint: Constraint): boolean {
		const constraintType = constraint.type;
		const th1 = constraint.th1;
		const th2 = constraint.th2;

		if (constraintType === "duration") {
			let eventInstances: ActivityInstanceEvent[] = this.getEvent(constraint.events[0]);
			for (const evInstance of eventInstances) {
				const evDuration = evInstance.getDuration();
				if (evDuration < th2 && evDuration > th1) {
					return true;
				}
			}
		} else if (constraintType === "time_distance") {
			let eventInstances1: ActivityInstanceEvent[] = this.getEvent(constraint.events[0].toLowerCase());
			let eventInstances2: ActivityInstanceEvent[] = this.getEvent(constraint.events[1].toLowerCase());
			for (let i = 0; i < eventInstances1.length; i++) {
				for (let j = 0; j < eventInstances2.length; j++) {
					const timeDsitance = eventInstances2[j].getStartTime() - eventInstances1[i].getEndTime();
					if (timeDsitance < th2 && timeDsitance > th1) {
						return true;
					}
				}
			}
		}

		return false;
	}

	getEvent(evq: string): ActivityInstanceEvent[] {
		let eventList: ActivityInstanceEvent[] = [];
		for (const event of this.events) {
			if (event.getType().toLowerCase() === evq.toLowerCase()) {
				eventList.push(event);
			}
		}
		return eventList;
	}

	isSatisfied(axioms: AxiomData[]) {
		let numSatisfied = 0;
		for (const ax of axioms) {
			const axType = ax.getType();
			const event1 = ax.getEvents()[0];
			const event2 = ax.getEvents()[1];

			// interaction axioms
			if (axType === AxiomTypes.TYPE_INTERACTION) {
				let intEventsNum = 0;
				for (const ev of ax.getEvents()) {
					if (this.hasEvent(ev)) {
						intEventsNum += 1;
					}
				}
				if (intEventsNum === ax.getEvents().length) {
					numSatisfied += 1;
				} else {
					return false;
				}
			}

			// time-distance axiom
			if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
				if (this.hasEvent(event1) && this.hasEvent(event2)) {
					let evInstance1 = this.getEvent(event1.toLowerCase());
					let evInstance2 = this.getEvent(event2.toLowerCase());
					loop1: for (let i = 0; i < evInstance1.length; i++) {
						for (let j = 0; j < evInstance2.length; j++) {
							const timeDsitance = evInstance2[j].getStartTime() - evInstance1[i].getEndTime();
							if (timeDsitance < ax.getTh2() && timeDsitance > ax.getTh1()) {
								numSatisfied += 1;
								break loop1;
							}
						}
					}
				}
			}
			// duration axiom
			if (axType === AxiomTypes.TYPE_DURATION) {
				if (this.hasEvent(event1)) {
					let eventInstances: ActivityInstanceEvent[] = this.getEvent(event1);
					for (const evInstance of eventInstances) {
						const evDuration = evInstance.getDuration();
						if (evDuration <= ax.getTh2() && evDuration >= ax.getTh1()) {
							numSatisfied += 1;
							break;
						}
					}
				}
			}
		}
		return numSatisfied === axioms.length;
	}

	static getNum(activity: string, instances: ActivityInstance[]): number {
		let num = 0;
		for (const instance of instances) {
			if (instance.getType() === activity) {
				num += 1;
			}
		}
		return num;
	}
}

export default ActivityInstance;
