import * as React from "react";

const SvgMove = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 50 30"
		style={{
			enableBackground: "new 0 0 50 30",
		}}
		xmlSpace="preserve"
		{...props}
	>
		<path
			fill="#000"
			d="M1.188 16.172a2 2 0 1 0 1.624 3.656l-1.624-3.656Zm76.864 3.53a2 2 0 0 0 .65-2.754l-9.465-15.31a2 2 0 1 0-3.403 2.103l8.413 13.61-13.609 8.413a2 2 0 0 0 2.103 3.402l15.311-9.465Zm-75.24.126c11.17-4.965 18.492-7.456 28.45-7.516 10.098-.06 22.993 2.376 45.28 7.635l.918-3.894c-22.215-5.241-35.57-7.805-46.222-7.74-10.792.065-18.72 2.824-30.05 7.86l1.624 3.655Z"
		/>
	</svg>
);

export default SvgMove;