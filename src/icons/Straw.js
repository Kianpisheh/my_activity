import * as React from "react";

const SvgStraw = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={56}
    height={102}
    fill="none"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeWidth={4}
      d="M2 100V22.355a2 2 0 0 1 1.264-1.86l44.878-17.76a2 2 0 0 1 2.595 1.123l2.507 6.323a2 2 0 0 1-1.17 2.615L15.81 26.126a2 2 0 0 0-1.31 1.878V100"
    />
    <path stroke="#000" strokeWidth={4} d="M1 100h15" />
  </svg>
);

export default SvgStraw;
