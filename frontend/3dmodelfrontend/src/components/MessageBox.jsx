import React from 'react';
import '../component design/MessageBox.css'; // Make sure this exists

function MessageBox({ message, buttons }) {
    return (
        <div className="messagebox-overlay">
            <div className="messagebox-container">
                <p>{message}</p>
                <div className="messagebox-buttons">
                    {buttons.map((btn, idx) => (
                        <button key={idx} onClick={btn.onClick}>
                            {btn.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MessageBox;
