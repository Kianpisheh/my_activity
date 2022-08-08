function WhyNotExplanation(props) {
	const { numInstances, activity } = props;
	const samples = numInstances > 1 ? "samples" : "sample";
	const doesDo = numInstances > 1 ? "do" : "does";
	const theyNeed = numInstances > 1 ? "they need" : "it needs";

	return (
		<div style={{ width: "90%" }}>
			<span className="text-explanation" style={{ color: "#5F5656" }}>
				The selected {samples} {doesDo} not satisfy the indicated conditions on the left pane.
			</span>
			<span className="text-explanation" style={{ color: "#5F5656" }}>
				{" "}
				To recognize the selected {samples} correctly as 
			</span>
            <span style={{ color: "var(--explanation)", fontWeight: 600 }}>{" "}{activity.getName()},</span>
            <span className="text-explanation" style={{ color: "#5F5656" }}>{" "}{theyNeed} to satisfy</span>
			<span style={{ color: "var(--explanation)", fontWeight: 600 }}> all</span>
			<span style={{ color: "#5F5656" }}> the defined conditions on the left pane.</span>
		</div>
	);
}

export default WhyNotExplanation;
