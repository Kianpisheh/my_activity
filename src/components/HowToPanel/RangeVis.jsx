function RangeVis(props) {
	const { numbers } = props;
	const maxVal = Math.max(...numbers);
	const minVal = Math.min(...numbers);
    
    // dimentions
    let w = 180;
    if (props.w) {
        w = props.w;
    }
    const h = 30;
    
    // time annotations in seconds
    let secs = [];
    const range = maxVal - minVal

    if (range === 0) {
        secs = [minVal];
    } else if (range < 5) {
        secs = [minVal, minVal + range/2, maxVal];
    } else {
        secs = [minVal, minVal + range/4, minVal + range/2, minVal + 3*range/4, maxVal];
    }



	return (
			<svg width={w} height={h}>
				<line x1={0} x2={w-30} y1={h/2} y2={h/2} stroke="#666666" strokeWidth={2} strokeLinecap="round"></line>
				{numbers.map((value) => {
                    let x = ((value - minVal) / (maxVal - minVal)) * (w-30) + 5
                    if (minVal === maxVal) {
                        x = w/2 + 3
                    }
					return (
						<circle
                        key={value}
							cy={h/2}
							cx={x}
							r={4}
							fill="var(--explanation)"
							opacity={0.5}
						></circle>
					);
				})}
                {secs.map((s, idx) => {
                    let x = ((s - minVal) / (maxVal - minVal)) * (w-30) + 2
                    if (minVal === maxVal) {
                        x = w/2
                    }
                    return <text key={s} color="#777777" fontSize={11} x={x} y={14 + h/2}>{s}</text>
                })}
                <text fontSize={11} color="#777777" x={w-15} y={3 + h/2}>sec</text>
			</svg>
	);
}

export default RangeVis;
