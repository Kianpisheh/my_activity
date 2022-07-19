

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

    getEvents(): string[] {
        return this.events;
    }

    getType() {
        return this.type;
    }

    getTh2() {
        return this.th2;
    }

    getTh1() {
        return this.th1;
    }
}

export default Constraint;