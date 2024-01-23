import './button.css';
import { FunctionComponent, ComponentChildren } from 'preact';

interface Props {
  onClick: () => void;
  children: ComponentChildren;
  type?: 'text' | 'primary' | 'secondary';
  className?: string;
  size?: 'small';
}

const Button: FunctionComponent<Props> = ({
  onClick,
  className,
  type = 'text',
  size = '',
  children,
}) => {
  return (
    <button className={`btn ${className} ${type} ${size}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
