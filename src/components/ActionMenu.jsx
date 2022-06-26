import "./ActionMenu.css";

function ActionMenu(props) {
    const { width, height, actions } = props;

    return (
        <div className="action-menu" style={{ width: width, height: height }}>
            <ul>
                {actions.map((action) => {
                    return (
                        <li key={action} onClick={() => props.onExplanationRequest(action)}>
                            {action}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default ActionMenu;
