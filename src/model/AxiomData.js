class AxiomData {
  constructor(axiom) {
    this.events = axiom["events"];
    this.type = axiom["type"];
    this.th1 = axiom["th1"];
    this.th2 = axiom["th2"];
    this.id = 0;
  }

  getType() {
    return this.type;
  }

  getEvents() {
    return this.events;
  }

  getTh1() {
    return this.th1;
  }

  getTh2() {
    return this.th2;
  }

  getID() {
    return this.id;
  }
}

export default AxiomData;
