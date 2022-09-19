import "./ScalingTab.css";

import Icons from "../../icons/objects/Icons";

function ScalingTab(props) {
	const ZoomOutIcon = Icons.getIcon("ZoomOut");
	const ZoomInIcon = Icons.getIcon("ZoomIn");
	return (
		<div className="scaling-tab-container">
			<button
				className="zoom-btn"
				onClick={() => {
					props.onScaleChange("zoom_out", props.idx);
				}}
			>
				<svg width={18} height={18}>
					<ZoomOutIcon style={{ width: 18, height: 18, fill: "#3A2A0D" }}></ZoomOutIcon>
				</svg>
			</button>
			<button
				className="zoom-btn"
				onClick={() => {
					props.onScaleChange("zoom_in", props.idx);
				}}
			>
				<svg width={18} height={18}>
					<ZoomInIcon style={{ width: 18, height: 18, fill: "#3A2A0D" }}></ZoomInIcon>
				</svg>
			</button>
		</div>
	);
}

export default ScalingTab;
