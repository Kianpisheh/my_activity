import React from "react";
import Icons from "../../icons/objects/Icons";

import { pascalCase } from "../../Utils/utils";

function EventStatsIconsOR(props) {
	const { events, coverageNum } = props;

	const h = 25;
	const w = 400;
	const icSize = 25;

	return (
		<div className="event-stat-icons-container">
			<div className="or-icons-container">
				<svg className="stat-repr-svg" width={w} height={h}>
					{events.map((ev, idx) => {
						const Icon = Icons.getIcon(pascalCase(ev), true);
						const xIcon = w / 2 - 3 * icSize + idx * (icSize + 40);
						return (
							<React.Fragment>
								<Icon
									x={xIcon}
									y={0}
									key={ev + "statrepr"}
									width={icSize}
									height={icSize}
									fill={Icons.getColor(pascalCase(ev))}
								></Icon>
								{idx < events.length - 1 && (
									<text x={xIcon + icSize + 12} y={h / 2 + 5} fontSize={12}>
										OR
									</text>
								)}
							</React.Fragment>
						);
					})}
				</svg>
			</div>
		</div>
	);
}

export default EventStatsIconsOR;
