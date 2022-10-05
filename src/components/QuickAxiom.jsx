import "./QuickAxiom.css";

import Icons from "../icons/objects/Icons";
import { pascalCase } from "../Utils/utils";

function QuickAxiom(props) {
	const iconSize = 22;
	const { events } = props;
	if (!events || events.length === 0) {
		return;
	}

	// interaction axiom
	const Icon1 = Icons.getIcon(pascalCase(events[0]));
	const Icon2 = events[1] ? Icons.getIcon(pascalCase(events[1])) : null;

	return (
		<div className="quick-axiom-container">
			<div className="quick-axiom-list">
				<div className="qaxiom">
					<div id="interaction-qaxiom">
						{events.map((ev, idx) => {
							const Icon = Icons.getIcon(pascalCase(ev));
							return (
								<div className="q-icon" key={idx}>
									<Icon
										key={idx}
										fill={Icons.getColor(pascalCase(ev))}
										style={{ width: iconSize, height: iconSize }}
									/>
								</div>
							);
						})}
					</div>
				</div>
				<div className="qaxiom">
					<div id="interaction-qaxiom">
						{events.map((ev, idx) => {
							const Icon = Icons.getIcon(pascalCase(ev));
							const NotIcon = Icons.getIcon("NotFound");
							return (
								<div
									className="q-icon"
									key={idx + "neg"}
									style={{ width: 1.3 * iconSize, height: 1.3 * iconSize }}
								>
									<svg height={40}>
										<Icon
											key={idx + "neg"}
											x={2}
											fill={Icons.getColor(pascalCase(ev))}
											width={iconSize}
											height={iconSize}
										/>
										<NotIcon
											key={idx + "neg"}
											fill={Icons.getColor(pascalCase(ev))}
											opacity={0.5}
											width={1.2 * iconSize}
											height={1.2 * iconSize}
											style={{
												fill: "red",
												padding: 2,
											}}
										/>
									</svg>
								</div>
							);
						})}
					</div>
				</div>
				{events.length > 1 && (
					<div className="qaxiom">
						<div id="interaction-or-qaxiom">
							{events.map((ev, idx) => {
								const Icon = Icons.getIcon(pascalCase(ev));
								const xIcon = 150 / 2 - 3 * iconSize + idx * (iconSize + 40);
								return (
									<div className="q-icon" key={idx + "or"}>
										<Icon
											key={idx + "or"}
											width={iconSize}
											height={iconSize}
											fill={Icons.getColor(pascalCase(ev))}
											style={{ width: iconSize, height: iconSize }}
										/>
										{idx < events.length - 1 && (
											<span
												x={xIcon + iconSize + 20}
												y={45 / 2 + 22}
												style={{ paddingLeft: 5, paddingRight: 5, fontSize: 11 }}
											>
												OR
											</span>
										)}
									</div>
								);
							})}
						</div>
					</div>
				)}
				{events.length === 1 && (
					<div className="qaxiom">
						<div id="duration-qaxiom">
							<div className="q-icon" key={"icdu"} style={{ width: 120, height: 1.3 * iconSize }}>
								<svg height={40}>
									<Icon1
										key={"duIc"}
										x={"calc(50% - 10px)"}
										width={iconSize}
										height={iconSize}
										fill={Icons.getColor(pascalCase(events[0]))}
										style={{ width: iconSize, height: iconSize }}
									/>
									<DoubleHeadLine
										key={"doubleln"}
										w={100}
										icSize={iconSize}
										lineSize={80}
									></DoubleHeadLine>
								</svg>
							</div>
						</div>
					</div>
				)}
				{events.length === 2 && (
					<div className="qaxiom">
						<div id="time-distance-qaxiom">
							<div className="q-icon" key={"ictd"} style={{ width: 120, height: 1.3 * iconSize }}>
								<svg height={40}>
									<Icon1
										key={"duIc"}
										width={iconSize}
										height={iconSize}
										x={"0"}
										fill={Icons.getColor(pascalCase(events[0]))}
										style={{ width: iconSize, height: iconSize }}
									/>
									<Icon2
										key={"duIc"}
										x={80 + 20}
										width={iconSize}
										height={iconSize}
										fill={Icons.getColor(pascalCase(events[1]))}
										style={{ width: iconSize, height: iconSize }}
									/>
									<SingleHeadLine
										key={"doubleln"}
										w={100}
										icSize={iconSize}
										lineSize={60}
									></SingleHeadLine>
								</svg>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default QuickAxiom;

function DoubleHeadLine(props) {
	return (
		<g transform="translate(10,5)">
			<line
				y1={props.icSize - 3 + 5}
				x1={props.w / 2 - props.lineSize / 2}
				x2={props.w / 2 + props.lineSize / 2}
				y2={props.icSize - 3 + 5}
				stroke="#555555"
				strokeDasharray={"4"}
				strokeWidth={1}
			></line>
			<polygon
				points={[
					props.w / 2 - props.lineSize / 2,
					props.icSize - 3 + 5,
					props.w / 2 - props.lineSize / 2 - 5,
					props.icSize - 3 + 2,
					props.w / 2 - props.lineSize / 2 - 5,
					props.icSize - 3 + 8,
				]}
				fill="#555555"
				strokeWidth={1}
			/>
			<polygon
				points={[
					props.w / 2 + props.lineSize / 2,
					props.icSize - 3 + 5,
					props.w / 2 + props.lineSize / 2 + 5,
					props.icSize - 3 + 2,
					props.w / 2 + props.lineSize / 2 + 5,
					props.icSize - 3 + 8,
				]}
				fill="#555555"
				strokeWidth={1}
			/>
		</g>
	);
}

function SingleHeadLine(props) {
	return (
		<g transform="translate(8,-10)">
			<line
				y1={props.icSize - 3 + 5}
				x1={props.w / 2 - props.lineSize / 2}
				x2={props.w / 2 + props.lineSize / 2}
				y2={props.icSize - 3 + 5}
				stroke="#555555"
				strokeDasharray={"4"}
				strokeWidth={1}
			></line>
			<polygon
				points={[
					props.w / 2 + props.lineSize / 2 + 5,
					props.icSize - 3 + 5,
					props.w / 2 + props.lineSize / 2,
					props.icSize - 3 + 2,
					props.w / 2 + props.lineSize / 2,
					props.icSize - 3 + 8,
				]}
				fill="#555555"
				stroke="#555555"
				strokeWidth={1}
			/>
		</g>
	);
}
