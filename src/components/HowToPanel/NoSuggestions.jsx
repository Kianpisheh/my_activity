function NoSuggestions(props) {
	return (
		<div
			className="text-explanation"
			style={{
				color: "#5F5656",
				fontSize: 14,
				paddingBottom: 16,
				backgroundColor: "var(--how)",
				padding: 25,
				width: "60%",
				borderRadius: 5,
			}}
		>
			None of the selected incorrectly recognized activity samples can get resolved by modifying this condition.
		</div>
	);
}

export default NoSuggestions;
