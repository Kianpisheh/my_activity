import * as React from "react";

const SvgUpArrow = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 18"
        style={{
            enableBackground: "new 0 0 16 18",
        }}
        xmlSpace="preserve"
        {...props}
    >
        <path fill="#1391D8" d="M7 17a1 1 0 1 0 2 0H7ZM8.707.293a1 1 0 0 0-1.414 0L.929 6.657A1 1 0 0 0 2.343 8.07L8 2.414l5.657 5.657a1 1 0 1 0 1.414-1.414L8.707.293ZM9 17V1H7v16h2Z" />
    </svg>
);

export default SvgUpArrow;
