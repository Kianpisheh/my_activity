import Activity from "../model/Activity";
import ActivityInstance from "../model/ActivityInstance";
import HowToAxiom from "../model/HowToAxiom";
import { getWhyHowToSuggestions } from "../components/HowToPanel/WhySuggestions";

class WhyFPQueryController {
	static handleWhyQuery(queryMode: boolean) {
		return !queryMode;
	}
}

export default WhyFPQueryController;
