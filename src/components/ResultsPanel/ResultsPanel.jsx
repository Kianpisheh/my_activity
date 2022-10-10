import "./ResultsPanel.css";

import { createResRects } from "./utils";

import FNFPQuestions from "./FNFPQuestions";
import ExpStatus from "../../model/ExpStatus";

function ResultsPanel(props) {
	const {
		selectedInstancesIdx,
		explanationStatus,
		highlightedInstancesIdx,
		enclosedTimeSliderInstances,
		onQuery,
		newTPs,
		newFPs,
		newFPsLabel,
		currentActivity,
		instances,
	} = props;

	if (!props.classificationResult) {
		return;
	}

	let allFPs = [];
	for (const act of Object.keys(props.classificationResult)) {
		allFPs.push(...props.classificationResult[act]["FP"]["all"]);
	}
	let allClassesResults = [];
	let i = 0;
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
					AllFPs: allFPs,
					newFPs: newFPs[activity],
					newFPsLabel: newFPsLabel,
					newTPs: newTPs[activity],
					queryMode: props.queryMode,
					key: i + "TPFN",
				},
				"TPFN",
				rectSize,
				props.onInstanceSelection,
				selectedInstancesIdx,
				highlightedInstancesIdx,
				enclosedTimeSliderInstances,
				activity
			)
		);

		for (const act in newFPs) {
			if (act !== activity && !(act in FP) && newFPs[activity].some((idx) => instances[idx].getType() === act)) {
				FP[act] = [];
			}
		}
		if (FP) {
			let j = 0;
			for (const [activityName, fp] of Object.entries(FP)) {
				if (activityName === "all") {
					continue;
				}
				results.push(
					createResRects(
						{
							FP: fp,
							newFPs: newFPs[activity]?.[activityName],
							newFPsLabel: newFPsLabel,
							queryMode: props.queryMode,
							fpActivity: activityName,
							key: i + "FP" + j,
							idx: j,
						},
						"FP",
						rectSize,
						props.onInstanceSelection,
						selectedInstancesIdx,
						highlightedInstancesIdx,
						enclosedTimeSliderInstances,
						activity
					)
				);
				j += 1;
			}
		}
		allClassesResults[activity] = results;
		i += 1;
	}

	return (
		<div key={"asd"} className="result-container">
			<div id="recog-section-title">
				<span key={"res_title"} className="section-title">
					Recognition result
				</span>
			</div>
			{Object.keys(allClassesResults).map((activity, idx) => {
				return (
					<div key={idx + "ress"} className="class-results-container">
						<span
							key={idx + "spann"}
							style={{
								fontSize: 13,
								marginBottom: 15,
								fontWeight: 600,
								color: "var(--list-item-text)",
							}}
						>
							{activity}
						</span>
						<div
							key={"res_div2_" + idx}
							className="result-act-all-classes"
							style={{ display: "flex", flexDireaction: "column", rowGap: 15 }}
						>
							{[...allClassesResults[activity]]}
						</div>
					</div>
				);
			})}
			{(explanationStatus === ExpStatus.FN_SELECTED || explanationStatus === ExpStatus.FP_SELECTED) && (
				<div id="FNFP-questions">
					<FNFPQuestions
						expStatus={explanationStatus}
						selectedIdx={selectedInstancesIdx}
						currentActivity={currentActivity}
						onQuery={onQuery}
					></FNFPQuestions>
				</div>
			)}
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
				<div>
					<svg height={18} width={210}>
						<rect y={3} width={15} height={7} fill={"#4EAB2B"} rx={2}></rect>
						<text x={25} y={10} style={{ fontSize: 11 }}>
							Classified as another activity
						</text>
					</svg>
				</div>
			</div>
		</div>
	);
}

export default ResultsPanel;
