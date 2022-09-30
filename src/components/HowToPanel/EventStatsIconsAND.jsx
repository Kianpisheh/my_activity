import "./StatEvents.css";
import Icons from "../../icons/objects/Icons";

import { pascalCase } from "../../Utils/utils";
import { useState } from "react";
import AxiomTypes from "../../model/AxiomTypes";

function EventStatsIconsAND(props) {
	const [hovered, setHovered] = useState(false);

	const { events } = props;
	const numEvents = events.length;
	const h = 40;
	const w = 400;
	const icSize = 25;
	const lineSize = 120;

	let statRepr = null;

	statRepr = (
		<svg className="stat-repr-svg" width={w} height={h}>
			{events.map((ev, i) => {
				const Icon = Icons.getIcon(pascalCase(ev), true);
				let xIcon = w / 2 - icSize / 2;
				let yIcon = 0;
				if (numEvents > 2) {
					xIcon = w / 2 - 3 * icSize + i * (icSize + 22);
				} else if (numEvents === 2) {
					xIcon = w / 2 - lineSize / 2 - icSize - 5 + 2 * i * (lineSize / 2) + i * (icSize + 18);
					yIcon = icSize / 2;
				}
				return (
					<Icon
						x={xIcon}
						y={yIcon}
						key={ev + "statrepr"}
						width={icSize}
						height={icSize}
						fill={Icons.getColor(pascalCase(ev))}
					></Icon>
				);
			})}
			{numEvents === 1 && (
				<g>
					<line
						y1={icSize - 3 + 5}
						x1={w / 2 - lineSize / 2}
						x2={w / 2 + lineSize / 2}
						y2={icSize - 3 + 5}
						stroke="#555555"
						strokeDasharray={"4"}
						strokeWidth={1}
					></line>
					<polygon
						points={[
							w / 2 - lineSize / 2,
							icSize - 3 + 5,
							w / 2 - lineSize / 2 - 5,
							icSize - 3 + 2,
							w / 2 - lineSize / 2 - 5,
							icSize - 3 + 8,
						]}
						fill="#555555"
						stroke="#555555"
						strokeWidth={1}
					/>
					<polygon
						points={[
							w / 2 + lineSize / 2,
							icSize - 3 + 5,
							w / 2 + lineSize / 2 + 5,
							icSize - 3 + 2,
							w / 2 + lineSize / 2 + 5,
							icSize - 3 + 8,
						]}
						fill="#555555"
						stroke="#555555"
						strokeWidth={1}
					/>
				</g>
			)}
			{numEvents === 2 && (
				<g>
					<line
						y1={icSize - 3 + 5}
						x1={w / 2 - lineSize / 2}
						x2={w / 2 + lineSize / 2}
						y2={icSize - 3 + 5}
						stroke="#555555"
						strokeDasharray={"4"}
						strokeWidth={1}
					></line>
					<polygon
						points={[
							w / 2 + lineSize / 2 + 5,
							icSize - 3 + 5,
							w / 2 + lineSize / 2,
							icSize - 3 + 2,
							w / 2 + lineSize / 2,
							icSize - 3 + 8,
						]}
						fill="#555555"
						stroke="#555555"
						strokeWidth={1}
					/>
				</g>
			)}
		</svg>
	);

	return (
		<div
			className="stat-events-container"
			style={{ display: "flex" }}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{statRepr}
			{hovered && (
				<button
					key={0}
					width={0}
					className="remove-axiom-btn"
					onClick={() => {
						props.messageCallback(AxiomTypes.MSG_CLOSE_EVENT_STATS, {});
					}}
				>
					X
				</button>
			)}
		</div>
	);
}

export default EventStatsIconsAND;
