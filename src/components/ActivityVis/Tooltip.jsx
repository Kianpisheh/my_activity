function Tooltip(props) {
	const toolTip = (
		<text key={props.idx + "tex"} style={{ fontSize: 11, fill: "#FFFFFF" }} x={props.x} y={props.y}>
			{props.text}
		</text>
	);
	const tooltipRect = (
		<rect
			key={props.idx + "rr"}
			rx={3}
			x={props.x - 4}
			y={props.y - 12}
			width={props.text.length * 7 + 3}
			height={17}
			fill="#796f52"
		></rect>
	);
	return [tooltipRect, toolTip];
}

export default Tooltip;
