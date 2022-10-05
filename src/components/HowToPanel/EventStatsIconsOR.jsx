import React from "react";
import Icons from "../../icons/objects/Icons";

import { pascalCase } from "../../Utils/utils";

function EventStatsIconsOR(props) {
	const { events } = props;

	const h = 25;
	const w = 400;
	const icSize = 25;

	return (
		<div className="event-stat-icons-container">
			<div
				className="or-icons-container"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					columnGap: 10,
					width: "100%",
				}}
			>
				{events.map((ev, idx) => {
					const Icon = Icons.getIcon(pascalCase(ev), true);
					const xIcon = w / 2 - 3 * icSize + idx * (icSize + 40);
					return (
						<React.Fragment>
							<Icon
								y={0}
								key={ev + "statrepr"}
								width={icSize}
								height={icSize}
								fill={Icons.getColor(pascalCase(ev))}
							></Icon>
							{idx < events.length - 1 && (
								<span x={xIcon + icSize + 12} y={h / 2 + 5} fontSize={12}>
									OR
								</span>
							)}
						</React.Fragment>
					);
				})}
			</div>
		</div>
	);
}

export default EventStatsIconsOR;
