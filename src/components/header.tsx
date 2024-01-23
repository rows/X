import './header.css';
import Button from './button';

const Header = () => {
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
