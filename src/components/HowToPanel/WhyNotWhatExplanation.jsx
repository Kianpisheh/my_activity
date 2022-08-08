import "./WhyNotWhatExplanation.css";

import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";
import AxiomTypes from "../../model/AxiomTypes";
import { CircleNum } from "../ResultsPanel/utils";

function WhyNotWhatExplanation(props) {
	const { stats } = props;
	if (!stats) {
		return;
	}

	const axiom = stats.getAxiom();
	const axiomType = axiom?.getType();

	let axiomStatComp = null;
	let axiomStatText = null;
	if (axiomType === AxiomTypes.TYPE_TIME_DISTANCE) {
		axiomStatText = <TimeDistanceAxiomStatText stats={stats}></TimeDistanceAxiomStatText>;
		axiomStatComp = <TimeDistanceAxiomStat stats={stats} axiom={axiom}></TimeDistanceAxiomStat>;
	} else if (axiomType === AxiomTypes.TYPE_DURATION) {
		axiomStatText = <DurationAxiomStatText stats={stats}></DurationAxiomStatText>;
		axiomStatComp = <DurationAxiomStat stats={stats} axiom={axiom}></DurationAxiomStat>;
	} else {
		return;
	}

	return (
		<div className="stat-container">
			<div className="text-explanation-container">{axiomStatText}</div>
			<div className="stat-axiom-explanation-container">{axiomStatComp}</div>
			<div
				id="why-not-what-qmark"
				onClick={(ev) => {
					props.onWhyNotHowTo(ev.pageX, ev.pageY);
				}}
			>
				{CircleNum("?")}
			</div>
		</div>
	);
}

export default WhyNotWhatExplanation;

export function DurationAxiomStat(props) {
	const { stats, axiom } = props;
	const event = axiom.getEvents()?.[0];

	return (
		<div className="td-stat-container">
			<DurationStat
				key={"duration1"}
				event={event}
				mind={stats.minDuration1}
				maxd={stats.maxDuration1}
			></DurationStat>
		</div>
	);
}

export function TimeDistanceAxiomStat(props) {
	const { stats, axiom } = props;
	const { minTimeDistance, maxTimeDistance, minDuration1, minDuration2 } = stats;
	const events = axiom.getEvents();
	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
	const Icon2 = Icons.getIcon(pascalCase(events[1]), true);

	const hasTimeDistance = minTimeDistance && maxTimeDistance;

	// lost interactions
	let iconColor1 = "#3A2A0D";
	let isMissing1 = false;
	if (!minDuration1 || Math.abs(minDuration1) === Infinity) {
		iconColor1 = "var(--inactive-event)";
		isMissing1 = true;
	}
	let iconColor2 = "#3A2A0D";
	let isMissing2 = false;
	if (!minDuration2 || Math.abs(minDuration2) === Infinity) {
		iconColor2 = "var(--inactive-event)";
		isMissing2 = true;
	}

	return (
		<div id="outer-container">
			<div className="td-stat-container2" style={{ marginTop: !hasTimeDistance && 10 }}>
				<div className="icon-container2">
					{((!isMissing1 && !isMissing2) || isMissing1) && (
						<svg width={25} height={25}>
							<Icon1 fill={iconColor1} style={{ width: 25, height: 25 }} />
							{isMissing1 && (
								<svg width={25} height={25}>
									<line x1={25} x2={0} y1={25} y2={0} stroke="var(--missing-line)" strokeWidth={3} />
								</svg>
							)}
						</svg>
					)}
				</div>
				{!isMissing1 && !isMissing2 && hasTimeDistance && (
					<div className="td-stat-data-container2">
						<TimeDistanceStat
							key={"td-s"}
							tdmax={maxTimeDistance}
							tdmin={minTimeDistance}
						></TimeDistanceStat>
					</div>
				)}
				<div className="icon-container2">
					{((!isMissing1 && !isMissing2) || isMissing2) && (
						<svg width={25} height={25}>
							<Icon2 fill={iconColor2} style={{ width: 25, height: 25 }} />
							{isMissing2 && (
								<svg width={25} height={25}>
									<line x1={0} x2={25} y1={25} y2={0} stroke="var(--missing-line)" strokeWidth={3} />
								</svg>
							)}
						</svg>
					)}
				</div>
			</div>
			<div id="missing-events-msg" style={{ marginTop: !hasTimeDistance && -5 }}>
				{!hasTimeDistance && (
					<svg height={13} width={"100%"}>
						<text fill="#5F5656" x={"43%"} y={10} fontSize={11}>
							missing event(s)
						</text>
					</svg>
				)}
			</div>
		</div>
	);
}

