function WhyExplanation(props) {
	const { numInstances, activity } = props;
	const samples = numInstances > 1 ? "samples" : "sample";
	const satisfies = numInstances > 1 ? "satisfies" : "satisfy";

	return (
		<div style={{ width: "90%" }}>
			<span className="text-explanation" style={{ color: "#5F5656" }}>
				The selected {samples} {satisfies} all the defined conditions for activity
			</span>
            <span style={{ color: "var(--explanation)", fontWeight: 600 }}> {activity.getName()}</span>
            <span className="text-explanation" style={{ color: "#5F5656" }}> on the left pane.</span>
		</div>
	);
}

export default WhyExplanation;
