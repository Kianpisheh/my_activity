import AxiomData from "./AxiomData";
import Constraint from "./Constraint";
import Explanation from "./Explanation"

interface IExplanations {
  events: string[];
  individuals: string[];
  constraints: Constraint[];
}

class ExplanationManager {
  static getExplanations(explanations: IExplanations) {
    let exp: Explanation = new Explanation(
      explanations["events"],
      explanations["constraints"],
      explanations["individuals"]
    );
    return exp;
  }

  static getSatisfiedAxiomIds(axioms: AxiomData[], explanation: Explanation): number[] {
    let i: number = 0;
    let ids: number[] = [];
    axioms.forEach(axiom => {
      if (explanation.contains(axiom)) {
        ids.push(i);
      }
      i += 1;
    })

    return ids;
  }
}

export default ExplanationManager;
