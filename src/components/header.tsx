import './header.css';
import Button from "./button.tsx";

const Header = () => {
    return (
        <header className="header">
            <img src="/logo.svg" />
            <Button onClick={() => window.close()}>
                <img src="/icons/close.svg" />
            </Button>
        </header>
    );
}

export default Header;
