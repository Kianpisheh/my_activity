import "./WhyNotWhatExplanation.css";

import Icons from "../../icons/Icons";
import { pascalCase } from "../../Utils/utils";
import AxiomTypes from "../../model/AxiomTypes";

import EventStat from "../../model/EventStat";
import RangeVis from "./RangeVis";

function WhyNotWhatExplanation(props) {
	const { stats, instances, selectedInstancesIdx } = props;
	if (!stats) {
		return;
	}

	const axiom = stats.getAxiom();
	const axiomType = axiom?.getType();
	const selectedInstances = instances.filter((instance, idx) => selectedInstancesIdx["FN"].includes(idx));
    
    let axiomStatComp = null;
	let axiomStatText = null;
	if (axiomType === AxiomTypes.TYPE_TIME_DISTANCE) {
		axiomStatComp = (
			<TimeDistanceAxiomStat
				stats={stats}
                onWhyHover={props.onWhyHover}
				selectedInstances={selectedInstances}
				axiom={axiom}
				onWhyNotHowTo={props.onWhyNotHowTo}
                onWhyWhatHover={props.onWhyWhatHover}
				onWhyWhatSelection={props.onWhyWhatSelection}
                selectedInstancesIdx={selectedInstancesIdx}
			></TimeDistanceAxiomStat>
		);
	} else if (axiomType === AxiomTypes.TYPE_DURATION) {
		axiomStatComp = (
			<DurationAxiomStat
				stats={stats}
				selectedInstances={selectedInstances}
				axiom={axiom}
				onWhyNotHowTo={props.onWhyNotHowTo}
				onWhyWhatSelection={props.onWhyWhatSelection}
                selectedInstancesIdx={selectedInstancesIdx}
                onWhyWhatHover={props.onWhyWhatHover}
			></DurationAxiomStat>
		);
	} else if (axiomType === AxiomTypes.TYPE_INTERACTION) {
		return (axiomStatText = (
			<InteractionAxiomWhyNotWhatText
				stats={stats}
				selectedInstances={selectedInstances}
				axiom={axiom}
				onWhyNotHowTo={props.onWhyNotHowTo}
                selectedInstancesIdx={selectedInstancesIdx}
			></InteractionAxiomWhyNotWhatText>
		));
	} else {
		return;
	}

    const multiple = selectedInstances.length > 1;
    const samples = multiple ? "samples" : "sample";
    const include = multiple ? "include" : "includes";
    let time = "";
    if (axiomType === AxiomTypes.TYPE_TIME_DISTANCE) {
        time = "time distance";
    } else if (axiomType === AxiomTypes.TYPE_DURATION) {
        time = "duration";
    }
    
	return (
		<div className="stat-container">
            <span style={{fontSize: 14, color: "#5F5656", marginBottom: 5}}>The selected {samples}{" "}{include} {time} outside of the defined range [{axiom.getTh1()},{axiom.getTh2()}].</span>
			<div className="stat-axiom-explanation-container">{axiomStatComp}</div>
		</div>
	);
}

export default WhyNotWhatExplanation;

