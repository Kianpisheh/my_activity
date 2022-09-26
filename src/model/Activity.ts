import ActivityInstance from "./ActivityInstance";
import AxiomData from "./AxiomData";
import AxiomTypes from "./AxiomTypes";
import Constraint from "./Constraint";

interface IActivityObj {
	name: string;
	events: string[];
	excludedEvents: string[];
	constraints: Constraint[];
	id: number;
	eventORList: string[][];
}

class Activity {
	name: string;
	events: string[];
	excludedEvents: string[];
	constraints: Constraint[];
	id: number;
	eventORList: string[][];

	constructor(activityObj: IActivityObj) {
		this.name = activityObj["name"];
		this.events = activityObj["events"];
		this.excludedEvents = activityObj["excludedEvents"];
		this.constraints = activityObj["constraints"];
		this.id = activityObj["id"];
		this.eventORList = [];
		if (activityObj["eventORList"] && activityObj["eventORList"].length) {
			const OREvents = this.removeRedundantOREvents(activityObj["eventORList"]);
			this.eventORList = OREvents ?? [];
		}
	}

	addEventOR(events: string[]) {
		if (this.notInEventORList(events)) {
			this.eventORList.push(events);
		}
	}

	getEventORList() {
		return this.eventORList;
	}

	notInEventORList(events: string[]): boolean {
		for (let i = 0; i < this.eventORList.length; i++) {
			if (this.arraysAreEqual(this.eventORList[i], events)) {
				return false;
			}
		}

		return true;
	}

	getAxiomNum() {
		return this.events.length + this.constraints.length + this.excludedEvents.length;
	}

	getID() {
		return this.id;
	}

	getName() {
		return this.name;
	}

	setName(name: string) {
		this.name = name;
	}

	getEvents() {
		return this.events;
	}

	getExcludedEvents() {
		return this.excludedEvents;
	}

	getConstraints() {
		return this.constraints;
	}

	getTimeTiedEvents() {
		let evs: string[] = [];
		for (const constraint of this.constraints) {
			evs = evs.concat(constraint.events);
		}
		return [...new Set(evs)];
	}

	getAxioms(): AxiomData[] {
		let axioms: AxiomData[] = [];

		let interactionOREvents = this.eventORList.flat();
		let singleEventInteraction: string[] = [];
		this.events.forEach((ev) => {
			if (!interactionOREvents.includes(ev)) {
				singleEventInteraction.push(ev);
			}
		});

		// the interaction axioms
		axioms.push(
			new AxiomData({
				events: this.events,
				type: AxiomTypes.TYPE_INTERACTION,
				th1: -1,
				th2: -1,
			})
		);

		// the negation interaction axioms
		if (this.excludedEvents.length) {
			axioms.push(
				new AxiomData({
					events: this.excludedEvents,
					type: AxiomTypes.TYPE_INTERACTION_NEGATION,
					th1: -1,
					th2: -1,
				})
			);
		}

		// ORed events axioms
		if (this.eventORList.length) {
			for (const evPair of this.eventORList) {
				axioms.push(
					new AxiomData({
						events: [...evPair],
						type: AxiomTypes.TYPE_OR_INTERACTION,
						th1: -1,
						th2: -1,
					})
				);
			}
		}

		// temporal axioms
		this.constraints.forEach((constraint) => {
			axioms.push(
				new AxiomData(
					{
						events: constraint["events"],
						type: constraint["type"],
						th1: constraint["th1"],
						th2: constraint["th2"],
					},
					constraint.opSize
				)
			);
		});

		return axioms;
	}

	hasNegation() {
		return this.excludedEvents.length > 0;
	}

	hasORInteraction() {
		return this.eventORList.length > 0;
	}

