import { JSX } from 'preact';
import './header.css';
import Button from './button';

const Header = (): JSX.Element => {
  return (
    <header className="header">
      <img src="/logo.svg"/>
      <div class="options">
        <Button type="text" size="small" onClick={() => 0}>Report</Button>
        <Button size="small" onClick={() => window.close()}>
          <img src="/icons/close.svg"/>
        </Button>
      </div>
    </header>
  );
};

export default Header;
