import "./AxiomStats.css";

import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";
import AxiomTypes from "../../model/AxiomTypes";

function AxiomStats(props) {
	const { stats, axiom } = props;

	const axiomType = axiom.getType();

	let axiomStatComp = null;
	if (axiomType === AxiomTypes.TYPE_TIME_DISTANCE) {
		axiomStatComp = (
			<TimeDistanceAxiomStat
				stats={stats}
				axiom={axiom}
			></TimeDistanceAxiomStat>
		);
	} else if (axiomType === AxiomTypes.TYPE_DURATION) {
		axiomStatComp = (
			<DurationAxiomStat stats={stats} axiom={axiom}></DurationAxiomStat>
		);
	} else {
		return;
	}

	return <div className="stat-container">{axiomStatComp}</div>;
}

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
	const {
		minDuration1,
		minDuration2,
		maxDuration1,
		maxDuration2,
		minTimeDistance,
		maxTimeDistance,
	} = stats;

	return (
		<div className="td-stat-container">
			<DurationStat
				key={"duration1"}
				event={"Fridge"}
				mind={minDuration1}
				maxd={maxDuration1}
			></DurationStat>
			<TimeDistanceStat
				key={"td-s"}
				tdmax={maxTimeDistance}
				tdmin={minTimeDistance}
			></TimeDistanceStat>
			<DurationStat
				key={"duration2"}
				event={"Cabinet"}
				mind={minDuration2}
				maxd={maxDuration2}
			></DurationStat>
		</div>
	);
}

function TimeDistanceStat(props) {
	const { tdmax, tdmin } = props;
	return (
		<div className="timed-istance-stat-container">
			<svg width={180} height={70}>
				<line
					x1={0}
					y1={10 + 22}
					x2={180}
					y2={10 + 22}
					stroke="#5F5656"
				></line>
				<text fill="#5F5656" x={62} y={22 + 25} fontSize={11}>
					between
				</text>
				<text fill="#5F5656" x={44} y={34 + 25} fontSize={11}>
					<tspan fontWeight={700}>
						{Math.round(tdmin * 10) / 10 + " "}
					</tspan>
					and
					<tspan fontWeight={700}>
						{" " + Math.round(tdmax * 10) / 10 + " "}
					</tspan>
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
				<rect
					x={20}
					y={0}
					key={event + "_rect"}
					width={15}
					height={8}
					fill={"#534E45"}
					rx={3}
				></rect>
				<line
					x1={20}
					y1={7}
					x2={0}
					y2={30}
					stroke="#5F5656"
					strokeDasharray="5,5"
					strokeLinecap="round"
				/>
				<line
					x1={35}
					y1={7}
					x2={50}
					y2={30}
					stroke="#5F5656"
					strokeDasharray="5,5"
					strokeLinecap="round"
				/>
				<line
					x1={1}
					y1={32}
					x2={49}
					y2={32}
					stroke="#5F5656"
					strokeLinecap="round"
				/>
				<text fill="#5F5656" fontSize={11} y={47} x={5}>
					between
				</text>
				<text fill="#5F5656" fontSize={11} y={59} x={0}>
					<tspan fontWeight={700}>
						{Math.round(mind * 10) / 10 + " "}
					</tspan>
					and
					<tspan fontWeight={700}>
						{" " + Math.round(maxd * 10) / 10 + " "}
					</tspan>
					sec
				</text>
			</svg>
		</div>
	);
}

export default AxiomStats;
