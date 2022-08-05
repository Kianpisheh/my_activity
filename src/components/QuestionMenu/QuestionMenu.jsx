import "./QuestionMenu.css";

import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";
import SystemMode from "../../model/SystemMode";

function QuestionMenu(props) {

    const {systemMode, selectedIdx, currentActivity} = props;
    const Q = getQuestions(systemMode, {selectedIdx, currentActivity});

    return <div className="question-menu-container">
        <div className="question-list-container">
            {Q.map((q,idx) => {
                const Icon = Icons.getIcon(pascalCase("Mug"), true);
                const qType = getQuestionType(q);
                return <div className="question-container2" onClick={() => props.onQuery(qType)}>
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

    if (sysStatus === SystemMode.FN_SELECTED) {
        const q1 = <span className="question-content">Why {isAre} the selected {sample} not recognized as {targetActivity}?</span>;
        const q2 = <span className="question-content">How to make the system to recognize {thisThese} {sample} as {targetActivity}?</span>;
        questions = [q1, q2];

    } else if (sysStatus === SystemMode.FP_SELECTED) { 
        const q1 = <span className="question-content">Why {isAre} the selected {sample} recognized as {targetActivity}?</span>;
        const q2 = <span className="question-content">How to make the system to not recognize {thisThese} {sample} as {targetActivity}?</span>;
        questions = [q1, q2];

    } else if (sysStatus === SystemMode.NOTHING) {
        const targetActivity =  data["target_activity"];
    } else if (sysStatus === SystemMode.UNSATISFIED_AXIOM) {
        const q1 = <span className="question-content">Why this condition is not satisfied for the {targetActivity} activity?</span>;
        const q2 = <span className="question-content">How to modify this condition so it is satisfied for the {targetActivity} activity?</span>
        questions = [q1, q2];
    }

    return questions;
}

function getQuestionType(question) {
    const qq = question.props.children.join().replace(/,/g, '');
    
    if (qq.includes("sample recognized as") && !qq.includes(" not ")) {
        return QueryQuestion.WHY;
    } else if (qq.includes("not recognized as")) {
        return QueryQuestion.WHY_NOT;
    } else if (qq.includes("How to") && qq.includes(" not ")) {
        return QueryQuestion.HOW_TO_NOT;
    } else if (qq.includes("How to") && !qq.includes(" not ")) {
        return QueryQuestion.HOW_TO;
    } else if (qq.includes("condition") && !qq.includes(" not ")) {
        return QueryQuestion.WHY_AXIOM;
    } else if (qq.includes("condition") && qq.includes(" not ")) {
        return QueryQuestion.WHY_NOT_AXIOM;
    }
}

export class QueryQuestion {
    static WHY = "why";
    static WHY_NOT = "why not";
    static HOW_TO =  "how to";
    static HOW_TO_NOT = "how to not";
    static WHY_NOT_AXIOM = "why not axiom";
    static WHY_AXIOM = "why axiom";
}


export default QuestionMenu;