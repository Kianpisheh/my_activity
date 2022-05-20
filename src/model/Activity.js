import AxiomData from "./AxiomData";
import AxiomTypes from "./AxiomTypes";

class Activity {
  constructor(activityObj) {
    this.name = activityObj["name"];
    this.events = activityObj["events"];
    this.constraints = activityObj["constraints"];
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
}

export default Activity;
