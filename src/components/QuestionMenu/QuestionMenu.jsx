import "./QuestionMenu.css";

import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";
import QueryTrigger from "../../model/QueryTrigger";
import QueryQuestion from "../../model/QueryQuestion"
import ExpStatus from "../../model/ExpStatus";


function QuestionMenu(props) {
	const { queryTrigger, selectedIdx, currentActivity } = props;
	const Q = getQuestions(queryTrigger, { selectedIdx, currentActivity });

	let bgColor = "#e4eef5";
	if (queryTrigger === QueryTrigger.WHY_NOT_WHAT || queryTrigger === QueryTrigger.WHY_WHAT) {
		bgColor = "#f5e7e4";
	}

	return (
		<div className="question-menu-container">
			<div className="question-list-container">
				{Object.keys(Q).map((qtype, idx) => {
					let ii = pascalCase(questionIcon(qtype));
					const Icon = Icons.getIcon(ii, true);
					return (
						<div
							className="question-container2"
							onClick={() => props.onQuery(qtype)}
							style={{ background: bgColor }}
						>
							<div className="question-icon">
								<Icon key={idx} style={{ width: 35, height: 35 }}></Icon>
							</div>
							<div className="question-text">{Q[qtype]}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export function getQuestionBgColor(questionType) {
    if (questionType === QueryQuestion.WHY_NOT_WHAT || questionType === QueryQuestion.WHY_WHAT) {
        return "var(--whywhy)";
    } else if (questionType === QueryQuestion.WHY_HOW_TO || questionType === QueryQuestion.WHY_NOT_HOW_TO){
        return "var(--how)";
    }
}

export function getQuestionsFromExpStatus(expStatus, selectedIdx, currentActivity) {
    const targetActivity = currentActivity.getName();
	const multiple = selectedIdx && selectedIdx.length > 1;
	const isAre = multiple ? "are" : "is";
	const sample = multiple ? "samples" : "sample";
	const thisThese = multiple ? "these" : "this";

    let questions = {}
    if (expStatus === ExpStatus.FN_SELECTED) {
        const q1 = (
			<span className="question-content">
				{" "}
				<span style={{ fontWeight: 700 }}>Why</span> {isAre} the selected {sample}{" "}
				<span style={{ fontWeight: 700 }}>not</span> recognized as {targetActivity}?
			</span>
		);
		const q2 = (
            <span className="question-content">
				<span style={{ fontWeight: 700 }}>How</span> to make the system to recognize {thisThese} {sample} as{" "}
				{targetActivity}?
			</span>
		);
        questions[QueryQuestion.WHY_NOT] = q1;
        questions[QueryQuestion.WHY_NOT_HOW_TO] = q2;
    } else if (expStatus === ExpStatus.FP_SELECTED) {
        const q1 = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>Why</span> {isAre} the selected {sample} recognized as{" "}
				{targetActivity}?
			</span>
		);
		const q2 = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>How</span> to make the system to{" "}
				<span style={{ fontWeight: 700 }}>not</span> recognize {thisThese} {sample} as {targetActivity}?
			</span>
		);
		questions[QueryQuestion.WHY] = q1;
        questions[QueryQuestion.WHY_HOW_TO] = q2;
    } else if (expStatus === ExpStatus.WHY_NOT_LIST) {
        const q1 = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>Why</span> is this condition <span style={{ fontWeight: 700 }}>not</span> satisfied for the {targetActivity}{" "}
				activity?
			</span>
		);
		const q2 = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>How</span> to modify this condition so it is satisfied for the{" "}
				{targetActivity} activity?
			</span>
		);
		questions[QueryQuestion.WHY_NOT_WHAT] = q1;
        questions[QueryQuestion.WHY_NOT_HOW_TO] = q2;
    } else if (expStatus === ExpStatus.WHY_LIST) {
        const q1 = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>Why</span> is this condition satisfied for the {targetActivity}{" "}
				activity?
			</span>
		);
		const q2 = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>How</span> to modify this condition so it is{" "}
				<span style={{ fontWeight: 700 }}>not</span> satisfied for the {targetActivity} activity?
			</span>
		);
		questions[QueryQuestion.WHY_WHAT] = q1;
        questions[QueryQuestion.WHY_HOW_TO] = q2;
    } else if (expStatus === ExpStatus.WHY_WHY_NOT_LIST) {
        const q = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>How</span> to modify this condition so it is satisfied for the{" "}
				{targetActivity} activity?
			</span>
		);
		questions[QueryQuestion.WHY_NOT_HOW_TO] = q;
    } else if (expStatus === ExpStatus.WHY_WHY_LIST) {
        const q = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>How</span> to make the system to{" "}
				<span style={{ fontWeight: 700 }}>not</span> recognize {thisThese} {sample} as {targetActivity}?
			</span>
		);
		questions[QueryQuestion.WHY_HOW_TO] = q;
    }

    return questions;
}

