import React from "react";
import './button.css';

interface Props {
    onClick: () => void;
    children: React.ReactElement | string;
    type?: 'text' | 'primary' | 'secondary';
    className?: string;
    size?: 'small'
}

const Button: React.FC<Props> = ({ onClick, className, type = 'text', size = '', children }) => {
    return (
        <button className={`btn ${className} ${type} ${size}`} onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;
