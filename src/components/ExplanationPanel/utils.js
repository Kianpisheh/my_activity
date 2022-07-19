

function createResRects(res1, res2, type, rectSize, onRectSelection, selectedIdx, highlightedIdx) {
    let color = "#CE3131";
    let res = [];
    if (type === "TPFN") {
        res = res1.concat(res2);
    } else {
        res = [...res1]
    }
    return (
        <div className="results-rects-container">
            {res.map((r, idx) => {
                let resType = "FP";
                if (type === "TPFN") {
                    color = idx < res1.length ? "#4D8E7F" : "#CE3131"
                    resType = idx < res1.length ? "TP" : "FN";
                }

                // stylize border if selected
                let sw = 0;
                for (const values of Object.values(selectedIdx)) {
                    if (values.includes(r)) {
                        sw = 2;
                    }
                }

                let fi = "";
                if (highlightedIdx && highlightedIdx.includes(r)) {
                    fi = "drop-shadow(0px 0px 5px rgb(255 0 0 / 0.9))"
                }

                return (
                    <svg
                        key={idx + "_rect-container"}
                        width={rectSize + 4}
                        height={rectSize + 4}
                        filter={fi}
                    >
                        <rect
                            className="tar-act-rect"
                            key={idx + "_rectt"}
                            width={rectSize}
                            height={rectSize}
                            fill={color}
                            stroke={"#000000"}
                            strokeWidth={sw}
                            rx={3}
                            x={2}
                            y={2}
                            onClick={() =>
                                onRectSelection(r, resType)
                            }
                        ></rect>
                    </svg>
                );
            })}
        </div >
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

function CircleNum(num) {

    let offset = 1;
    if (num > 9) {
        offset = 2;
    }

    return <svg width={22} height={22} viewBox="0 0 22 22">
        <circle cx={10} cy={10} r={10} fill="#2DD8E3"></circle>
        <text x={11 - offset} y="50%" dominantBaseline={"middle"} textAnchor={"middle"} fontSize={11}>{num}</text>
    </svg>
}


export { createResRects, triangle, CircleNum };


  // // FP status
    // let allRectsList = [targetActivityRects];
    // let allSvgHeightFP = [svgHeight];

    // let targetChangeSvg = (
    //     <svg
    //         className="change-svg"
    //         key={"change_t"}
    //         width={svgChangeWidth}
    //         height={allSvgHeightFP[0]}
    //     >
    //         <text x="-1" y="35" fontSize={12}>
    //             {targetChange}
    //         </text>
    //         {triangle(targetChangeColor, rotation)}
    //     </svg>
    // );
    // let allFPChangeList = [targetChangeSvg];
    // let kk = 0;
    // for (const [activity, fpCng] of Object.entries(fpChange)) {
    //     let changeSvg = (
    //         <svg
    //             className="change-svg"
    //             key={"change_" + kk}
    //             width={svgChangeWidth}
    //             height={allSvgHeightFP[kk + 1]}
    //         >
    //             <text x="2" y="37" fontSize={12}>
    //                 {fpCng}
    //             </text>
    //             {triangle(
    //                 fpCng > 0 ? "#CE3131" : "#4D8E7F",
    //                 fpCng > 0 ? "rotate(0, 6, 6)" : "rotate(180, 6, 6)"
    //             )}
    //         </svg>
    //     );
    //     allFPChangeList.push(changeSvg);
    //     kk += 1;
    // }


     // // create the target activity change
    // let targetChangeColor = "#CE3131";
    // let rotation = "rotate(180, 6, 6)";
    // if (targetChange > 0) {
    //     targetChangeColor = "#4D8E7F";
    //     rotation = "rotate(0, 6, 6)";
    // } else if (targetChange === 0) {
    //     targetChangeColor = "#f9f7f1";
    // }