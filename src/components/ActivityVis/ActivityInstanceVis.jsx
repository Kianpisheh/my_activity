import { useState, useEffect } from "react";

import "./ActivityInstanceVis.css";
import "./TimeAxis.css";

import TimeAxis from "./TimeAxis";

import {
	mergeConsecEvents,
	nonLinearScale,
	mergeCloseEvents,
	getEventIconPlacement,
	getEnclosedEvents,
	time2Pixel,
	pixel2Time,
	inverseNonLienarScale,
	findTimeOverlap,
} from "../../Utils/utils";

import EventFilter from "./EventFilter";
import EventIconThumb from "./EventIconThumb";
import ScalingTab from "./ScalingTab";
import RegionSelect from "react-region-select";
import QuickAxiom from "../QuickAxiom";

function ActivityInstanceVis(props) {
	const [count, setCount] = useState(0);
	const { activity, config, explanation } = props;
	const [filters, setFilters] = useState("");
	const [regions, setRegions] = useState([]);
	const [selected, setSelected] = useState({});
	const [quickAxiomPos, setQuickAxiomPos] = useState([-1, -1]);

	const { ic_w, scale, merge_th, nonlScale } = config;

	useEffect(() => {
		setRegions([]);
		setSelected({});
	}, [props.activity]);

	useEffect(() => {
		if (regions[0] && regions[0].width < 0.001) {
			setRegions([]);
			setSelected({});
		}
	}, [selected]);

	if (!activity) {
		return null;
	}

	const timestamps = activity.getTimes();

	function handleNewFilter(f) {
		setFilters(f);
	}

	let predActivity = ["Unknown"];
	if (props.currentActInstanceIdx >= 0 && props.predictedActivities.length) {
		predActivity = props.predictedActivities[props.currentActInstanceIdx];
		if (!predActivity) {
			predActivity = ["Unknown"];
		}
	}

	// create an example for event-locations
	let events = activity?.getEvents();

	if (!events || events.length === 0) {
		return null;
	}

	events.forEach((ev) => {
		if (ev.startTime - events[0].startTime < 50) {
			ev.location = "kitchen";
		} else {
			ev.location = "living_room";
		}
	});

	let mergedConsecRes;
	if (props.merge[0]) {
		mergedConsecRes = mergeConsecEvents(timestamps, activity.getEvents(), merge_th);
	} else {
		let idxMap = {};
		for (let k = 0; k < timestamps.length; k++) {
			idxMap[k] = k;
		}
		mergedConsecRes = { events: activity.getEvents(), times: timestamps, idxMap: idxMap };
	}

	// merge close consecutive events
	const mergedConsecEvents = mergedConsecRes["events"];
	const mergedConsecTimes = mergedConsecRes["times"];

	// nonliniear scaling
	const nonlinearScaledTimes = nonlScale ? nonLinearScale(mergedConsecTimes) : mergedConsecTimes;

	// merge close events
	let mergedCloseRes;
	if (props.merge[1]) {
		mergedCloseRes = mergeCloseEvents(nonlinearScaledTimes, mergedConsecEvents, 1);
	} else {
		let idxMap = {};
		for (let k = 0; k < mergedConsecTimes.length; k++) {
			idxMap[k] = k;
		}
		mergedCloseRes = { events: mergedConsecEvents, times: mergedConsecTimes, idxMap: idxMap };
	}
	const mergedCloseTimes = mergedCloseRes["times"];
	const mergedCloseEvents = mergedCloseRes["events"];

	// find explanation corresponding event instances
	let overlapIdx = [];
	if (explanation && explanation.getType() === "why") {
		overlapIdx = findTimeOverlap(explanation.getStartTimes(), explanation.getEndTimes(), timestamps);
	}

	for (let i = 0; i < overlapIdx.length; i++) {
		overlapIdx[i] = mergedCloseRes.idxMap[mergedConsecRes.idxMap[overlapIdx[i]] ?? overlapIdx[i]] ?? overlapIdx[i];
	}

	const thumbX = time2Pixel(nonlScale ? nonlinearScaledTimes : mergedConsecTimes, scale[0]);
	const iconX = time2Pixel(mergedCloseTimes, scale[0]);
	const iconY = getEventIconPlacement(iconX, ic_w);

	const { x1, x2 } = selected;

	let enEventsRes = null;
	let enEvents = null;
	let enX = null;
	let nonScaledEnclosedTimes = null;
	let nonScaledEnclosedThumbX = null;
	let nonScaledIconY = null;
	let firstIdxEnEvent = 0;
	if (selected && x2 - x1 > 0 && Object.keys(selected).length !== 0) {
		enEventsRes = getEnclosedEvents(x1, x2, thumbX, mergedConsecEvents);
		enEvents = enEventsRes["events"];
		enX = enEventsRes["X"];
		let enTimes = pixel2Time(enX, scale[1]);

		nonScaledEnclosedTimes = nonlScale ? inverseNonLienarScale(enTimes) : enTimes;

		nonScaledEnclosedThumbX = time2Pixel(nonScaledEnclosedTimes, scale[1]);
		nonScaledIconY = nonScaledEnclosedThumbX.map(() => {
			return -20;
		});
		getEventIconPlacement(nonScaledEnclosedThumbX, ic_w);
	}

	const mainDivHeight = Object.keys(selected).length !== 0 ? 500 : 360;

	let selectionBox = false;
	if (selected && Object.keys(selected).length !== 0 && selected.x1 && selected.x2) {
		selectionBox = true;
	}

	console.log(quickAxiomPos);

	return (
		<div
			id="activity-vis-container"
			onContextMenu={(ev) => {
				setQuickAxiomPos([ev.pageX + 7, ev.pageY + 7]);
			}}
			onClick={() => setQuickAxiomPos([-1, -1])}
			onKeyDown={(ev) => {
				if (ev.code !== "Escape") {
					return;
				}
				setQuickAxiomPos([-1, -1]);
				props.onInstanceEventSelection("", -1);
			}}
		>
			<span className="section-title" id="title">
				Activity events
			</span>
			{quickAxiomPos[0] > 0 && (
				<div id="quick-axiom" style={{ position: "absolute", left: quickAxiomPos[0], top: quickAxiomPos[1] }}>
					<QuickAxiom
						events={Object.keys(props.selectedInstanceEvents)}
						sendMessage={props.sendMessage}
					></QuickAxiom>
				</div>
			)}
			<div className="graph-container" onMouseUp={() => setCount(count + 1)}>
				<div className="tools-div">
					{/* <EventFilter onNewFilter={handleNewFilter} filters={filters}></EventFilter> */}
					<ScalingTab key={1} idx={0} onScaleChange={props.onScaleChange}></ScalingTab>
				</div>
				<div
					className="graph"
					style={{
						width: Math.ceil(thumbX[thumbX.length - 1].x2) + 3 * ic_w,
					}}
					onMouseUp={() => {
						if (regions[0] && regions[0].width > 0.002) {
							handleRegionSelection(regions, Math.ceil(thumbX[thumbX.length - 1].x2));
						} else {
							setSelected({});
						}
					}}
				>
					{/* <RegionSelect
                        maxRegions={1}
                        regions={regions}
                        constraint
                        onChange={(regions) => setRegions(regions)}
                        style={{ height: "100%" }}
                    > */}
					<EventIconThumb
						key={1}
						idx={0}
						config={config}
						filters={filters}
						instanceIndEvents={activity.getEventIndividuals()}
						entailedIndEvents={explanation?.getIndividuals() ?? null}
						thumbEvents={mergedConsecEvents}
						thumbX={thumbX}
						iconEvents={mergedCloseEvents}
						explanationIndividuals={overlapIdx}
						iconX={iconX}
						iconY={iconY}
						onInstanceEventSelection={props.onInstanceEventSelection}
						selectedInstanceEvents={props.selectedInstanceEvents}
					></EventIconThumb>
					{/* </RegionSelect> */}
				</div>
				{selectionBox && nonScaledEnclosedThumbX.length && (
					<div
						className="graph"
						style={{
							width: Math.ceil(nonScaledEnclosedThumbX[nonScaledEnclosedThumbX.length - 1].x2 + 3 * ic_w),
							height: 300,
						}}
					>
						<EventIconThumb
							key={2}
							idx={1}
							config={config}
							filters={filters}
							eventIndividuals={activity.getEventIndividuals()}
							entailedIndEvents={explanation?.getIndividuals() ?? null}
							thumbEvents={enEvents}
							explanationIndividuals={[]}
							thumbX={nonScaledEnclosedThumbX}
							iconEvents={enEvents}
							iconX={nonScaledEnclosedThumbX}
							iconY={nonScaledIconY}
						></EventIconThumb>
						<TimeAxis
							tmax={nonScaledEnclosedTimes[nonScaledEnclosedTimes.length - 1].endTime}
							t0={mergedConsecTimes[firstIdxEnEvent].startTime}
							config={config}
						></TimeAxis>
					</div>
				)}
			</div>
			<div
				style={{
					fontSize: 13,
					backgroundColor: "#CFC9B9",
					padding: 7,
					margin: 0,
				}}
			>
				<span style={{ color: "#614E1E" }}>Predicted activity:</span>{" "}
				<span style={{ color: "#F63B3B", fontWeight: 600 }}>{predActivity.join(",  ")}</span>
			</div>
		</div>
	);

	function handleRegionSelection(regions, svgWidth) {
		if (regions[0]) {
			const x1 = (regions[0].x * svgWidth) / 100;
			const x2 = ((regions[0].x + regions[0].width) * svgWidth) / 100;
			if (x2 - x1 > 0) {
				setSelected({ x1: x1, x2: x2 });
			}
		}
	}
}

export default ActivityInstanceVis;
