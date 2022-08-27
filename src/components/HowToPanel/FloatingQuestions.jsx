import "./FloatingQuestions.css"

import {getQuestionsFromExpStatus} from "../QuestionMenu/QuestionMenu"
import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/Icons";
import { questionIcon } from "../QuestionMenu/QuestionMenu";

function FloatingQuestions(props) {
    const {expStatus, selectedIdx, currentActivity} = props;
    if (!selectedIdx || (!selectedIdx["FN"] && !selectedIdx["FP"]) || !currentActivity) {
        return;
    }

    const Q = getQuestionsFromExpStatus(expStatus, selectedIdx, currentActivity);
    let bgColor = "#e4eef5";

    return (
		<div className="FloatingQ-container">
			<div className="Floating-question-list-container">
				{Object.keys(Q).map((qtype, idx) => {
					let ii = pascalCase(questionIcon(qtype));
					const Icon = Icons.getIcon(ii, true);
					return (
						<div
							className="floating-question-item"
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



export default FloatingQuestions;