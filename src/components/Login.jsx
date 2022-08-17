import "./Login.css";

function Login(props) {
	const { enteredPass, enteredUser, onSubmit, onUserChange, onPassChange } = props;

	return (
		<div className="form">
			<form id="login-form" onSubmit={(ev) => onSubmit(ev)}>
				<div className="input-container">
					<label>Username </label>
					<input
						type="text"
						name="uname"
						required
						value={enteredUser}
						onChange={(event) => onUserChange(event.target.value)}
					/>
					{/* {renderErrorMessage("uname")} */}
				</div>
				<div className="input-container">
					<label>Password </label>
					<input
						type="password"
						name="pass"
						required
						value={enteredPass}
						onChange={(event) => onPassChange(event.target.value)}
					/>
					{/* {renderErrorMessage("pass")} */}
				</div>
				<div id="button-container">
					<input type="submit" />
				</div>
			</form>
		</div>
	);
}

export default Login;
