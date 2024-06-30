import React, { useState } from 'react';

const PopupWindow = ({ id, title, onClose, children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="popup-window"
      id={id}
      style={{ left: `${position.x}px`, top: `${position.y}px`, position: 'absolute' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Ensure dragging stops when mouse leaves the window
    >
      <div className="title-bar" onMouseDown={handleMouseDown}>
        {title}
        <div className="popup-controls">
          <button onClick={onClose}>X</button>
        </div>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default PopupWindow;
