import "./WhyNotHowToExplanations.css";

import AxiomTypes from "../../model/AxiomTypes";

import { pascalCase } from "../../Utils/utils";
import Icons from "../../icons/objects/Icons";
import React from "react";

function WhyNotHowToExplanations(props) {
	const { suggestions, onWhyHowToAxiomHover } = props;
	if (!Object.keys(suggestions).length) {
		return;
	}

	let suggestionItems = [];
	for (const suggestion of suggestions) {
		const { axiom } = suggestion;
		const suggestionType = suggestion.getType();
		if (suggestionType === "time_expansion" || suggestionType === "time_removal") {
			if (axiom.getType() === AxiomTypes.TYPE_DURATION) {
				suggestionItems.push(
					<DurationAdjustmentAxiom
						suggestion={suggestion}
						onWhyHowToAxiomHover={onWhyHowToAxiomHover}
						timeRemoval={suggestionType === "time_removal"}
					></DurationAdjustmentAxiom>
				);
			} else if (axiom.getType() === AxiomTypes.TYPE_TIME_DISTANCE) {
				suggestionItems.push(
					<TemporalAdjustmentAxiom
						suggestion={suggestion}
						onWhyHowToAxiomHover={onWhyHowToAxiomHover}
						timeRemoval={suggestionType === "time_removal"}
					></TemporalAdjustmentAxiom>
				);
			}
		} else if (suggestionType === "interaction_removal") {
			suggestionItems.push(
				<InteractionRemovalAxiom
					suggestion={suggestion}
					onWhyHowToAxiomHover={onWhyHowToAxiomHover}
				></InteractionRemovalAxiom>
			);
		}
	}

	return (
		<div className="suggestions-container" style={{ width: props.width }}>
			{suggestionItems}
		</div>
	);
}

export default WhyNotHowToExplanations;

export function InteractionRemovalAxiom(props) {
	const { axiom, newTPs, newFPs } = props.suggestion;
	const events = axiom.getEvents();
	const Icon = Icons.getIcon(pascalCase(events[0]), true);

	return (
		<div>
			<span className="suggestion-subtitle">Removing the interaction condition</span>
			<div
				className="temp-adj-axiom-container"
				onMouseOver={() => props.onWhyHowToAxiomHover(newTPs, newFPs, true)}
				onMouseLeave={() => props.onWhyHowToAxiomHover([], [], false)}
				style={{ position: "relative", cursor: "pointer" }}
			>
				<div className="icon-container2">
					<svg width={25} height={25}>
						<Icon fill="#BBBBBB" style={{ width: 25, height: 25 }} />
						<svg width={25} height={25}>
							<line x1={0} x2={25} y1={25} y2={0} stroke="var(--missing-line)" strokeWidth={3} />
						</svg>
					</svg>
				</div>
			</div>
		</div>
	);
}

export function TemporalAdjustmentAxiom(props) {
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

	let changing = "Shrinking";
	if (axiom.getTh1() > th1 || axiom.getTh2() < th2) {
		changing = "Expanding";
	}

	return (
		<div
			style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
		>
			{props.timeRemoval && <span className="suggestion-subtitle">Removing the time distance condition</span>}
			{!props.timeRemoval && <span className="suggestion-subtitle">{changing} the time limits</span>}
			<div
				className="temp-adj-axiom-container"
				onMouseOver={() => props.onWhyHowToAxiomHover(newTPs, newFPs, true)}
				onMouseLeave={() => props.onWhyHowToAxiomHover([], [], false)}
				style={{ position: "relative" }}
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
					<p style={{ color: color }}>
						at least <span style={{ fontWeight: 600 }}>{th1}</span> sec later{" "}
					</p>
					<p style={{ color: color }}>
						at most <span style={{ fontWeight: 600 }}>{th2}</span> sec later
					</p>
				</div>
				{props.timeRemoval && (
					<p style={{ position: "absolute", fontSize: 36, color: "#E35A73", opacity: 0.8 }}>Remove</p>
				)}
				{props.timeRemoval && (
					<div
						className="icon-container"
						style={{ right: "20%", position: "absolute", width: 30, height: 30 }}
					>
						<Trashcan style={{ stroke: "#E56F84", fill: "none", width: 40, height: 40 }}></Trashcan>
					</div>
				)}
			</div>
		</div>
	);
}

