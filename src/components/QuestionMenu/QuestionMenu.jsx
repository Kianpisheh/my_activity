import "./QuestionMenu.css";

import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";
import SystemStatus from "../../model/SystemStatus"

function QuestionMenu(props) {

    const {sysStatus, selectedIdx, currentActivity} = props;
    const Q = getQuestions(sysStatus, {selectedIdx, currentActivity});

    return <div className="question-menu-container">
        <div className="question-list-container">
            {Q.map((q,idx) => {
                const Icon = Icons.getIcon(pascalCase("Mug"), true);
                return <div className="question-container2">
                    <div className="question-icon">
                        <Icon key={idx} style={{width: 26, height: 26}}></Icon>
                    </div>
                    <div className="question-text">
                        {q}
                    </div>
                </div>
            })}
        </div>
    </div>

}

function getQuestions(sysStatus, data) {
		let questions = [];

        const selectedIdx = data?.["selectedIdx"];
        let selectedIdxType = "";
        if (selectedIdx) {
            selectedIdxType = Object.keys(selectedIdx)[0];
        }

        const targetActivity =  data?.["currentActivity"].getName();
        const multiple = selectedIdx && selectedIdx.length > 1;
        const isAre = multiple ? "are" : "is";
        const sample = multiple ? "samples" : "sample";
        const thisThese = multiple ? "these" : "this";

        if (selectedIdxType === "FN") {
            const q1 = <span className="question-content">Why {isAre} the selected {sample} not recognized as {targetActivity}?</span>;
            const q2 = <span className="question-content">How to make the system to recognize {thisThese} {sample} as {targetActivity}?</span>;
            questions = [q1, q2];

        } else if (selectedIdxType === "FP") { 
            const q1 = <span className="question-content">Why {isAre} the selected {sample} recognized as {targetActivity}?</span>;
            const q2 = <span className="question-content">How to make the system to not recognize {thisThese} {sample} as {targetActivity}?</span>;
            questions = [q1, q2];

        } else if (sysStatus === SystemStatus.NOTHING) {
            const targetActivity =  data["target_activity"];
        } else if (sysStatus === SystemStatus.UNSATISFIED_AXIOM) {
            const q1 = <span className="question-content">Why this condition is not satisfied for the {targetActivity} activity?</span>;
            const q2 = <span className="question-content">How to modify this condition so it is satisfied for the {targetActivity} activity?</span>
            questions = [q1, q2];
        }

        return questions;
	}


export default QuestionMenu;