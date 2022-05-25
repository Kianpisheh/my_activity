import AxiomData from "./AxiomData";
import AxiomTypes from "./AxiomTypes";

class Activity {
	constructor(activityObj) {
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

	getAxioms() {
		let axioms = [];

		// the interaction axioms
		axioms.push(
			new AxiomData({
				events: this.events,
				type: AxiomTypes.TYPE_INTERACTION,
			})
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

	updateAxioms(new_axioms) {
		let new_events = [];
		let new_constraints = [];

		new_axioms.forEach(axiom => {
			let events = axiom["events"];
			new_events = new_events.concat(events);
			if (axiom["type"] === AxiomTypes.TYPE_DURATION || axiom["type"] === AxiomTypes.TYPE_TIME_DISTANCE) {
				let constraint = { type: axiom["type"], th1: axiom["th1"], th2: axiom["th2"], events: axiom["events"] }
				new_constraints.push(constraint)
			}
		})
		new_events = new Set(new_events);
		this.events = Array.from(new_events);
		this.constraints = [...new_constraints];
	}


	static getUniqieID(activities) {
		let idsList = []
		activities.forEach(activtiy => {
			idsList.push(activtiy["id"]);
		})
		let ids = new Int32Array(idsList);
		ids = ids.sort();
		return ids[ids.length - 1] + 1; // new_id = id_max + 1
	}

}

export default Activity;
