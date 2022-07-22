import * as React from "react";

const SvgDownArrow = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 18"
        style={{
            enableBackground: "new 0 0 16 18",
        }}
        xmlSpace="preserve"
        {...props}
    >
        <path fill="#1391D8" d="M8.5 1.5a1 1 0 0 0-2 0h2ZM6.793 19.207a1 1 0 0 0 1.414 0l6.364-6.364a1 1 0 0 0-1.414-1.414L7.5 17.086l-5.657-5.657A1 1 0 0 0 .43 12.843l6.364 6.364ZM6.5 1.5v17h2v-17h-2Z" />
    </svg>
);

export default SvgDownArrow;