	updateAxioms(newAxioms: AxiomData[]) {
		let newEvents: string[] = [];
		let newExcludedEvents: string[] = [];
		let newEventORList: string[][] = [];
		let newConstraints: Constraint[] = [];

		newAxioms.forEach((axiom) => {
			const axType = axiom["type"];
			if (axType === AxiomTypes.TYPE_INTERACTION) {
				newEvents = newEvents.concat(axiom["events"]);
				newEvents = newEvents.filter((ev) => !ev.includes("EventGroup"));
			} else if (axType === AxiomTypes.TYPE_INTERACTION_NEGATION) {
				newExcludedEvents = newExcludedEvents.concat(axiom["events"]);
			} else if (axType === AxiomTypes.TYPE_OR_INTERACTION) {
				newEventORList.push(axiom["events"]);
			} else if (
				axiom["type"].includes(AxiomTypes.TYPE_DURATION) ||
				axiom["type"].includes(AxiomTypes.TYPE_TIME_DISTANCE)
			) {
				let constraint = new Constraint(
					axiom["events"],
					axiom["th1"],
					axiom["th2"],
					axiom["type"],
					axiom["opSize"]
				);
				newConstraints.push(constraint);
			}
		});

		// remove OR Interaction events from regular events
		newEvents = newEvents.filter((newEv) => !newEventORList.flat().includes(newEv));

		// removing redundant axioms
		let newEventsSet = new Set(newEvents);
		let newExcludedEventsSet = new Set(newExcludedEvents);
		newEventORList = this.removeRedundantOREvents(newEventORList);

		this.events = Array.from(newEventsSet);
		this.excludedEvents = Array.from(newExcludedEventsSet);
		this.eventORList = [...newEventORList];
		this.constraints = [...newConstraints];
	}

	getStartIdx(axiomType: string) {
		if (axiomType === AxiomTypes.TYPE_OR_INTERACTION) {
			if (this.eventORList.length) {
				return 1 + Number(this.excludedEvents.length > 0);
			}
		} else if (axiomType === AxiomTypes.TYPE_TEMPORAL) {
			if (this.constraints.length) {
				return 1 + Number(this.excludedEvents.length > 0) + this.eventORList.length;
			}
		}

		return null;
	}

	getLastIdx(axiomType: string) {
		if (axiomType === AxiomTypes.TYPE_OR_INTERACTION) {
			return 1 + Number(this.excludedEvents.length > 0) + this.eventORList.length;
		} else if (axiomType === AxiomTypes.TYPE_TEMPORAL) {
			return 1 + Number(this.excludedEvents.length > 0) + this.eventORList.length + this.constraints.length;
		}
	}

	static getLastIdx2(axioms: AxiomData[], axiomType: string) {
		let eventORListNum = 0;
		let excludedEventListNum = 0;
		let constraintsNum = 0;
		for (const ax of axioms) {
			if (ax.type === AxiomTypes.TYPE_OR_INTERACTION) {
				eventORListNum += 1;
			} else if (
				ax.type === AxiomTypes.TYPE_OR_TIME_DISTANCE ||
				ax.type === AxiomTypes.TYPE_OR_DURATION ||
				ax.type === AxiomTypes.TYPE_TIME_DISTANCE ||
				ax.type === AxiomTypes.TYPE_DURATION
			) {
				constraintsNum += 1;
			} else if (ax.type === AxiomTypes.TYPE_INTERACTION_NEGATION) {
				excludedEventListNum += 1;
			}
		}

		if (axiomType === AxiomTypes.TYPE_OR_INTERACTION) {
			return 1 + Number(excludedEventListNum > 0) + eventORListNum;
		} else if (axiomType === AxiomTypes.TYPE_TEMPORAL) {
			return 1 + Number(excludedEventListNum > 0) + eventORListNum + constraintsNum;
		}
	}

