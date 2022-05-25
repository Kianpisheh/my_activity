function TimeAxis(props) {

    const { scale } = props.config;


    return <div className="time-axis-constainer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 20" width={scale * props.tmax} height={20}>
            <line x1="0" y1="0" x2="600" y2="0" stroke="black" strokeWidth={2}></line>
        </svg>
    </div>
}


export default TimeAxis;