import "./HowToPanel2.css";

import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/Icons";
import AxiomTypes from "../../model/AxiomTypes";

function HowToPanel2(props) {
	const { suggestions, onWhyHowToAxiomHover } = props;
	if (!Object.keys(suggestions).length) {
		return;
	}

	let suggestionItems = [];
	for (const suggestion of suggestions) {
		const { axiom } = suggestion;
		const suggestinType = suggestion.getType();
		if (suggestinType === "time_contraction" || suggestinType === "time_expansion") {
			if (axiom.getType() === AxiomTypes.TYPE_DURATION) {
				suggestionItems.push(
					<DurationAdjustmentAxiom
						suggestion={suggestion}
						onWhyHowToAxiomHover={onWhyHowToAxiomHover}
					></DurationAdjustmentAxiom>
				);
			} else if (axiom.getType() === AxiomTypes.TYPE_TIME_DISTANCE) {
				suggestionItems.push(
					<TemporalAdjustmentAxiom
						suggestion={suggestion}
						onWhyHowToAxiomHover={onWhyHowToAxiomHover}
					></TemporalAdjustmentAxiom>
				);
			}
		}
	}

	return (
		<div className="suggestions-container" style={{ width: props.width }}>
			{suggestionItems}
		</div>
	);
}

export default HowToPanel2;

function TemporalAdjustmentAxiom(props) {
	const { axiom, suggestedAxiomData, newTPs, newFPs } = props.suggestion;
	const th1 = Math.round(suggestedAxiomData[0] * 10) / 10;
	const th2 = Math.round(suggestedAxiomData[1] * 10) / 10;
	const events = axiom.getEvents();
	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
	const Icon2 = Icons.getIcon(pascalCase(events[1]), true);
	const TimeDistIcon = Icons.getIcon("TimeDistance2");

	return (
		<div
			className="temp-adj-axiom-container"
			onMouseOver={() => props.onWhyHowToAxiomHover(newTPs, newFPs, true)}
			onMouseLeave={() => props.onWhyHowToAxiomHover([], [], false)}
		>
			<div className="temp-adj-icons">
				<div className="icon-container">
					<Icon1 style={{ fill: "#3A2A0D", width: 25, height: 25 }}></Icon1>
				</div>
				<div className="icon-container" style={{ width: 100, height: 25 }}>
					<TimeDistIcon style={{ fill: "#807457", width: 100, height: 25 }}></TimeDistIcon>
				</div>
				<div className="icon-container" style={{ width: 25, height: 25 }}>
					<Icon2 style={{ fill: "#3A2A0D", width: 25, height: 25 }}></Icon2>
				</div>
			</div>
			<div id="vertical-line-sep" style={{ borderLeft: "1px solid #A5A2A2", height: "80%" }}></div>
			<div className="temp-adj-limits">
				<p>
					at least <span style={{ fontWeight: 600 }}>{th1}</span> sec later{" "}
				</p>
				<p>
					at most <span style={{ fontWeight: 600 }}>{th2}</span> sec later
				</p>
			</div>
		</div>
	);
}

function DurationAdjustmentAxiom(props) {
	const { axiom, suggestedAxiomData, newFPs, newTPs } = props.suggestion;
	const th1 = Math.round(suggestedAxiomData[0] * 10) / 10;
	const th2 = Math.round(suggestedAxiomData[1] * 10) / 10;
	const events = axiom.getEvents();
	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
	const TimeDistIcon = Icons.getIcon("TimeDistance3");

	return (
		<div
			className="temp-adj-axiom-container"
			onMouseOver={() => props.onWhyHowToAxiomHover(newTPs, newFPs)}
			onMouseLeave={() => props.onWhyHowToAxiomHover([], [])}
		>
			<div className="duration-adj-icons">
				<div className="icon-container">
					<Icon1 style={{ fill: "#3A2A0D", width: 25, height: 25, marginTop: -15 }}></Icon1>
				</div>
				<div className="icon-container" style={{ width: 100, height: 10, marginTop: -17 }}>
					<TimeDistIcon style={{ fill: "#807457", width: 100, height: 10 }}></TimeDistIcon>
				</div>
			</div>
			<div id="vertical-line-sep" style={{ borderLeft: "1px solid #A5A2A2", height: "80%" }}></div>
			<div className="temp-adj-limits">
				<p>
					at least for <span style={{ fontWeight: 600 }}>{th1}</span> sec{" "}
				</p>
				<p>
					at most for <span style={{ fontWeight: 600 }}>{th2}</span> sec
				</p>
			</div>
		</div>
	);
}
