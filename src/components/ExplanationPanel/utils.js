function createResRects(
	data,
	type,
	rectSize,
	onRectSelection,
	selectedIdx,
	highlightedIdx
) {
	let color = "#CE3131";
	let opacity = 1;
	let res = [];
	if (type === "TPFN") {
		res = data["TP"].concat(data["FN"]);
	} else {
		res = data["FP"].concat(data["newFPs"]);
	}

	return (
		<div className="results-rects-container">
			{res.map((r, idx) => {
				let resType = "FP";
				if (type === "TPFN") {
					color = idx < data["TP"].length ? "#4D8E7F" : "#B4B2B2";
					resType = idx < data["TP"].length ? "TP" : "FN";
				} else if (type === "FP") {
					resType = "FP";
					opacity = idx >= data["FP"].length ? 0.5 : 1;
				}
				if (data["newTPs"] && data["newTPs"].includes(r)) {
					color = "url(#gradient)";
				}

				// style border if the instance is selected
				let sw = 0;
				for (const values of Object.values(selectedIdx)) {
					if (values.includes(r)) {
						sw = 2;
					}
				}

				// style for assciated instances with the hovered why-not axiom
				let fi = "";
				if (highlightedIdx && highlightedIdx.includes(r)) {
					fi = "drop-shadow(0px 0px 5px rgb(255 0 0 / 0.9))";
				}

				return (
					<svg
						key={idx + "_rect-container"}
						width={rectSize + 4}
						height={rectSize + 4}
						filter={fi}
					>
						<defs>
							<linearGradient
								id="gradient"
								gradientTransform="rotate(109.6)"
							>
								<stop offset="3.2%" stop-color="#B4B2B2" />
								<stop offset="51.1%" stop-color="#4D8E7F" />
							</linearGradient>
						</defs>
						<rect
							className="tar-act-rect"
							key={idx + "_rectt"}
							width={rectSize}
							height={rectSize}
							fill={color}
							fillOpacity={opacity}
							stroke={"#000000"}
							strokeWidth={sw}
							rx={3}
							x={2}
							y={2}
							onClick={() => onRectSelection(r, resType)}
						></rect>
					</svg>
				);
			})}
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

function CircleNum(num) {
	let offset = 1;
	if (num > 9) {
		offset = 2;
	}

	return (
		<svg width={22} height={22} viewBox="0 0 22 22">
			<circle cx={10} cy={10} r={10} fill="#2DD8E3"></circle>
			<text
				x={11 - offset}
				y="50%"
				dominantBaseline={"middle"}
				textAnchor={"middle"}
				fontSize={11}
			>
				{num}
			</text>
		</svg>
	);
}

export function subtractIntervals(ts1, te1, ts2, te2) {
	// i1 is enclosed by i2
	if (ts1 > ts2 && ts1 < te2 && te1 > ts2 && te1 < te2) {
		return [];
	} else if (ts1 > ts2 && ts1 < te2 && te1 > te2) {
		return [[te2, te1]];
	} else if (ts1 < ts2 && te1 > ts2 && te1 < te2) {
		return [[ts1, ts2]];
	} else if (ts1 < ts2 && te1 > te2) {
		return [
			[ts1, ts2],
			[te2, te1],
		];
	} else {
		return [[ts1, te1]];
	}
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
