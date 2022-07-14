function LocationOverlay(props) {
    const { eventsX, events } = props;

    const colors = ["#3B84CE", "#CE3B54", "#39B665", "#DF7426", "#CB26DF"]

    let locations = []; // x1, x2, loc
    // find location intervals
    let x1 = eventsX[0].x1;
    for (let i = 1; i < events.length; i++) {
        if (events[i - 1].getLocation() !== events[i].getLocation() || (i === events.length - 1)) {
            locations.push({ x1: x1, x2: eventsX[i - 1].x2, location: events[i - 1].getLocation() });
            x1 = eventsX[i].x1;
        }
    }

    return <svg y={-80} height={240} key={"loc_overlay_svg"} vb={props.vb} style={{ float: "left" }}>
        {locations.map((loc, idx) => {
            return <rect key={"loc_ov_" + idx} x={loc.x1} width={loc.x2 - loc.x1} height={240} fill={colors[idx]} opacity={0.1} />
        })}

    </svg>

}


export default LocationOverlay;