export function DurationAxiomStat(props) {
	const { stats, axiom, selectedInstances } = props;
	const event = axiom.getEvents()?.[0];
	const Icon = Icons.getIcon(pascalCase(event), true);

	const eventStats = EventStat.getEventInstanceStat(selectedInstances, [event]);
	const durations = EventStat.getStatsDurations(eventStats, null);

	// dimensions
	const w = 400;
	const w1 = w / 2 - 3;
	const h = 70;
	const icSize = 25;
	const lineSize = 90;
	const iconLineGap = 10;

	return (
		<div
			className="axiom-stat-container"
            onMouseEnter={(ev)=> {
                const domRect = ev.target.getBoundingClientRect();
                props.onWhyWhatHover(domRect.x + domRect.width, domRect.y);
            }}
		>
			<svg className="time-dist-axiom-stat-svg" style={{ width: w, height: h }}>
				<g>
					<svg className="time-dist-stat-icon-vis" style={{ width: w1, height: h }}>
						<Icon
							x={w1 / 2 - icSize / 2}
							y={h / 2 - (4 * icSize) / 5}
							key={"duration-stat-whynotwhat"}
							width={icSize}
							height={icSize}
							fill={"#3A2A0D"}
						></Icon>
						<line
							y1={h / 2 + icSize / 4 + 3}
							x1={w1 / 2 - lineSize / 2}
							x2={w1 / 2 + lineSize / 2}
							y2={h / 2 + icSize / 4 + 3}
							stroke="#777777"
							strokeWidth={1}
							strokeDasharray={4}
						></line>
						<polygon
							points={[
								w1 / 2 - lineSize / 2,
								h / 2 + icSize / 4 + 3,
								w1 / 2 - lineSize / 2 - 5,
								h / 2 + icSize / 4,
								w1 / 2 - lineSize / 2 - 5,
								h / 2 + icSize / 4 + 6,
							]}
							fill="#555555"
							stroke="#555555"
							strokeWidth={1}
						/>
						<polygon
							points={[
								w1 / 2 + lineSize / 2,
								h / 2 + icSize / 4 + 3,
								w1 / 2 + lineSize / 2 + 5,
								h / 2 + icSize / 4,
								w1 / 2 + lineSize / 2 + 5,
								h / 2 + icSize / 4 + 6,
							]}
							fill="#555555"
							stroke="#555555"
							strokeWidth={1}
						/>
					</svg>
				</g>
				<line y1={10} x1={w / 2} x2={w / 2} y2={h - 10} stroke="#777777" strokeWidth={1}></line>
				<g transform={"translate(" + (w / 2 + 20) + "," + (h / 2 - 15) + ")"}>
					<svg className="time-distribution-svg" style={{ width: w1, height: h }}>
						<g>
							<RangeVis numbers={durations} w={170}></RangeVis>
						</g>
					</svg>
				</g>
			</svg>
		</div>
	);
}

export function TimeDistanceAxiomStat(props) {
	const { stats, axiom, selectedInstances } = props;
	const { minTimeDistance, maxTimeDistance, minDuration1, minDuration2 } = stats;
	const events = axiom.getEvents();
	const Icon1 = Icons.getIcon(pascalCase(events[0]), true);
	const Icon2 = Icons.getIcon(pascalCase(events[1]), true);

	const hasTimeDistance = minTimeDistance && maxTimeDistance;
	const eventStats = EventStat.getEventInstanceStat(selectedInstances, events);
	const timeDistances = EventStat.getStatsTimeDistances(eventStats, null);

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

	// dimensions
	const w = 400;
	const w1 = w / 2 - 3;
	const h = 70;
	const icSize = 25;
	const lineSize = 90;
	const iconLineGap = 10;

	return (
		<div className="axiom-stat-container" 
            onMouseEnter={(ev)=> {
                const domRect = ev.target.getBoundingClientRect();
                props.onWhyWhatHover(domRect.x + domRect.width, domRect.y);
            }}>
			<svg className="time-dist-axiom-stat-svg" style={{ width: w, height: h }}>
				<g>
					<svg className="time-dist-stat-icon-vis" style={{ width: w1, height: h }}>
						<Icon1
							x={w1 / 2 - lineSize / 2 - icSize / 2 - 2 * iconLineGap}
							y={h / 2 - icSize / 2}
							key={"time-dist-1-repr"}
							width={icSize}
							height={icSize}
							fill={"#3A2A0D"}
						></Icon1>
						<Icon2
							x={w1 / 2 + lineSize / 2 + iconLineGap}
							y={h / 2 - icSize / 2}
							key={"time-dist-2-repr"}
							width={icSize}
							height={icSize}
							fill={"#3A2A0D"}
						></Icon2>
						<line
							y1={h / 2}
							x1={w1 / 2 - lineSize / 2}
							x2={w1 / 2 + lineSize / 2}
							y2={h / 2}
							stroke="#777777"
							strokeWidth={1}
							strokeDasharray={4}
						></line>
						<polygon
							points={[
								w1 / 2 + lineSize / 2,
								h / 2,
								w1 / 2 + lineSize / 2 - 5,
								h / 2 - 3,
								w1 / 2 + lineSize / 2 - 5,
								h / 2 + 3,
							]}
							fill="#777777"
							stroke="#777777"
							strokeWidth={1}
						/>
					</svg>
				</g>
				<line y1={10} x1={w / 2} x2={w / 2} y2={h - 10} stroke="#777777" strokeWidth={1}></line>
				<g transform={"translate(" + (w / 2 + 20) + "," + (h / 2 - 15) + ")"}>
					<svg className="time-distribution-svg" style={{ width: w1, height: h }}>
						<g>
							<RangeVis numbers={timeDistances} w={170}></RangeVis>
						</g>
					</svg>
				</g>
			</svg>
		</div>
	);
}

