function RangeVis(props) {
	const { numbers } = props;
	const maxVal = Math.max(...numbers);
	const minVal = Math.min(...numbers);
    
    // dimentions
    const w = 180;
    const h = 30;
    
    // time annotations in seconds
    let secs = [];
    const range = maxVal - minVal
    if (range < 5) {
    } else {
        secs = [minVal, minVal + range/4, minVal + range/2, minVal + 3*range/4, maxVal]
    }

	return (
		<div className="svg-range-container">
			<svg width={w} height={h}>
				<line x1={0} x2={w-30} y1={h/2} y2={h/2} stroke="#666666" strokeWidth={2} strokeLinecap="round"></line>
				{numbers.map((value) => {
					return (
						<circle
                        key={value}
							cy={h/2}
							cx={((value - minVal) / (maxVal - minVal)) * (w-30) + 5}
							r={4}
							fill="var(--explanation)"
							opacity={0.5}
						></circle>
					);
				})}
                {secs.map(s => {
                    return <text key={s} color="#777777" fontSize={11} x={((s - minVal) / (maxVal - minVal)) * (w-30) + 2} y={14 + h/2}>{s}</text>
                })}
                <text fontSize={11} color="#777777" x={w-15} y={3 + h/2}>sec</text>
			</svg>
		</div>
	);
}

export default RangeVis;
