import "./StatEvents.css";
import Icons from "../../icons/Icons";

import { pascalCase } from "../../Utils/utils";

function StatEvents(props) {
	const { events } = props;
	const numEvents = events.length;
	const h = 40;
	const w = 400;
	const icSize = 25;
	const lineSize = 150;

	let statRepr = null;
	
		statRepr = (
			<svg className="stat-repr-svg" width={w} height={h}>
				{events.map((ev, i) => {
					const Icon = Icons.getIcon(pascalCase(ev), true);
                    let xIcon = (w/2) - (icSize/2);
                    let yIcon= 0;
                    if (numEvents > 2) {
                        xIcon = (w/2 - 3*icSize) + i*(icSize+22)
                    } else if (numEvents === 2) {
                        xIcon = (w / 2 - lineSize / 2) - icSize - 5 + 2*i*(lineSize/2) + i* (icSize +13);
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
				{numEvents === 1 && <g><line
					y1={icSize + 5}
					x1={w / 2 - lineSize / 2}
					x2={w / 2 + lineSize / 2}
					y2={icSize + 5}
					stroke="#555555"
					strokeWidth={2}
				></line>
				<polygon
					points={[
						w / 2 - lineSize / 2,
						icSize + 5,
						w / 2 - lineSize / 2 - 5,
						icSize + 2,
						w / 2 - lineSize / 2 - 5,
						icSize + 8,
					]}
					fill="#555555"
					stroke="#555555"
					strokeWidth={1}
				/>
				<polygon
					points={[
						w / 2 + lineSize / 2,
						icSize + 5,
						w / 2 + lineSize / 2 + 5,
						icSize + 2,
						w / 2 + lineSize / 2 + 5,
						icSize + 8,
					]}
					fill="#555555"
					stroke="#555555"
					strokeWidth={1}
				/></g>}
                {numEvents === 2 &&<g><line
					y1={icSize + 5}
					x1={w / 2 - lineSize / 2}
					x2={w / 2 + lineSize / 2}
					y2={icSize + 5}
					stroke="#555555"
					strokeWidth={2}
				></line>
				<polygon
					points={[
						w / 2 + lineSize / 2 + 5,
						icSize + 5,
						w / 2 + lineSize / 2,
						icSize + 2,
						w / 2 + lineSize / 2,
						icSize + 8,
					]}
					fill="#555555"
					stroke="#555555"
					strokeWidth={1}
				/></g>}
			</svg>
		);

	return <div className="stat-events-container">{statRepr}</div>;
}

export default StatEvents;
