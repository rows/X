import { JSX } from 'preact';
import './header.css';
import Button from './button';

const Header = (): JSX.Element => {
  return (
    <header className="header">
      <img src="/logo.svg" />
      <Button size="small" onClick={() => window.close()}>
        <img src="/icons/close.svg" />
      </Button>
    </header>
  );
};

export default Header;
