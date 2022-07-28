import "./WhyNotWhatExplanation.css";

import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";
import AxiomTypes from "../../model/AxiomTypes";
import { CircleNum } from "../ExplanationPanel/utils";

function WhyNotWhatExplanation(props) {
	const { stats } = props;
	if (!stats) {
		return;
	}

	const axiom = stats.getAxiom();
	const axiomType = axiom?.getType();

	let axiomStatComp = null;
	if (axiomType === AxiomTypes.TYPE_TIME_DISTANCE) {
		axiomStatComp = <TimeDistanceAxiomStat stats={stats} axiom={axiom}></TimeDistanceAxiomStat>;
	} else if (axiomType === AxiomTypes.TYPE_DURATION) {
		axiomStatComp = <DurationAxiomStat stats={stats} axiom={axiom}></DurationAxiomStat>;
	} else {
		return;
	}

	return (
		<div className="stat-container">
			{axiomStatComp}
			<div id="why-not-what-qmark" onClick={() => {props.onWhyNotHowTo()}}>{CircleNum("?")}</div>
		</div>
	);
}

export default WhyNotWhatExplanation;

function DurationAxiomStat(props) {
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

function TimeDistanceAxiomStat(props) {
	const { stats, axiom } = props;
	const { minTimeDistance, maxTimeDistance } = stats;
	const events = axiom.getEvents();
	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
	const Icon2 = Icons.getIcon(pascalCase(events[1]), true);

	return (
		<div className="td-stat-container2">
			<div className="icon-container2">
				<Icon1 style={{ fill: "#3A2A0D", width: 25, height: 25 }}></Icon1>
			</div>
			<div className="td-stat-data-container2">
				<TimeDistanceStat key={"td-s"} tdmax={maxTimeDistance} tdmin={minTimeDistance}></TimeDistanceStat>
			</div>
			<div className="icon-container2">
				<Icon2 style={{ fill: "#3A2A0D", width: 25, height: 25 }}></Icon2>
			</div>
		</div>
	);
}

function TimeDistanceStat(props) {
	const { tdmax, tdmin } = props;
	const TimeDistIcon = Icons.getIcon("TimeDistance2");

	return (
		<div className="timed-istance-stat-container2">
			<svg width={140} height={70}>
				<svg y={33}>
					<TimeDistIcon style={{ fill: "#807457", width: 100, height: 25 }}></TimeDistIcon>
				</svg>
				<text fill="#5F5656" x={45} y={27 + 25} fontSize={11}>
					between
				</text>
				<text fill="#5F5656" x={15} y={39 + 25} fontSize={11}>
					<tspan fontWeight={700}>{Math.round(tdmin * 10) / 10 + " "}</tspan>
					and
					<tspan fontWeight={700}>{" " + Math.round(tdmax * 10) / 10 + " "}</tspan>
					sec later
				</text>
			</svg>
		</div>
	);
}

function DurationStat(props) {
	const { event, mind, maxd } = props;
	const Icon = Icons.getIcon(pascalCase(event), true);

	return (
		<div className="duration-stat-container">
			<Icon
				key={event}
				fill={"#534E45"}
				style={{
					width: 22,
					height: 22,
					padding: 2,
				}}
			></Icon>
			<svg width={80} height={70} transform="translate(13,0)">
				<rect x={20} y={0} key={event + "_rect"} width={15} height={8} fill={"#534E45"} rx={3}></rect>
				<line x1={20} y1={7} x2={0} y2={30} stroke="#5F5656" strokeDasharray="5,5" strokeLinecap="round" />
				<line x1={35} y1={7} x2={50} y2={30} stroke="#5F5656" strokeDasharray="5,5" strokeLinecap="round" />
				<line x1={1} y1={32} x2={49} y2={32} stroke="#5F5656" strokeLinecap="round" />
				<text fill="#5F5656" fontSize={11} y={47} x={5}>
					between
				</text>
				<text fill="#5F5656" fontSize={11} y={59} x={0}>
					<tspan fontWeight={700}>{Math.round(mind * 10) / 10 + " "}</tspan>
					and
					<tspan fontWeight={700}>{" " + Math.round(maxd * 10) / 10 + " "}</tspan>
					sec
				</text>
			</svg>
		</div>
	);
}

// export default AxiomStats;
