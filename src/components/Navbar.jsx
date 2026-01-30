import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [fontSize, setFontSize] = useState(32); // base font size in px

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 40);

      // Dynamic font size: shrink from 48px to 28px
      const newFontSize = Math.max(28, 48 - scrollY * 0.3);
      setFontSize(newFontSize);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`xd-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container xd-nav-inner">
        {/* Logo with dynamic font size */}
        <div
          className="xd-logo"
          style={{ fontSize: `${fontSize}px`, transition: "font-size 0.2s ease" }}
        >
          <span className="xd-logo-x yellowtail-regular">X</span>
          <span className="xd-logo-done  dm-serif-text-regular">DONE</span>
        </div>

        {/* Button */}
        <button className="xd-btn">Create</button>
      </div>
    </nav>
  );
}

export default Navbar;
