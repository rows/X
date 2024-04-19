import './button.css';
import { FunctionComponent, ComponentChildren } from 'preact';

interface Props {
  onClick?: () => void;
  children: ComponentChildren;
  variant?: 'text' | 'primary' | 'secondary' | 'from';
  type?: string;
  className?: string;
  size?: 'small';
}

const Button: FunctionComponent<Props> = ({
  onClick,
  className = '',
  variant = 'text',
  type,
  size = '',
  children,
}) => {
  return (
    <button type={type} className={`btn ${className} ${variant} ${size}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
