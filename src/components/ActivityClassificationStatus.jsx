import { useState } from "react";

import "./ActivityClassificationStatus.css";

function ActivityClassificationStatus(props) {
    const { FP, FN, TP, N } = props.classificationResult;
    const [myTP, setMyTP] = useState(0);
    const [myFP, setMyFP] = useState({});
    const [targetChange, setTargetChange] = useState(0);

    const [fpChange, setFPChange] = useState({});

    if (
        props.classificationResult["TP"] &&
        props.classificationResult["TP"].length !== myTP
    ) {
        setTargetChange(props.classificationResult["TP"].length - myTP);
        setMyTP(props.classificationResult["TP"].length);
    }

    // check if FPs have changed
    let newFPChange = {};
    let change = false;
    if (FP) {
        for (let [activity, fp] of Object.entries(FP)) {
            if (
                !myFP ||
                !myFP[activity] ||
                fp.length !== myFP[activity].length
            ) {
                newFPChange[activity] =
                    fp.length - (myFP[activity]?.length ?? 0);
                change = true;
            }
        }
    }
    if (change) {
        setFPChange(newFPChange);
        setMyFP(FP);
    }

    // if (
    //     props.classificationResult["FP"] &&
    //     Object.keys(props.classificationResult["FP"]).length !== myFP
    // ) {
    //     setFPChange(Object.keys(props.classificationResult["FP"]).length - myFP);
    //     setMyFP(Object.keys(props.classificationResult["FP"]).length);
    // }

    if (!FP || !N || !TP || !FN) {
        return;
    }

    const svgDivWidth = 0.85 * props.parentWidth;
    const svgWidth = 0.85 * 0.85 * svgDivWidth;
    const svgChangeWidth = 0.15 * 0.85 * svgDivWidth;
    const rectSize = 17;
    let gap = 10;
    const rectColNum = Math.floor(svgWidth / (rectSize + gap));
    gap = (svgWidth - rectColNum * rectSize) / (rectColNum + 1);
    const rectRowNum = Math.ceil(N / rectColNum);
    const svgHeight = rectRowNum * rectSize + (rectRowNum + 1) * gap;

    // create TP+FN rects
    let targetActivityRects = [];
    for (let i = 0; i < rectRowNum; i++) {
        for (let j = 0; j < rectColNum; j++) {
            if (i * rectColNum + j === N) {
                break;
            }
            let idx = i * rectColNum + j;
            let color = "#CE3131";
            if (idx < TP.length) {
                color = "#4D8E7F";
            }
            let rx = j * rectSize + (j + 1) * gap;
            let ry = i * rectSize + (i + 1) * gap;
            targetActivityRects.push(
                <rect
                    className="tar-act-rect"
                    key={idx}
                    x={rx}
                    y={ry}
                    width={rectSize}
                    height={rectSize}
                    fill={color}
                    rx={3}
                    onClick={() =>
                        handleRectClick(
                            idx,
                            "target_activity",
                            props.onInstanceClick
                        )
                    }
                ></rect>
            );
        }
    }

    // create the target activity change
    let targetChangeColor = "#CE3131";
    let rotation = "rotate(180, 6, 6)";
    if (targetChange > 0) {
        targetChangeColor = "#4D8E7F";
        rotation = "rotate(0, 6, 6)";
    } else if (targetChange === 0) {
        targetChangeColor = "#f9f7f1";
    }

    function handleRectClick(idx, type, onInstanceClickCallback) {
        if (type === "target_activity") {
            if (idx < TP.length) {
                onInstanceClickCallback(TP[idx]);
            } else {
                onInstanceClickCallback(FN[idx - TP.length]);
            }
        } else {
        }
    }

    // FP status
    let allRectsList = [targetActivityRects];
    let allSvgHeightFP = [svgHeight];

    if (FP) {
        for (const [activity, fp] of Object.entries(FP)) {
            let rectsRes = createFPRect(
                svgWidth,
                fp,
                props.onInstanceClick,
                activity
            );
            allRectsList.push(rectsRes["fpRects"]);
            allSvgHeightFP.push(rectsRes["svgHeightFP"]);
        }
    }

    let targetChangeSvg = (
        <svg className="change-svg" key={"change_t"} width={svgChangeWidth} height={allSvgHeightFP[0]}>
            <text x="-1" y="35" fontSize={12}>
                {targetChange}
            </text>
            {triangle(targetChangeColor, rotation)}
        </svg>
    );
    let allFPChangeList = [targetChangeSvg];
    let kk = 0;
    for (const [activity, fpCng] of Object.entries(fpChange)) {
        let changeSvg = (
            <svg
                className="change-svg"
                key={"change_" + kk}
                width={svgChangeWidth}
                height={allSvgHeightFP[kk + 1]}
            >
                <text x="2" y="37" fontSize={12}>
                    {fpCng}
                </text>
                {triangle(
                    fpCng > 0 ? "#CE3131" : "#4D8E7F",
                    fpCng > 0 ? "rotate(0, 6, 6)" : "rotate(180, 6, 6)"
                )}
            </svg>
        );
        allFPChangeList.push(changeSvg);
        kk += 1;
    }

    return (
        <div className="classification-status-container">
            <ul>
                {allRectsList.map((rects, ii) => {
                    return (
                        <li>
                            <span className="stat-title-span">{Object.keys(fpChange)[ii]}</span>
                            <span className="stat-span">
                                <svg
                                    className="fp-activities-svg"
                                    width={svgWidth}
                                    height={allSvgHeightFP[ii]}
                                    x={0}
                                    y={0}
                                >
                                    {rects}
                                </svg>
                                {allFPChangeList[ii]}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

function triangle(color, rotation) {
    return (
        <svg>
            <polygon
                transform={rotation + "translate(0,12)"}
                points="0 12, 12 12, 6 0"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill={color}
            ></polygon>
        </svg>
    );
}

function createFPRect(svgWidth, FP, onInstanceClick, activityName) {
    const rectSize = 17;
    let gap = 10;
    const rectColNum = Math.floor(svgWidth / (rectSize + gap));
    gap = (svgWidth - rectColNum * rectSize) / (rectColNum + 1);
    let fpRects = [];
    let fpNum = Object.keys(FP).length;
    const rectRowNumFP = Math.ceil(fpNum / rectColNum);
    const svgHeightFP = rectRowNumFP * rectSize + (rectRowNumFP + 1) * gap;
    for (let i = 0; i < rectRowNumFP; i++) {
        for (let j = 0; j < rectColNum; j++) {
            if (i * rectColNum + j === fpNum) {
                break;
            }
            let idx = i * rectColNum + j;
            let rx = j * rectSize + (j + 1) * gap;
            let ry = i * rectSize + (i + 1) * gap;
            fpRects.push(
                <rect
                    key={"fp_" + idx + "_" + activityName}
                    className={"fp-act-rect"}
                    x={rx}
                    y={ry}
                    width={rectSize}
                    height={rectSize}
                    fill={"#CE3131"}
                    rx={3}
                    onClick={() => onInstanceClick(FP[idx])}
                ></rect>
            );
        }
    }

    return { fpRects, svgHeightFP };
}

export default ActivityClassificationStatus;
