import AxiomTypes from "./AxiomTypes";
import AxiomData from "./AxiomData";

class AxiomManager {
  static createAxiom(id, current_axioms, props) {
    let new_axioms = [...current_axioms];
    new_axioms.push(
      AxiomData.getAxiom({
        id: id,
        events: props.events,
        type: props.type,
      })
    );
    return new_axioms;
  }

  static findInteractionObjects(axioms) {
    let interactionAxioms = [];
    for (let i = 0; i < axioms.length; i++) {
      if (axioms[i].type === AxiomTypes.TYPE_INTERACTION) {
        for (let j = 0; j < axioms[i].events.length; j++) {
          let e = axioms[i].events[j];
          if (!interactionAxioms.includes(e)) {
            interactionAxioms.push(e);
          }
        }
      }
    }

    return interactionAxioms;
  }

  static updateTimeConstraint(id, axioms, time, type) {
    let new_axioms = [...axioms];
    for (let i = 0; i < axioms.length; i++) {
      if (new_axioms[i].id === id) {
        if (type === "more than") {
          if (time < new_axioms[i].th2) {
            new_axioms[i].th1 = time;
          }
        } else if (type === "less than") {
          if (time > new_axioms[i].th1) {
            new_axioms[i].th2 = time;
          }
        }
      }
    }
    return new_axioms;
  }

  static updateTimeConstraintStatus(id, axioms, active, type, time) {
    let new_axioms = [...axioms];
    for (let i = 0; i < axioms.length; i++) {
      if (new_axioms[i].id === id) {
        if (active) {
          if (type === "more than") {
            new_axioms[i].th1 = 1;
          } else if (type === "less than") {
            new_axioms[i].th2 =
              new_axioms[i].th1 === null ? 20 : new_axioms[i].th1 + 10;
          }
        } else {
          if (type === "more than") {
            new_axioms[i].th1 = null;
          } else if (type === "less than") {
            new_axioms[i].th2 = null;
          }
        }
      }
    }
    return new_axioms;
  }
}

export default AxiomManager;
