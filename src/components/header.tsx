import { JSX } from 'preact';
import  { Dispatch } from 'preact/compat';

import './header.css';
import Button from './button';

interface Props {
  onReportClick: Dispatch<unknown>;
}

const Header = ({ onReportClick }: Props): JSX.Element => {
  return (
    <header className="header">
      <img src="/logo.svg"/>
      <div class="options">
        <Button variant="text" size="small" onClick={onReportClick as () => void}>Report</Button>
        <Button size="small" onClick={() => window.close()}>
          <img src="/icons/close.svg"/>
        </Button>
      </div>
    </header>
  );
};

export default Header;
