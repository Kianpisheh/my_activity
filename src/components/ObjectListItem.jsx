import "./ObjectListItem.css"

function ObjectListItem(props) {
    return <div className="list-item-container">
        <img src={props.item} alt="XX" width={25} height={25}></img>
        <text style={{ fontSize: 12 }}>{props.itemName}</text>
    </div>
}


export default ObjectListItem;