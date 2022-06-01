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

	constructor(activityObj: IActivityObj) {
		this.name = activityObj["name"];
		this.events = activityObj["events"];
		this.constraints = activityObj["constraints"];
		this.id = activityObj["id"];
	}

	getID() {
		return this.id;
	}

	getName() {
		return this.name;
	}

	getEvents() {
		return this.events;
	}

	getConstraints() {
		return this.constraints;
	}

	getAxioms(): AxiomData[] {
		let axioms: AxiomData[] = [];

		// the interaction axioms
		axioms.push(
			new AxiomData({
				events: this.events,
				type: AxiomTypes.TYPE_INTERACTION,
			th1: -1, th2: -1})
		);

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

		new_axioms.forEach(axiom => {
			let events = axiom["events"];
			newEvents = newEvents.concat(events);
			if (axiom["type"] === AxiomTypes.TYPE_DURATION || axiom["type"] === AxiomTypes.TYPE_TIME_DISTANCE) {
				let constraint = { type: axiom["type"], th1: axiom["th1"], th2: axiom["th2"], events: axiom["events"] }
				newConstraints.push(constraint)
			}
		})
		let newEventsSet = new Set(newEvents);
		this.events = Array.from(newEventsSet);
		this.constraints = [...newConstraints];
	}

	static getUniqieID(activities: Activity[]) {
		let idsList: number[] = []
		activities.forEach(activtiy => {
			idsList.push(activtiy["id"]);
		})
		let ids = new Int32Array(idsList);
		ids = ids.sort();
		return ids[ids.length - 1] + 1; 
	}
}

export default Activity;
