export const ScheduleContextMenu = ({ x, y, onModify, onDelete }) => {
    return (
        <div
            className="context-menu"
            style={{ top: y, left: x }}
            onClick={(e) => e.stopPropagation()}
        >
            <button onClick={onModify}>✏️ Modify</button>
            <button className="danger" onClick={onDelete}>🗑️ Delete</button>
        </div>
    )
}