export function InteractionORAdditionAxiom(props) {
	const { axiom, newTPs, newFPs } = props.suggestion;
	const events = axiom.getEvents();

	return (
		<React.Fragment>
			<div
				className="interaction-or-axiom"
				onMouseOver={() => props.onWhyHowToAxiomHover(newTPs, newFPs, true)}
				onMouseLeave={() => props.onWhyHowToAxiomHover([], [], false)}
			>
				{events.map((ev, idx) => {
					const Icon = Icons.getIcon(pascalCase(ev), true);
					return (
						<React.Fragment>
							<Icon
								style={{
									width: 25,
									height: 25,
									fill: "#3A2A0D",
								}}
							></Icon>
							{idx < events.length - 1 && (
								<span key={idx + "or_int"} style={{ fontSize: 14 }}>
									OR
								</span>
							)}
						</React.Fragment>
					);
				})}
			</div>
		</React.Fragment>
	);
}

export function InteractionAdditionAxiom(props) {
	const { axiom, newTPs, newFPs } = props.suggestion;
	const newEvents = axiom.getEvents();

	const currentEvents = props.currentActivity.getEvents();

	let currentIcons = [];
	for (let ev of currentEvents) {
		const Icon = Icons.getIcon(pascalCase(ev), true);
		currentIcons.push(
			<svg width={25} height={25}>
				<Icon fill="#3A2A0D" style={{ width: 25, height: 25 }} />
			</svg>
		);
	}
	let newIcons = [];
	for (let ev of newEvents) {
		const Icon = Icons.getIcon(pascalCase(ev), true);
		newIcons.push(
			<svg width={25} height={25}>
				<Icon fill="#3A2A0D" style={{ width: 25, height: 25 }} />
			</svg>
		);
	}
	return (
		<div
			key={props.suggestionId}
			className="temp-adj-axiom-container"
			onMouseOver={() => props.onWhyHowToAxiomHover(newTPs, newFPs, true)}
			onMouseLeave={() => props.onWhyHowToAxiomHover([], [], false)}
			style={{ position: "relative", cursor: "pointer" }}
		>
			<div className="icon-container3">
				{[...currentIcons]}
				<svg height={10} width={70}>
					<line x1={0} y1={5} x2={65} y2={5} stroke="#555555" strokeWidth={1.5}></line>
					<polygon points={[70, 5, 65, 0, 65, 10]} fill="#555555"></polygon>
				</svg>
				{[...newIcons]}
			</div>
		</div>
	);
}

export function DurationAdjustmentAxiom(props) {
	const { axiom, suggestedAxiomData, newFPs, newTPs } = props.suggestion;
	const th1 = Math.round(suggestedAxiomData[0] * 10) / 10;
	const th2 = Math.round(suggestedAxiomData[1] * 10) / 10;
	const events = axiom.getEvents();
	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
	const TimeDistIcon = Icons.getIcon("TimeDistance3");
	const Trashcan = Icons.getIcon("Trashcan");

	let color = "#3A2A0D";
	if (props.timeRemoval) {
		color = "#999999";
	}

	let changing = "Shrinking";
	if (axiom.getTh1() > th1 || axiom.getTh2() < th2) {
		changing = "Expanding";
	}

	return (
		<div
			style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
		>
			{props.timeRemoval && <span className="suggestion-subtitle">Removing the duration condition</span>}
			{!props.timeRemoval && <span className="suggestion-subtitle">{changing} the time limits</span>}
			<div
				className="temp-adj-axiom-container"
				onMouseOver={() => props.onWhyHowToAxiomHover(newTPs, newFPs, true)}
				onMouseLeave={() => props.onWhyHowToAxiomHover([], [], false)}
				style={{ position: "relative" }}
			>
				<div className="duration-adj-icons">
					<div className="icon-container">
						<Icon1 style={{ fill: color, width: 25, height: 25, marginTop: -15 }}></Icon1>
					</div>
					<div className="icon-container" style={{ width: 100, height: 10, marginTop: -17 }}>
						<TimeDistIcon style={{ fill: color, width: 100, height: 10 }}></TimeDistIcon>
					</div>
				</div>
				<div id="vertical-line-sep" style={{ borderLeft: "1px solid #A5A2A2", height: "80%" }}></div>
				<div className="temp-adj-limits">
					<p style={{ color: color }}>
						at least for <span style={{ fontWeight: 600 }}>{th1}</span> sec{" "}
					</p>
					<p style={{ color: color }}>
						at most for <span style={{ fontWeight: 600 }}>{th2}</span> sec
					</p>
				</div>
				{props.timeRemoval && (
					<p style={{ position: "absolute", fontSize: 36, color: "#E35A73", opacity: 0.8 }}>Remove</p>
				)}
				{props.timeRemoval && (
					<div
						className="icon-container"
						style={{ right: "20%", position: "absolute", width: 30, height: 30 }}
					>
						<Trashcan style={{ stroke: "#E56F84", fill: "none", width: 40, height: 40 }}></Trashcan>
					</div>
				)}
			</div>
		</div>
	);
}