export function DurationAxiomStatText(props) {
	const { stats } = props;
	const { axiom, numInstances, minDuration1, maxDuration1 } = stats;
	const events = axiom.getEvents();
	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
	const multiple = minDuration1 !== maxDuration1 ? true : false;
	const samples = numInstances > 1 ? "samples" : "sample";
	const doesDo = numInstances > 1 ? "do" : "does";
	const isMissing1 = minDuration1 && Math.abs(minDuration1) !== Infinity ? false : true;

	let explanation = null;

	if (isMissing1) {
		explanation = (
			<div className="text-explanation">
				<span style={{ color: "#5F5656" }}>
					The selected {samples} {doesDo} not include interactions with the{" "}
				</span>
				{isMissing1 && <Icon1 fill={"#3A2A0D"} style={{ width: 25, height: 25 }}></Icon1>}
				<span style={{ color: "#5F5656" }}>.</span>
			</div>
		);
	} else {
		explanation = (
			<div className="text-explanation">
				<span style={{ color: "#5F5656" }}>In the the selected {samples}, the interaction with the </span>
				<span style={{ color: "var(--explanation" }}>{events[0]}</span>
				<span style={{ color: "#5F5656" }}> takes</span>
				{multiple && <span style={{ color: "#5F5656" }}> between</span>}
				{multiple && <span style={{ color: "var(--explanation" }}>{Math.round(10* minDuration1)/10}</span>}
				{multiple && <span style={{ color: "#5F5656" }}> and</span>}
				<span style={{ color: "var(--explanation" }}> {Math.round(10* maxDuration1)/10} </span>
				<span fill={"#3A2A0D"} style={{ color: "#5F5656" }}>
					 sec.
				</span>
			</div>
		);
	}

	return <div className="explanation-container">{explanation}</div>;
}

export function TimeDistanceAxiomStatText(props) {
	const { stats } = props;
	const { minTimeDistance, maxTimeDistance, axiom, numInstances, minDuration1, minDuration2 } = stats;
	const events = axiom.getEvents();
	const multiple = minTimeDistance !== maxTimeDistance ? true : false;
	const samples = numInstances > 1 ? "samples" : "sample";
	const doesDo = numInstances > 1 ? "do" : "does";
	const missingInteraction = minTimeDistance && Math.abs(minTimeDistance) !== Infinity ? false : true;

	let explanation = null;
	const isMissing1 = minDuration1 && Math.abs(minDuration1) !== Infinity ? false : true;
	const isMissing2 = minDuration2 && Math.abs(minDuration2) !== Infinity ? false : true;

	if (missingInteraction) {
		explanation = (
			<div className="text-explanation">
				<span style={{ color: "#5F5656" }}>
					The selected {samples} {doesDo} not include interactions with the{" "}
				</span>
				{isMissing1 && <span style={{ color: "var(--explanation"}}>{events[0]}</span>}
				{!isMissing1 && !isMissing2 && <span style={{ color: "#5F5656" }}>and </span>}
				{isMissing2 && <span style={{ color: "var(--explanation"}}>{events[1]}</span>}
				<span style={{ color: "#5F5656" }}>.</span>
			</div>
		);
	} else {
		// both interactions exist in the selected samples
		explanation = (
			<div className="text-explanation">
				<span style={{ color: "#5F5656" }}>In the the selected {samples}, the interaction with the </span>
				<span style={{ color: "var(--explanation"}}>{events[0]}</span>
				<span style={{ color: "#5F5656" }}> occurs</span>
				{multiple && <span style={{ color: "#5F5656" }}> between</span>}
				{multiple && <span style={{ color: "var(--explanation"}}>{Math.round(10*minTimeDistance)/10}</span>}
				{multiple && <span style={{ color: "#5F5656" }}> and</span>}
				<span style={{ color: "var(--explanation"}}> {Math.round(10*maxTimeDistance)/10}</span>
				<span fill={"#3A2A0D"} style={{ color: "#5F5656" }}>
					{" "}
					sec after the interaction with the{" "}
				</span>
				<span style={{ color: "var(--explanation"}}>{events[1]}</span>
				<span fill={"#3A2A0D"} style={{ color: "#5F5656" }}>
					.
				</span>
			</div>
		);
	}

	return <div className="explanation-container">{explanation}</div>;
}

