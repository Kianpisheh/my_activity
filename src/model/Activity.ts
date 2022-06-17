import AxiomData from "./AxiomData";
import AxiomTypes from "./AxiomTypes";
import Constraint from "./Constraint";

interface IActivityObj {
	name: string;
	events: string[];
	constraints: Constraint[];
	id: number;
}

class Activity {

	name: string;
	events: string[];
	constraints: Constraint[];
	id: number;
	eventORList: string[][] // [[e1,e4]. [e2, e5]] list of list of strings

	constructor(activityObj: IActivityObj) {
		this.name = activityObj["name"];
		this.events = activityObj["events"];
		this.constraints = activityObj["constraints"];
		this.id = activityObj["id"];
		this.eventORList = [];
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

	getConstraints() {
		return this.constraints;
	}

	getAxioms(): AxiomData[] {
		let axioms: AxiomData[] = [];

		let interactionOREvents = this.eventORList.flat();
		let singleEventInteraction: string[] = []
		this.events.forEach((ev) => {
			if (!interactionOREvents.includes(ev)) {
				singleEventInteraction.push(ev);
			}
		});

		// the interaction axioms
		axioms.push(
			new AxiomData({
				events: singleEventInteraction,
				type: AxiomTypes.TYPE_INTERACTION,
				th1: -1, th2: -1
			})
		);

		// the interaction_OR axioms
		this.eventORList.forEach(events => {
			axioms.push(new AxiomData({
				events: events,
				type: AxiomTypes.TYPE_OR_INTERACTION,
				th1: -1,
				th2: -1,
			}))
		})

		// temporal axioms
		this.constraints.forEach((constraint) => {
			let numEvents = constraint["events"].length;
			let axiomType = "";
			if (numEvents === 1) {
				axiomType = AxiomTypes.TYPE_DURATION;
			} else if (numEvents === 2) {
				axiomType = AxiomTypes.TYPE_TIME_DISTANCE;
			}
			axioms.push(
				new AxiomData({
					events: constraint["events"],
					type: axiomType,
					th1: constraint["th1"],
					th2: constraint["th2"],
				})
			);
		});

		return axioms;
	}

	updateAxioms(new_axioms: AxiomData[]) {
		let newEvents: string[] = [];
		let newConstraints: Constraint[] = [];
		let newEventORList: string[][] = [];

		new_axioms.forEach(axiom => {
			let events = axiom["events"];
			newEvents = newEvents.concat(events);
			if (axiom["type"] === AxiomTypes.TYPE_DURATION || axiom["type"] === AxiomTypes.TYPE_TIME_DISTANCE) {
				let constraint = { type: axiom["type"], th1: axiom["th1"], th2: axiom["th2"], events: axiom["events"] }
				newConstraints.push(constraint)
			} else if (axiom["type"] === AxiomTypes.TYPE_OR_INTERACTION) {
				newEventORList.push(axiom["events"]);
			}
		})
		let newEventsSet = new Set(newEvents);
		this.events = Array.from(newEventsSet);
		this.constraints = [...newConstraints];
		this.eventORList = [...newEventORList];
	}

	static getUniqueID(activities: Activity[]) {
		let idsList: number[] = []
		activities.forEach(activtiy => {
			idsList.push(activtiy["id"]);
		})
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
		activities.forEach(activity => {
			let activityName: string = activity.getName();
			if (candidateName === activityName || candidateName === activityName.substring(0, activityName.length - 3)) {
				duplicate = true;
				let nameIdx = parseInt(activityName.charAt(activityName.length - 1))
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
			return false
		}
		let arr2Copy = [...arr2];


		arr1.forEach(value => {
			if (arr2Copy.includes(value)) {
				arr2Copy = arr2Copy.filter(value2 => value2 !== value)
			}
		})

		return arr2Copy.length === 0;
	}
}



export default Activity;
