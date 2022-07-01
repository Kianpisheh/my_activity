

function Shadow(props) {
    return <svg
        key={props.id + "_svg_shadow"}
        x={props.x - 5}
        y={props.y - 5}
        width={props.width + 10}
        height={props.height + 10}
    >
        <defs>
            <filter
                id="f2"
                x="0"
                y="0"
                width="200%"
                height="200%"
            >
                <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="6"
                    floodColor={"#FF0000"}
                    floodOpacity={0.9}
                />
            </filter>
        </defs>
        <rect
            key={props.idx + "_rect"}
            x={2}
            y={2}
            width={props.width + 8}
            height={props.height + 8}
            fill="transparent"
            stroke={"#FF0000"}
            strokeWidth={1}
            rx={4}
            ry={4}
            filter="url(#f2)"
        ></rect>
    </svg>
}

export default Shadow;