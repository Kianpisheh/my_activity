class AxiomData {
  static getAxiom(data) {
    let axiom = { id: null, events: null, type: null, th1: 10, th2: 20 };

    Object.keys(data).forEach((d) => {
      axiom[d] = data[d];
    });

    return axiom;
  }
}

export default AxiomData;