export function InteractionAxiomWhyNotWhatText(props) {
	const { axiom, numInstances } = props.stats;
	const events = axiom.getEvents();
	const samples = numInstances > 1 ? "samples" : "sample";
	const doesDo = numInstances > 1 ? "do" : "does";

	return (
		<div className="text-explanation">
			<span style={{ color: "#5F5656" }}>
				The selected {samples} {doesDo} not include interactions with the{" "}
			</span>
			<span style={{ color: "var(--explanation" }}>{events[0]}</span>
			<span style={{ color: "#5F5656" }}>.</span>
		</div>
	);
}

export function DurationAxiomStatText(props) {
	const { stats } = props;
	const { axiom, numInstances, minDuration1, maxDuration1 } = stats;
	const events = axiom.getEvents();
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
				{<span style={{ color: "var(--explanation" }}>{events[0]}</span>}
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
				{multiple && <span style={{ color: "var(--explanation" }}>{Math.round(10 * minDuration1) / 10}</span>}
				{multiple && <span style={{ color: "#5F5656" }}> and</span>}
				<span style={{ color: "var(--explanation" }}> {Math.round(10 * maxDuration1) / 10} </span>
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
				{isMissing1 && <span style={{ color: "var(--explanation" }}>{events[0]}</span>}
				{!isMissing1 && !isMissing2 && <span style={{ color: "#5F5656" }}>and </span>}
				{isMissing2 && <span style={{ color: "var(--explanation" }}>{events[1]}</span>}
				<span style={{ color: "#5F5656" }}>.</span>
			</div>
		);
	} else {
		// both interactions exist in the selected samples
		explanation = (
			<div className="text-explanation">
				{/* <span style={{ color: "#5F5656" }}>In the the selected {samples}, the interaction with the </span>
				<span style={{ color: "var(--explanation" }}>{events[0]}</span>
				<span style={{ color: "#5F5656" }}> occurs</span>
				{multiple && <span style={{ color: "#5F5656" }}> between</span>}
				{multiple && (
					<span style={{ color: "var(--explanation" }}>{Math.round(10 * minTimeDistance) / 10}</span>
				)}
				{multiple && <span style={{ color: "#5F5656" }}> and</span>}
				<span style={{ color: "var(--explanation" }}> {Math.round(10 * maxTimeDistance) / 10}</span>
				<span fill={"#3A2A0D"} style={{ color: "#5F5656" }}>
					{" "}
					sec after the interaction with the{" "}
				</span>
				<span style={{ color: "var(--explanation" }}>{events[1]}</span>
				<span fill={"#3A2A0D"} style={{ color: "#5F5656" }}>
					.
				</span> */}
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
				{multiple && (
					<span style={{ fontSize: 13, color: "#5F5656", fontWeight: 600 }}>
						{" " + Math.round(maxd * 10) / 10 + " "}
					</span>
				)}
				<span style={{ fontSize: 13, color: "#5F5656" }}> sec</span>
			</div>
		</div>
	);
}

export function InteractionAxiomStat(props) {
	const { instances, axiom } = props;
	const events = axiom.getEvents();

	return (
		<div
			className="interaction-axiom-stat-container"
			onClick={() => {
				props.onWhyWhatSelection();
			}}
			style={{
				display: "flex",
				flexDirection: "column",
				rowGap: 20,
				background: "var(--light-beige)",
				padding: 20,
				borderRadius: 5,
			}}
		>
			{events.map((ev) => {
				let eventStats = [];
				for (const instance of instances) {
					eventStats.push(new EventStat(instance, [ev]));
				}
				let durations = EventStat.getStatsDurations(eventStats, "");

				const Icon = Icons.getIcon(pascalCase(ev));
				return (
					<div key={ev + "stat"} className="interaction-stat" style={{ display: "flex", columnGap: 10 }}>
						<div key={"stat-icon" + ev} className="stat-icon">
							<svg key={"stat-svg-" + ev} width={95} height={22}>
								<Icon
									key={"stat-icon-" + ev}
									x={0}
									y={0}
									width={22}
									height={22}
									fill={Icons.getColor(pascalCase(ev))}
								></Icon>
								<text x={37} y={18} fontSize={12}>
									Duration(s)
								</text>
							</svg>
						</div>
						<div key={"stat-range" + ev} className="stat-range-vis">
							<RangeVis numbers={durations}></RangeVis>
						</div>
					</div>
				);
			})}
		</div>
	);
}
