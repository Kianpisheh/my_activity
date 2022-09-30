import * as React from "react";

const SvgSink = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		style={{
			enableBackground: "new 0 0 512 512",
		}}
		xmlSpace="preserve"
		{...props}
	>
		<g>
			<g>
				<path d="M5.565,278.261v217.043c0,9.22,7.475,16.696,16.696,16.696h217.044V278.261H5.565z" />
			</g>
		</g>
		<g>
			<g>
				<path d="M272.696,278.261V512h217.043c9.22,0,16.696-7.475,16.696-16.696V278.261H272.696z" />
			</g>
		</g>
		<g>
			<g>
				<path
					d="M489.739,178.087H372.87v-16.696c0-9.223-7.473-16.696-16.696-16.696c-9.223,0-16.696,7.473-16.696,16.696v16.696h-66.783
			V83.478c0-27.619,22.468-50.087,50.087-50.087c27.619,0,50.087,22.468,50.087,50.087v16.696c0,9.223,7.473,16.696,16.696,16.696
			c9.223,0,16.696-7.473,16.696-16.696V83.478C406.261,37.446,368.815,0,322.783,0c-46.032,0-83.478,37.446-83.478,83.478v94.609
			h-66.783v-16.696c0-9.223-7.473-16.696-16.696-16.696c-9.223,0-16.696,7.473-16.696,16.696v16.696H22.261
			c-9.22,0-16.696,7.475-16.696,16.696v50.087h500.87v-50.087C506.435,185.562,498.96,178.087,489.739,178.087z"
				/>
			</g>
		</g>
	</svg>
);

export default SvgSink;
