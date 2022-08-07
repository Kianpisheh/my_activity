import { useState } from "react";

import "./ResultsPanel.css";

import { createResRects } from "./utils";

function ResultsPanel(props) {
	const { selectedInstancesIdx, classificationResult, highlightedInstancesIdx, newTPs, newFPs, newFPsLabel } = props;

	const { FP, FN, TP, N, TN } = props.classificationResult;
	const [myTP, setMyTP] = useState(0);
	const [myFP, setMyFP] = useState({});
	const [targetChange, setTargetChange] = useState(0);
	const [fpChange, setFPChange] = useState({});

	if (!FP || !N || !TP || !FN || !TN) {
		return;
	}

	if (classificationResult["TP"] && classificationResult["TP"].length !== myTP) {
		setTargetChange(classificationResult["TP"].length - myTP);
		setMyTP(classificationResult["TP"].length);
	}

	// check if FPs have changed
	let newFPChange = {};
	let change = false;
	if (FP) {
		for (let [activity, fp] of Object.entries(FP)) {
			if (!myFP || !myFP[activity] || fp.length !== myFP[activity].length) {
				newFPChange[activity] = fp.length - (myFP[activity]?.length ?? 0);
				change = true;
			}
		}
	}
	if (change) {
		setFPChange(newFPChange);
		setMyFP(FP);
	}

	let results = [];
	const rectSize = 17;
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
			highlightedInstancesIdx
		)
	);
	if (FP) {
		for (const [activityName, fp] of Object.entries(FP)) {
			results.push(
				createResRects(
					{ FP: fp, newFPs: newFPs, newFPsLabel: newFPsLabel, queryMode: props.queryMode },
					"FP",
					rectSize,
					props.onInstanceSelection,
					selectedInstancesIdx,
					highlightedInstancesIdx
				)
			);
		}
	}

	return (
		<div className="result-container">
            <div id="recog-section-title">
                <span key={"res_title"} className="section-title">
                    Recognition result
                </span>
            </div>
			<div key={"res_div2"} className="result-act-all-classes">
				{[...results]}
			</div>
            <div id="result-legends-container">
                <div>
                    <svg height={18} width={210}>
                        <rect y={3} width={15} height={7} fill={"#4D8E7F"} rx={2}></rect>
                        <text x={25} y={10}  style={{fontSize: 11}}>Correctly recognized activity samples</text>
                    </svg>
                </div>
                <div>
                    <svg height={18} width={210}>
                        <rect  y={3} width={15} height={7} fill={"#CE3151"} rx={2}></rect>
                        <text  x={25} y={10} style={{fontSize: 11}}>Incorrectly recognized activity samples</text>
                    </svg>
                </div>
                <div>
                    <svg height={18} width={210}>
                        <rect  y={3} width={15} height={7} fill={"#B4B2B2"} rx={2}></rect>
                        <text  x={25} y={10} style={{fontSize: 11}}>Not recognized activity samples</text>
                    </svg>
                </div>
            </div>
		</div>
	);
}

export default ResultsPanel;
