import Icons from "../../icons/objects/Icons";

function AxiomNavBar(props) {
	// states to keep track of saved axiom sets
	// dataset --> savedSets: [axiomset1, axiomset2]
	// axiomset: {activity, axioms: AxiomData[]}

	const { onAxiomSetChange } = props;
	const w = 170;
	const h = 30;
	const arr = [...Array(props.savedFormulasNum)].map(() => {
		return { value: 0 };
	});

	const SaveIcon = Icons.getIcon("Save", true);
	const RemoveIcon = Icons.getIcon("Trashcan", true);
	const ResetIcon = Icons.getIcon("Reset", true);

	let liveBorderWidth = 0;
	let liveBorderColor = "";
	if (props.currentIdx === 0) {
		liveBorderWidth = 2;
		liveBorderColor = "#e7c0c0";
	}
	return (
		<div className="navbar" style={{ display: "flex", flexDirection: "row", width: "93%" }}>
			<div
				id="axiomset-row"
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					width: "100%",
				}}
			>
				<svg width={w} height={h}>
					<circle
						cx={w / 2 - (arr.length / 2) * 15 + 20}
						cy={10}
						id="live-axiomset"
						r={5}
						fill="#ec8b7f"
						stroke={liveBorderColor}
						strokeWidth={liveBorderWidth}
						onClick={() => onAxiomSetChange(0)}
						style={{ cursor: "pointer" }}
					></circle>
					{arr.map((n, i) => {
						let borderWidth = 0;
						let borderColor = "";
						if (props.currentIdx === i + 1) {
							borderWidth = 1;
							borderColor = "#474434";
						}
						return (
							<circle
								key={i}
								cx={w / 2 - (arr.length / 2) * 15 + 35 + 15 * i}
								cy={10}
								r={5}
								fill="#d2cebf"
								style={{ cursor: "pointer" }}
								onClick={() => onAxiomSetChange(i + 1)}
								stroke={borderColor}
								storokeWidth={borderWidth}
							></circle>
						);
					})}
				</svg>
			</div>
			<div id="navbar-icons" style={{ display: "flex", columnGap: 5, justifySelf: "flex-end", height: "100%" }}>
				<div
					id="remove-btn"
					style={{
						display: "flex",
						justifySelf: "flex-end",
						height: "100%",
						cursor: "pointer",
						border: "solid #C4BDA5",
						opacity: props.currentIdx > 0 ? 1 : 0,
						borderRadius: 4,
						padding: 2,
					}}
				>
					<RemoveIcon
						width={15}
						height={15}
						fill={"#ec8b7f"}
						x={80}
						y={0}
						onClick={() => props.onDelete()}
					></RemoveIcon>
				</div>
				<div
					id="reset-btn"
					onClick={() => props.onReset()}
					style={{
						display: "flex",
						justifySelf: "flex-end",
						height: "100%",
						cursor: "pointer",
						border: "solid #C4BDA5",
						borderRadius: 4,
						padding: 2,
					}}
				>
					<ResetIcon width={15} height={15} fill={"#817D85"} x={80} y={0}></ResetIcon>
				</div>
				<div
					id="save-btn"
					style={{
						display: "flex",
						justifySelf: "flex-end",
						height: "100%",
						cursor: "pointer",
						border: "solid #C4BDA5",
						borderRadius: 4,
						padding: 2,
					}}
				>
					<SaveIcon
						width={15}
						height={15}
						fill={"#86B5E1"}
						x={100}
						y={0}
						onClick={() => props.onSave()}
					></SaveIcon>
				</div>
			</div>
		</div>
	);
}

export default AxiomNavBar;