function getQuestions(queryTrigger, data) {
	let questions = {};

	const selectedIdx = data?.["selectedIdx"];
	let selectedIdxType = "";
	if (selectedIdx) {
		selectedIdxType = Object.keys(selectedIdx)[0];
	}

	const targetActivity = data?.["currentActivity"].getName();
	const multiple = selectedIdx && selectedIdx.length > 1;
	const isAre = multiple ? "are" : "is";
	const sample = multiple ? "samples" : "sample";
	const thisThese = multiple ? "these" : "this";

	if (queryTrigger === QueryTrigger.WHY_NOT) {
		const q1 = (
			<span className="question-content">
				{" "}
				<span style={{ fontWeight: 700 }}>Why</span> {isAre} the selected {sample}{" "}
				<span style={{ fontWeight: 700 }}>not</span> recognized as {targetActivity}?
			</span>
		);
		const q2 = (
            <span className="question-content">
				<span style={{ fontWeight: 700 }}>How</span> to make the system to recognize {thisThese} {sample} as{" "}
				{targetActivity}?
			</span>
		);
        questions[QueryQuestion.WHY_NOT] = q1;
        questions[QueryQuestion.WHY_NOT_HOW_TO] = q2;
	} else if (queryTrigger === QueryTrigger.WHY) {
		const q1 = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>Why</span> {isAre} the selected {sample} recognized as{" "}
				{targetActivity}?
			</span>
		);
		const q2 = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>How</span> to make the system to{" "}
				<span style={{ fontWeight: 700 }}>not</span> recognize {thisThese} {sample} as {targetActivity}?
			</span>
		);
		questions[QueryQuestion.WHY] = q1;
        questions[QueryQuestion.WHY_HOW_TO] = q2;
	} else if (queryTrigger === "") {
		const targetActivity = data["target_activity"];
	} else if (queryTrigger === QueryTrigger.WHY_NOT_WHAT) {
		const q1 = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>Why</span> is this condition <span style={{ fontWeight: 700 }}>not</span> satisfied for the {targetActivity}{" "}
				activity?
			</span>
		);
		const q2 = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>How</span> to modify this condition so it is satisfied for the{" "}
				{targetActivity} activity?
			</span>
		);
		questions[QueryQuestion.WHY_NOT_WHAT] = q1;
        questions[QueryQuestion.WHY_NOT_HOW_TO] = q2;
	} else if (queryTrigger === QueryTrigger.WHY_WHAT) {
		const q1 = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>Why</span> is this condition satisfied for the {targetActivity}{" "}
				activity?
			</span>
		);
		const q2 = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>How</span> to modify this condition so it is{" "}
				<span style={{ fontWeight: 700 }}>not</span> satisfied for the {targetActivity} activity?
			</span>
		);
		questions[QueryQuestion.WHY_WHAT] = q1;
        questions[QueryQuestion.WHY_HOW_TO] = q2;
	} else if (queryTrigger === QueryTrigger.WHY_NOT_HOW_TO) {
		const q = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>How</span> to modify this condition so it is satisfied for the{" "}
				{targetActivity} activity?
			</span>
		);
		questions[QueryQuestion.WHY_NOT_HOW_TO] = q;
	} else if (queryTrigger === QueryTrigger.WHY_HOW_TO) {
		const q = (
			<span className="question-content">
				<span style={{ fontWeight: 700 }}>How</span> to make the system to{" "}
				<span style={{ fontWeight: 700 }}>not</span> recognize {thisThese} {sample} as {targetActivity}?
			</span>
		);
		questions[QueryQuestion.WHY_HOW_TO] = q;
	}

	return questions;
}

function getQuestionType(question) {
	const qq = question.props.children.join().replace(/,/g, "");

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

export function questionIcon(questionType) {
	if (questionType === QueryQuestion.WHY) {
		return "Why";
	} else if (questionType === QueryQuestion.WHY_NOT) {
		return "WhyNot";
	} else if (questionType === QueryQuestion.WHY_NOT_HOW_TO) {
		return "WhyNotHowTo";
	} else if (questionType === QueryQuestion.WHY_HOW_TO) {
		return "WhyHowTo";
	} else if (questionType === QueryQuestion.WHY_WHAT) {
		return "WhyWhat";
	} else if (questionType === QueryQuestion.WHY_NOT_WHAT) {
		return "WhyNotWhat";
	}
}

export default QuestionMenu;
