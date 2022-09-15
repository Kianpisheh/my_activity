function createResRects(data, type, rectSize, onRectSelection, selectedIdx, highlightedIdx, activity) {
	let color = "#CE3131";
	let opacity = 1;
	let res = [];

	data["newFPs"] ??= [];
	data["newTPs"] ??= [];

	if (type === "TPFN") {
		res = data["TP"].concat(data["FN"]);
	} else {
		res = Array.from(new Set(data["FP"].concat(data["newFPs"])));
	}

	return (
		<div key={data["key"]}>
			<span style={{ fontSize: 13, color: "var(--list-item-text)" }}>{data["fpActivity"]}</span>
			<div className="results-rects-container">
				{res.map((r, idx) => {
					let resType = "FP";
					if (type === "TPFN") {
						color = idx < data["TP"].length ? "#4D8E7F" : "#B4B2B2";
						resType = idx < data["TP"].length ? "TP" : "FN";
					} else if (type === "FP") {
						resType = "FP";
					}

					// removed false positives
					if (
						data &&
						data["FP"] &&
						data["FP"].includes(r) &&
						!data["newFPs"].includes(r) &&
						data["queryMode"]
					) {
						color = "url(#gradient4)";
					}

					// new false positives
					if (
						data &&
						data["FP"] &&
						data["newFPs"].includes(r) &&
						!data["FP"].includes(r) &&
						data["queryMode"]
					) {
						color = "url(#gradient3)";
					}

					// new true positives
					if (
						data &&
						data["TP"] &&
						data["newTPs"].includes(r) &&
						!data["TP"].includes(r) &&
						data["queryMode"]
					) {
						color = "url(#gradient)";
					}

					// removed true positives (i.e., new FNs)
					if (
						data &&
						data["TP"] &&
						!data["newTPs"].includes(r) &&
						data["TP"].includes(r) &&
						data["queryMode"]
					) {
						color = "url(#gradient2)";
					}

					// style border if the instance is selected
					let sw = 0;
					for (const values of Object.values(selectedIdx)) {
						if (values.includes(r)) {
							sw = 3;
						}
					}

					// style for assciated instances with the hovered why-not axiom
					let fi = "";
					if (highlightedIdx && highlightedIdx.includes(r)) {
						fi = "drop-shadow(0px 0px 5px rgb(255 0 0 / 0.9))";
					}

					if (data["AllFPs"] && data["FN"]) {
						if (idx < data["TP"].length && data["AllFPs"].includes(data["TP"][idx])) {
							color = "#4EAB2B";
						}
						// const fnIdx = data["FN"][idx - data["TP"].length];
						// if (data["AllFPs"].includes(fnIdx) && data["TP"].includes(fnIdx)) {
						// }
					}

					return (
						<svg key={idx + "_rect-container"} width={rectSize + 4} height={rectSize + 4} filter={fi}>
							<defs>
								{/* new false positives gradient */}
								<linearGradient id="gradient3" gradientTransform="rotate(109.6)">
									<stop offset="6%" stop-color="rgba(200,200,200,0.5)" />
									<stop offset="15%" stop-color="rgba(242,0,39,0.3)" />
									<stop offset="100%" stop-color="rgba(242,0,39,0.5)" />
								</linearGradient>
								{/* removed false positives gradient */}
								<linearGradient id="gradient4" gradientTransform="rotate(109.6)">
									<stop offset="6%" stop-color="rgba(242,0,39,1)" />
									<stop offset="30%" stop-color="rgba(242,0,39,0.3)" />
									<stop offset="100%" stop-color="rgba(200,200,200,0.5)" />
								</linearGradient>
								<linearGradient id="gradient" gradientTransform="rotate(109.6)">
									<stop offset="3.2%" stop-color="#B4B2B2" />
									<stop offset="51.1%" stop-color="#4D8E7F" />
								</linearGradient>
								<linearGradient id="gradient2" gradientTransform="rotate(109.6)">
									<stop offset="0%" stop-color="rgba(77,142,127,1)" />
									<stop offset="20%" stop-color="rgba(152,152,166,1)" />
									<stop offset="100%" stop-color="rgba(210,210,210,1)" />
								</linearGradient>
							</defs>
							<rect
								className="tar-act-rect"
								key={idx + "_rectt"}
								width={rectSize}
								height={rectSize}
								fill={color}
								fillOpacity={opacity}
								stroke={"#4784FF"}
								strokeWidth={sw}
								rx={3}
								x={2}
								y={2}
								onClick={() => onRectSelection(r, resType, activity)}
							></rect>
						</svg>
					);
				})}
			</div>
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
			<circle cx={10} cy={10} r={10} fill="var(--explanation)"></circle>
			<text x={11 - offset} y="50%" dominantBaseline={"middle"} textAnchor={"middle"} fontSize={11} fill="white">
				{num}
			</text>
		</svg>
	);
}

export function CircleQMark() {
	return (
		<svg width={22} height={22} viewBox="0 0 22 22">
			<circle cx={10} cy={10} r={10} fill="var(--explanation)"></circle>
			<text x={10} y="50%" dominantBaseline={"middle"} textAnchor={"middle"} fontSize={11} fill="white">
				?
			</text>
		</svg>
	);
}

export function subtractIntervals(ts1, te1, ts2, te2) {
	// i1 is enclosed by i2
	if (ts1 > ts2 && ts1 < te2 && te1 > ts2 && te1 < te2) {
		return [];
	} else if (ts1 > ts2 && ts1 < te2 && te1 > te2) {
		if (te2 + 1 < te1) {
			return [[te2 + 1, te1]];
		} else {
			return [];
		}
	} else if (ts1 < ts2 && te1 > ts2 && te1 < te2) {
		if (ts2 - 1 > ts1) {
			return [[ts1, ts2 - 1]];
		} else {
			return [];
		}
	} else if (ts1 < ts2 && te1 > te2) {
		let intervals = [];
		let interval1 = [];
		if (ts2 - 1 > ts1) {
			interval1 = [ts1, ts2 - 1];
		}
		if (interval1.length) {
			intervals.push(interval1);
		}
		let interval2 = [];
		if (te2 + 1 < te1) {
			interval2 = [te2 + 1, te1];
		}
		if (interval2.length) {
			intervals.push(interval2);
		}
		return intervals;
	} else {
		return [];
	}
}

export { createResRects, triangle, CircleNum };
