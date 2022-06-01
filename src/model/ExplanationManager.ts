import Constraint from "./Constraint";
import Explanation from "./Explanation"

interface IExplanations {
  events: string[];
  constraints: Constraint[];
}

class ExplanationManager {
  static getExplanations(explanations: IExplanations) {
    let exp: Explanation = new Explanation(
      explanations["events"],
      explanations["constraints"]
    );
    return exp;
  }
}

export default ExplanationManager;
