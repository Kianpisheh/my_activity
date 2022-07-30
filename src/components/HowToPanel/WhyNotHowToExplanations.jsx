import "./WhyNotHowToExplanations.css"

import AxiomTypes from "../../model/AxiomTypes";

import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/Icons";

function WhyNotHowToExplanations(props) {

    const { suggestions, onWhyHowToAxiomHover } = props;
	if (!Object.keys(suggestions).length) {
		return;
	}

    let suggestionItems = [];
	for (const suggestion of suggestions) {
		const { axiom } = suggestion;
		const suggestionType = suggestion.getType();
		if (suggestionType === "time_contraction" || suggestionType === "time_expansion" || suggestionType === "time_removal") {
			if (axiom.getType() === AxiomTypes.TYPE_DURATION) {
				suggestionItems.push(
					<DurationAdjustmentAxiom
						suggestion={suggestion}
						onWhyHowToAxiomHover={onWhyHowToAxiomHover}
                        timeRemoval={ suggestionType === "time_removal"}
					></DurationAdjustmentAxiom>
				);
			} else if (axiom.getType() === AxiomTypes.TYPE_TIME_DISTANCE) {
				suggestionItems.push(
					<TemporalAdjustmentAxiom
						suggestion={suggestion}
						onWhyHowToAxiomHover={onWhyHowToAxiomHover}
                        timeRemoval={ suggestionType === "time_removal"}
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

export default WhyNotHowToExplanations;

function TemporalAdjustmentAxiom(props) {
	const { axiom, suggestedAxiomData, newTPs, newFPs } = props.suggestion;
	const th1 = Math.round(suggestedAxiomData[0] * 10) / 10;
	const th2 = Math.round(suggestedAxiomData[1] * 10) / 10;
	const events = axiom.getEvents();
	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
	const Icon2 = Icons.getIcon(pascalCase(events[1]), true);
	const TimeDistIcon = Icons.getIcon("TimeDistance2");
	const Trashcan = Icons.getIcon("Trashcan");

    let color = "#3A2A0D";
    let sepColor = "#A5A2A2";
    if (props.timeRemoval) {
        color = "#BBBBBB";
        sepColor = "#BBBBBB";
    }

	return (
		<div
			className="temp-adj-axiom-container"
			onMouseOver={() => props.onWhyHowToAxiomHover(newTPs, newFPs, true)}
			onMouseLeave={() => props.onWhyHowToAxiomHover([], [], false)}
            style={{position: "relative"}}
		>
			<div className="temp-adj-icons">
				<div className="icon-container">
					<Icon1 style={{ fill: color, width: 25, height: 25 }}></Icon1>
				</div>
				<div className="icon-container" style={{ width: 100, height: 25 }}>
					<TimeDistIcon style={{ fill: color, width: 100, height: 25 }}></TimeDistIcon>
				</div>
				<div className="icon-container" style={{ width: 25, height: 25 }}>
					<Icon2 style={{ fill: color, width: 25, height: 25 }}></Icon2>
				</div>
			</div>
			<div id="vertical-line-sep" style={{ borderLeft: "1px solid " + sepColor, height: "80%" }}></div>
			<div className="temp-adj-limits">
				<p style={{color: color}}>
					at least <span style={{ fontWeight: 600 }}>{th1}</span> sec later{" "}
				</p>
				<p style={{color: color}}>
					at most <span style={{ fontWeight: 600 }}>{th2}</span> sec later
				</p>
			</div>
            {props.timeRemoval && <p style={{position: "absolute", fontSize: 36, color: "#E35A73", opacity: 0.8}}>Remove</p>}
            {props.timeRemoval && <div className="icon-container" style={{ right: "20%", position: "absolute", width: 30, height: 30 }}>
					<Trashcan style={{ stroke: "#E56F84", fill: "none", width: 40, height: 40}}></Trashcan>
			</div>}
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

    let color = "#3A2A0D";
    if (props.timeRemoval) {
        color = "#999999"
    }

	return (
		<div
			className="temp-adj-axiom-container"
			onMouseOver={() => props.onWhyHowToAxiomHover(newTPs, newFPs)}
			onMouseLeave={() => props.onWhyHowToAxiomHover([], [])}
		>
			<div className="duration-adj-icons">
				<div className="icon-container">
					<Icon1 style={{ fill: color, width: 25, height: 25, marginTop: -15 }}></Icon1>
				</div>
				<div className="icon-container" style={{ width: 100, height: 10, marginTop: -17 }}>
					<TimeDistIcon style={{ fill:color, width: 100, height: 10 }}></TimeDistIcon>
				</div>
			</div>
			<div id="vertical-line-sep" style={{ borderLeft: "1px solid #A5A2A2", height: "80%" }}></div>
			<div className="temp-adj-limits">
				<p style={{color: color}}>
					at least for <span style={{ fontWeight: 600 }}>{th1}</span> sec{" "}
				</p>
				<p style={{color: color}}>
					at most for <span style={{ fontWeight: 600 }}>{th2}</span> sec
				</p>
			</div>
		</div>
	);
}
