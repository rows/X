import './button.css';
import { FunctionComponent } from "preact";

interface Props {
    onClick: () => void;
    children: any;
    type?: 'text' | 'primary' | 'secondary';
    className?: string;
    size?: 'small'
}

const Button: FunctionComponent<Props> = ({ onClick, className, type = 'text', size = '', children }) => {
    return (
        <button className={`btn ${className} ${type} ${size}`} onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;
