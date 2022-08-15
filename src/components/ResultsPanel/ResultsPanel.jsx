import "./ResultsPanel.css";

import { createResRects } from "./utils";

function ResultsPanel(props) {
	const { selectedInstancesIdx, highlightedInstancesIdx, newTPs, newFPs, newFPsLabel } = props;

	if (!props.classificationResult) {
		return;
	}

	let allClassesResults = [];
	for (const [activity, classificationResult] of Object.entries(props.classificationResult)) {
		const { FP, FN, TP, N, TN } = classificationResult;

		if (!FP || !N || !TP || !FN || !TN) {
			return;
		}

		let results = [];
		const rectSize = 15;
		results.push(
			createResRects(
				{
					TP: TP,
					FN: FN,
					newFPs: newFPs,
					newFPsLabel: newFPsLabel,
					newTPs: newTPs,
					queryMode: props.queryMode,
				},
				"TPFN",
				rectSize,
				props.onInstanceSelection,
				selectedInstancesIdx,
				highlightedInstancesIdx,
                activity
			)
		);
		if (FP) {
			for (const [activityName, fp] of Object.entries(FP)) {
				if (activityName === "all") {
					continue;
				}
				results.push(
					createResRects(
						{
							FP: fp,
							newFPs: newFPs,
							newFPsLabel: newFPsLabel,
							queryMode: props.queryMode,
						},
						"FP",
						rectSize,
						props.onInstanceSelection,
						selectedInstancesIdx,
						highlightedInstancesIdx,
                        activity
					)
				);
			}
		}
		allClassesResults[activity] = results;
	}

	return (
		<div className="result-container">
			<div id="recog-section-title">
				<span key={"res_title"} className="section-title">
					Recognition result
				</span>
			</div>
			{Object.keys(allClassesResults).map((activity, idx) => {
				return (
					<div className="class-results-container">
						<span style={{paddingLeft: 15, fontSize: 14, paddingBottom: 10, color: "var(--list-item-text)"}}>{activity}</span>
						<div key={"res_div2_" + idx} className="result-act-all-classes">
							{[...allClassesResults[activity]]}
						</div>
					</div>
				);
			})}
			<div id="result-legends-container">
				<div>
					<svg height={18} width={210}>
						<rect y={3} width={15} height={7} fill={"#4D8E7F"} rx={2}></rect>
						<text x={25} y={10} style={{ fontSize: 11 }}>
							Correctly recognized activity samples
						</text>
					</svg>
				</div>
				<div>
					<svg height={18} width={210}>
						<rect y={3} width={15} height={7} fill={"#CE3151"} rx={2}></rect>
						<text x={25} y={10} style={{ fontSize: 11 }}>
							Incorrectly recognized activity samples
						</text>
					</svg>
				</div>
				<div>
					<svg height={18} width={210}>
						<rect y={3} width={15} height={7} fill={"#B4B2B2"} rx={2}></rect>
						<text x={25} y={10} style={{ fontSize: 11 }}>
							Not recognized activity samples
						</text>
					</svg>
				</div>
			</div>
		</div>
	);
}

export default ResultsPanel;
