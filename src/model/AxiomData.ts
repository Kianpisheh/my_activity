interface IAxiom {
  events: string[];
  type: string;
  th1: number;
  th2: number;
}

class AxiomData {
  events: string[];
  type: string;
  th1: number;
  th2: number;

  constructor(axiom: IAxiom) {
    this.events = axiom["events"];
    this.type = axiom["type"];
    this.th1 = axiom["th1"];
    this.th2 = axiom["th2"];
  }

  getType() {
    return this.type;
  }

  flipEvents() {
    if (this.events.length !== 2) {
      return
    }

    const e2 = this.events[1];
    this.events[1] = this.events[0];
    this.events[0] = e2;

  }

  getEvents() {
    return this.events;
  }

  removeEvent(eventType: string) {
    this.events = this.events.filter(ev => ev !== eventType)
  }

  getTh1() {
    return this.th1;
  }

  getTh2() {
    return this.th2;
  }

  setTh1(th1: number) {
    this.th1 = th1;
  }

  setTh2(th2: number) {
    this.th2 = th2;
  }
}

export default AxiomData;
