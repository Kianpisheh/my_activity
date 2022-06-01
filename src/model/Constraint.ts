

class Constraint {
    events: string[];
    th1: number;
    th2: number;
    type: string;

    constructor(events_: string[], th1: number, th2: number, type: string) {
        this.events = events_;
        this.th1 = th1;
        this.th2 = th2;
        this.type = type;
    }
}

export default Constraint;