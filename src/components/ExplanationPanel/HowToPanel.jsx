import "./HowToPanel.css";

import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";
import AxiomTypes from "../../model/AxiomTypes";

function HowToPanel(props) {
	if (!props.whyNotHowToSuggestion) {
		return;
	}

	const { whyNotHowToSuggestion } = props;
	let howToSuggestionsElements = [];

	if (whyNotHowToSuggestion[AxiomTypes.AX_CHANGE_LIMIT_EXPANTION]) {
		const { axiom, th1, th2, oldTh1, oldTh2, newFPs, newTPs } =
			whyNotHowToSuggestion[AxiomTypes.AX_CHANGE_LIMIT_EXPANTION];
		if (!axiom || axiom === "") {
			return;
		}

		const axType = axiom.split(":")[0];
		if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
			const Icon1 = Icons.getIcon(pascalCase(axiom.split(":")[1]), true);
			const Icon2 = Icons.getIcon(pascalCase(axiom.split(":")[2]), true);
			const UpArrow = Icons.getIcon("UpArrow");
			const DownArrow = Icons.getIcon("DownArrow");
			const TimeDistIcon = Icons.getIcon("TimeDistance");

			let timeExAx = (
				<div
					key={"t_div-how-to"}
					className="how-time-distance-axiom"
					onMouseOver={() => props.onHowToAxiomHover(newTPs, newFPs)}
					onMouseLeave={() => props.onHowToAxiomHover([], [])}
				>
					<div
						key={"ic1-howto"}
						className="howto-time-dist-icons-container"
					>
						<Icon1
							key={"ic1-how-to"}
							style={{
								width: 22,
								height: 22,
								fill: "#3A2A0D",
							}}
						></Icon1>
						<TimeDistIcon
							style={{
								width: 65,
								height: 30,
								marginTop: "-8px",
								fill: "#3A2A0D",
							}}
						></TimeDistIcon>
						<Icon2
							key={"ic2-how-to"}
							style={{
								width: 22,
								height: 22,
								fill: "#3A2A0D",
							}}
						></Icon2>
					</div>
					<span className="how-to-lower-td-div">
						{th1 - oldTh1 > 0 && (
							<UpArrow
								key={"left-up-arrow"}
								style={{
									width: 12,
									height: 18,
									fill: "#1391D8",
									paddingLeft: 3,
								}}
							></UpArrow>
						)}
						{th1 - oldTh1 < 0 && (
							<DownArrow
								key={"left-down-arrow"}
								style={{
									width: 12,
									height: 18,
									fill: "#1391D8",
									paddingLeft: 3,
								}}
							></DownArrow>
						)}
						<span style={{ fontSize: 11, color: "#3A2A0D" }}>
							{th1}
						</span>
						<span style={{ fontSize: 11, color: "#3A2A0D" }}>
							{" < duration < "}
						</span>
						<span style={{ fontSize: 11, color: "#3A2A0D" }}>
							{" "}
							{th2}
						</span>
						{th2 - oldTh2 > 0 && (
							<UpArrow
								key={"right-up-arrow"}
								style={{
									width: 12,
									height: 18,
									fill: "#1391D8",
									paddingLeft: 3,
								}}
							></UpArrow>
						)}
						{th2 - oldTh2 < 0 && (
							<DownArrow
								key={"right-down-arrow"}
								style={{
									width: 12,
									height: 18,
									fill: "#1391D8",
									paddingLeft: 3,
								}}
							></DownArrow>
						)}
					</span>
				</div>
			);

			howToSuggestionsElements.push(timeExAx);
		}
	}

	if (whyNotHowToSuggestion[AxiomTypes.AX_CHANGE_TEMPORAL_REMOVAL]) {
		const { newTPs, newFPs, axiom, th1, th2 } =
			whyNotHowToSuggestion[AxiomTypes.AX_CHANGE_TEMPORAL_REMOVAL];
		const axType = axiom.split(":")[0];
		if (axType === AxiomTypes.TYPE_TIME_DISTANCE) {
			const Icon1 = Icons.getIcon(pascalCase(axiom.split(":")[1]), true);
			const Icon2 = Icons.getIcon(pascalCase(axiom.split(":")[2]), true);
			const TimeDistIcon = Icons.getIcon("TimeDistance");
			let tempRemAx = (
				<div
					key={"rem_div-how-to"}
					className="how-time-distance-axiom"
					onMouseOver={() => props.onHowToAxiomHover(newTPs, newFPs)}
					onMouseLeave={() => props.onHowToAxiomHover([], [])}
				>
					<div
						key={"ic1-howto"}
						className="howto-time-dist-icons-container"
					>
						<Icon1
							key={"ic1-how-to"}
							style={{
								width: 22,
								height: 22,
								fill: "#3A2A0D",
							}}
						></Icon1>
						<TimeDistIcon
							style={{
								width: 65,
								height: 30,
								marginTop: "-8px",
								fill: "#3A2A0D",
							}}
						></TimeDistIcon>
						<Icon2
							key={"ic2-how-to"}
							style={{
								width: 22,
								height: 22,
								fill: "#3A2A0D",
							}}
						></Icon2>
					</div>
					<span className="how-to-lower-td-div">
						<span style={{ fontSize: 11, color: "#3A2A0D" }}>
							{th1}
						</span>
						<span style={{ fontSize: 11, color: "#3A2A0D" }}>
							{" < duration < "}
						</span>
						<span style={{ fontSize: 11, color: "#3A2A0D" }}>
							{" "}
							{th2}
						</span>
					</span>
				</div>
			);
			howToSuggestionsElements.push(tempRemAx);
		}
	}

	return (
		<div className="how-to-panel-container">{howToSuggestionsElements}</div>
	);
}

export default HowToPanel;
