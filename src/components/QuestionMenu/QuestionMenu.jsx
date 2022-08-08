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
                const qType = getQuestionType(q);
                let ii = pascalCase(questionIcon(qType));
                const Icon = Icons.getIcon(ii, true);
                return <div className="question-container2" onClick={() => props.onQuery(qType)}>
                    <div className="question-icon">
                        <Icon key={idx} style={{width: 35, height: 35}}></Icon>
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
    } else if (sysStatus === SystemMode.WHY_NOT_ASKED) {
        const q1 = <span className="question-content">Why is this condition not satisfied for the {targetActivity} activity?</span>;
        const q2 = <span className="question-content">How to modify this condition so it is satisfied for the {targetActivity} activity?</span>
        questions = [q1, q2];
    } else if (sysStatus === SystemMode.WHY_ASKED) {
        const q1 = <span className="question-content">Why is this condition satisfied for the {targetActivity} activity?</span>;
        const q2 = <span className="question-content">How to modify this condition so it is not satisfied for the {targetActivity} activity?</span>
        questions = [q1, q2];
    } else if (sysStatus === SystemMode.WHY_NOT_WHAT_ASKED) {
        const q = <span className="question-content">How to modify this condition so it is satisfied for the {targetActivity} activity?</span>
        questions = [q];
    } else if (sysStatus === SystemMode.WHY_WHAT_ASKED) {
        const q = <span className="question-content">How to make the system to not recognize {thisThese} {sample} as {targetActivity}?</span>;
        questions = [q];
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
        return QueryQuestion.WHY_HOW_TO;
    } else if (qq.includes("How to") && !qq.includes(" not ")) {
        return QueryQuestion.WHY_NOT_HOW_TO;
    } else if (qq.includes("condition") && !qq.includes(" not ")) {
        return QueryQuestion.WHY_WHAT;
    } else if (qq.includes("condition") && qq.includes(" not ")) {
        return QueryQuestion.WHY_NOT_WHAT;
    }
}

function questionIcon(questionType) {
    if (questionType === QueryQuestion.WHY) {
        return "Why";
    } else if (questionType === QueryQuestion.WHY_NOT) {
        return "WhyNot";
    } else if (questionType === QueryQuestion.WHY_NOT_HOW_TO) {
        return "WhyNotHowTo"
    } else if (questionType === QueryQuestion.WHY_HOW_TO) {
        return "WhyHowTo"
    } else if (questionType === QueryQuestion.WHY_WHAT) {
        return "WhyWhat"
    } else if (questionType === QueryQuestion.WHY_NOT_WHAT) {
        return "WhyNotWhat"
    }
}

export class QueryQuestion {
    static WHY = "why";
    static WHY_NOT = "why not";
    static WHY_HOW_TO =  "why how to";
    static WHY_NOT_HOW_TO = "why not how to";
    static WHY_NOT_WHAT = "why not what";
    static WHY_WHAT = "why what";
}


export default QuestionMenu;