import { useState } from "react";
import { logEvent } from "../../APICalls/activityAPICalls";

import QuickAxiom from "../QuickAxiom";

function EventStatsOR(props) {
	const sliderWidth = 180;
	const [sliderPos, setSliderPos] = useState([10, (2 * (sliderWidth - 30)) / 3]);
	const [quickAxiomPos, setQuickAxiomPos] = useState([-1, -1]);

	const { coverages, numActivity } = props;

	const events = Object.keys(props.selectedInstanceEvents);
	return Object.keys(coverages).map((act, idx) => {
		return (
			act !== "" &&
			parseInt(coverages[act].length) !== 0 && (
				<div
					key={idx}
					className="single-stat-container"
					onMouseOver={() => {
						props.onWhyNotHover(coverages[act]);
					}}
					onMouseLeave={() => props.onWhyNotHover([])}
					onClick={() => setQuickAxiomPos([-1, -1])}
					onContextMenu={(ev) => {
						setQuickAxiomPos([ev.pageX + 7, ev.pageY + 7]);
					}}
					onMouseEnter={() => {
						logEvent(
							{
								activity: act,
								events: props.events,
								coverageOR: coverages.length,
								coverageORIdx: coverages,
								numActivity: numActivity,
							},

							"event_stats_hover_what_if",
							"event_stats_OR_what_if",
							props.dataUser
						);
					}}
				>
					{quickAxiomPos[0] > 0 && (
						<div
							id="quick-axiom"
							style={{ position: "absolute", left: quickAxiomPos[0], top: quickAxiomPos[1] }}
						>
							<QuickAxiom events={events} sendMessage={props.messageCallback} onlyOR={true}></QuickAxiom>
						</div>
					)}
					<span className="stat-activity-title" style={{ fontSize: 13, fontWeight: 600 }}>
						{act}
					</span>
					<div className="stats">
						<div style={{ display: "flex", alignItems: "flex-end", columnGap: 10 }}>
							<span style={{ height: 31 }}>
								<span style={{ fontSize: 12 }}>Occurrance:{"  "}</span>
								<span style={{ fontSize: 25, color: "var(--explanation)" }}>
									{" "}
									{coverages[act].length + " / " + numActivity[act]}
								</span>
								<span style={{ fontSize: 12, marginLeft: "0.1em" }}> time(s)</span>
							</span>
						</div>
					</div>
				</div>
			)
		);
	});
}

export default EventStatsOR;
