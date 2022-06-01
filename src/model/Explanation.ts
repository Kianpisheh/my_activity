import AxiomData from "./AxiomData";
import AxiomTypes from "./AxiomTypes";
import Constraint from "./Constraint";

interface IConstraint {
    events: string[];
    th1: number;
    th2: number;
    type: string;
}

class Explanation {
    events: string[];
    constraints: Constraint[];

    constructor(events_: string[], constraints_: IConstraint[]) {
        this.events = events_;

        this.constraints = [];
        for (let i = 0; i < constraints_.length; i++) {
            this.constraints.push(
                new Constraint(
                    constraints_[i]["events"],
                    constraints_[i]["th1"],
                    constraints_[i]["th2"],
                    constraints_[i]["type"]
                )
            );
        }
    }

    contains(axiom: AxiomData): boolean {
        if (axiom.getType() === AxiomTypes.TYPE_INTERACTION) {
            return (
                axiom.getEvents().sort().join(",") === this.events.sort().join(",")
            );
        } else if (
            axiom.getType() ===
            AxiomTypes.TYPE_TIME_DISTANCE || axiom.getType() === AxiomTypes.TYPE_DURATION
        ) {
            // if (axiom.getEvents().sort().join(",") !== this.constraints.sort().join(",")) {
            //     return false;
            // }

            for (let i = 0; i < this.constraints.length; i++) {
                if (this.constraints[i]["th1"] === axiom["th1"] && this.constraints[i]["th2"] === axiom["th2"]) {
                    if (this.constraints[i]["events"].sort().join(",") === axiom.getEvents().sort().join(",")) {
                        return true;
                    }
                }
            }
            return false;

        }

        return false;
    }
}

export default Explanation;