export function TimeDistanceStat(props) {
	const { tdmax, tdmin } = props;
	const TimeDistIcon = Icons.getIcon("TimeDistance2");

	const multiple = tdmax !== tdmin ? true : false;

	return (
		<div className="timed-istance-stat-container2">
			<svg width={140} height={70}>
				<svg y={33}>
					<TimeDistIcon style={{ fill: "#807457", width: 100, height: 25 }}></TimeDistIcon>
				</svg>
				{multiple && (
					<text fill="#5F5656" x={45} y={27 + 25} fontSize={11}>
						between
					</text>
				)}
				{multiple && (
					<text fill="#5F5656" x={15} y={39 + 25} fontSize={11}>
						<tspan fontWeight={700}>{Math.round(tdmin * 10) / 10 + " "}</tspan>
						and
						<tspan fontWeight={700}>{" " + Math.round(tdmax * 10) / 10 + " "}</tspan>
						sec later
					</text>
				)}
				{!multiple && (
					<text fill="#5F5656" x={15} y={39 + 25} fontSize={11}>
						sec
					</text>
				)}
			</svg>
		</div>
	);
}

export function DurationStat(props) {
	const { event, mind, maxd } = props;
	const Icon = Icons.getIcon(pascalCase(event), true);

	const multiple = mind !== maxd ? true : false;

	return (
		<div
			className="duration-stat-container"
			style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
		>
			<Icon
				key={event}
				fill={"#534E45"}
				style={{
					width: 22,
					height: 22,
					padding: 2,
				}}
			></Icon>
			<svg width={70} height={23}>
				<rect x={28} y={0} key={event + "_rect"} width={15} height={8} fill={"#534E45"} rx={3}></rect>
				<line x1={28} y1={7} x2={0} y2={20} stroke="#5F5656" strokeDasharray="5,5" strokeLinecap="round" />
				<line x1={45} y1={7} x2={70} y2={20} stroke="#5F5656" strokeDasharray="5,5" strokeLinecap="round" />
				<line x1={1} y1={22} x2={69} y2={22} stroke="#5F5656" strokeLinecap="round" />
			</svg>
			<div>
				{multiple && <span style={{ fontSize: 13, color: "#5F5656" }}>between</span>}
				<span style={{ fontSize: 13, color: "#5F5656", fontWeight: 600 }}>
					{" " + Math.round(mind * 10) / 10 + " "}
				</span>
                {multiple && <span style={{ fontSize: 13, color: "#5F5656" }}> and</span>}
                {multiple && <span style={{ fontSize: 13, color: "#5F5656", fontWeight: 600 }}>
					{" " + Math.round(maxd * 10) / 10 + " "}
				</span>}
				<span style={{ fontSize: 13, color: "#5F5656" }}> sec</span>
			</div>
		</div>
	);
}
