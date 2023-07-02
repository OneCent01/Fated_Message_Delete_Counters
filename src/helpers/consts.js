export const KDAWG_USER_ID = '221785400';
export const FATED_USER_ID = '184426448';
export const ZULII_USER_ID = '238086975';

export const ROOT_HTML_TEMPLATE = `
	<div id="delete_counter_container"></div>
`;

export const PAGE_CSS = `
	html, body {
		margin: 0px;
		position: relative;
		font-family: 'Fredoka', sans-serif;
	}

	.invisible {
		opacity: 0;
		transition: opacity 1s;
	}

	.visible {
		opacity: 1;
		transition: opacity 1s;
	}

	.flex_container {
		position: absolute;
		top: 0;
		right: 0;
	}

	.delete_counter {
	 	background-color: #3F3F3F;
	 	color: white;
	 	border-radius: 4px;
	 	border: 2px solid darkslategray;
	 	padding: 8px 16px;
		font-size: 42px;
		width: fit-content;
		white-space: nowrap;
		position: absolute;
		display: block;
		right: 10px;
	}

	#delete_counter_container {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
`;