	static getStartIdx2(axioms: AxiomData[], axiomType: string) {
		let eventORListNum = 0;
		let excludedEventListNum = 0;
		let constraintsNum = 0;
		for (const ax of axioms) {
			if (ax.type === AxiomTypes.TYPE_OR_INTERACTION) {
				eventORListNum += 1;
			} else if (
				ax.type === AxiomTypes.TYPE_OR_TIME_DISTANCE ||
				ax.type === AxiomTypes.TYPE_OR_DURATION ||
				ax.type === AxiomTypes.TYPE_TIME_DISTANCE ||
				ax.type === AxiomTypes.TYPE_DURATION
			) {
				constraintsNum += 1;
			} else if (ax.type === AxiomTypes.TYPE_INTERACTION_NEGATION) {
				excludedEventListNum += 1;
			}
		}

		if (axiomType === AxiomTypes.TYPE_OR_INTERACTION) {
			if (eventORListNum) {
				return 1 + Number(excludedEventListNum > 0);
			}
		} else if (axiomType === AxiomTypes.TYPE_TEMPORAL) {
			if (constraintsNum) {
				return 1 + Number(excludedEventListNum > 0) + eventORListNum;
			}
		}

		return null;
	}

	private removeRedundantOREvents(eventsList: string[][]) {
		let newEventsList: string[][] = [];
		for (let i = 0; i < eventsList.length; i++) {
			let unique = true;
			for (let j = 0; j < newEventsList.length; j++) {
				if (this.subSetEither(eventsList[i], newEventsList[j])) {
					unique = false;
					if (eventsList[i].length > newEventsList[j].length) {
						newEventsList[j] = [...eventsList[i]];
					}
				}
			}
			if (unique) {
				newEventsList.push(eventsList[i]);
			}
		}

		return newEventsList;
	}

	private subSetEither(arr1: any, arr2: any) {
		let intersect = new Set([...arr1].filter((i) => arr2.includes(i)));
		if (intersect.size === arr1.length || intersect.size === arr2.length) {
			return true;
		}
		return false;
	}

	// static methods
	static getUniqueID(activities: Activity[]) {
		let idsList: number[] = [];
		activities.forEach((activtiy) => {
			idsList.push(activtiy["id"]);
		});
		let ids = new Int32Array(idsList);
		ids = ids.sort();
		if (!ids || !ids.length) {
			return 100;
		}
		return ids?.[ids.length - 1] + 1;
	}

	static getUniqueName(activities: Activity[], candidateName: string): string {
		let newName: string = candidateName;
		let maxIdx: number = 0;
		let duplicate: boolean = false;
		activities.forEach((activity) => {
			let activityName: string = activity.getName();
			if (
				candidateName === activityName ||
				candidateName === activityName.substring(0, activityName.length - 3)
			) {
				duplicate = true;
				let nameIdx = parseInt(activityName.charAt(activityName.length - 1));
				if (!isNaN(nameIdx)) {
					if (nameIdx > maxIdx) {
						maxIdx = nameIdx;
					}
				}
			}
		});

		if (duplicate) {
			newName = candidateName.substring(0, candidateName.length) + "_0" + (maxIdx + 1);
		}
		return newName;
	}

	arraysAreEqual(arr1: string[], arr2: string[]) {
		if (arr1.length !== arr2.length) {
			return false;
		}
		let arr2Copy = [...arr2];

		arr1.forEach((value) => {
			if (arr2Copy.includes(value)) {
				arr2Copy = arr2Copy.filter((value2) => value2 !== value);
			}
		});

		return arr2Copy.length === 0;
	}

	static getActivityList(instances: ActivityInstance[]) {
		let acts: string[] = [];

		for (const instance of instances) {
			if (!acts.includes(instance.getType())) {
				acts.push(instance.getType());
			}
		}

		return acts;
	}

	static getActivityNum(instances: ActivityInstance[]) {
		let actNum: { [act: string]: number } = {};
		for (const instance of instances) {
			if (instance.getType() in actNum) {
				actNum[instance.getType()] += 1;
			} else {
				actNum[instance.getType()] = 1;
			}
		}

		return actNum;
	}
}

export default Activity;
