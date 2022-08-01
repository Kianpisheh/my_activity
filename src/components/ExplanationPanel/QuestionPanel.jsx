import "./QuestionPanel.css";

function QuestionPanel(props) {
	const { selectedInstancesIdx, predictedActivities, currentActInstanceIdx, actInstances } = props;

	if (!selectedInstancesIdx || !predictedActivities) {
		return [];
	}
	if (!Object.keys(selectedInstancesIdx).length || !Object.keys(predictedActivities).length) {
		return [];
	}

	// get the predicted activity
	const predActivity = predictedActivities[currentActInstanceIdx];
	if (predActivity && predActivity === "") {
		return [];
	}

	let questions = getQuestions(selectedInstancesIdx, actInstances[currentActInstanceIdx].getType(), predActivity);

	return (
		<div className="question-panel-container">
			<div className="question-list">
				{questions.map((q, idx) => {
					return (
						<div key={idx} className="question-container" onClick={() => props.onQuery(q["type"])}>
							{q["text"]}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default QuestionPanel;

function getQuestions(selectedIdx, activity, predActivity) {
	let resTypes = Object.keys(selectedIdx);

	let thisThese = "this";
	let sample = "sample is";
	if (selectedIdx[resTypes].length > 1) {
		thisThese = "these";
		sample = "samples are";
	}

	let q = { text: "", type: "" };
	if (resTypes[0] === "FP") {
		q["type"] = "FP";
		q["text"] = (
			<span className="question" style={{ fontSize: 13 }}>
				Why {thisThese} {sample} recognized as <span style={{ color: "#F16415" }}>{predActivity}</span>?
			</span>
		);
		return [q];
	} else if (resTypes[0] === "FN") {
		q["type"] = "FN";
		q["text"] = (
			<span className="question" style={{ fontSize: 13 }}>
				Why {thisThese} {sample} <span style={{ fontWeight: 600 }}>not</span> recognized as{" "}
				<span style={{ color: "#F16415" }}>{activity}</span>?
			</span>
		);
		return [q];
	} else {
        q["text"] = <span>????</span>
        return [q];
    }
}
