import { useEffect, useRef, useState } from "react";
import "./Content.css";

const quotes = [
  "Consistency beats motivation every time.",
  "Small steps every day lead to big results.",
  "Show up even when you don’t feel like it.",
  "Discipline is choosing what you want most.",
  "Progress matters more than perfection.",
  "Do it tired, do it scared, just do it.",
  "Your future self will thank you.",
  "One good day starts with one good decision.",
  "Focus on habits, not outcomes.",
  "You are building something bigger than today.",
  "Success is rented, and rent is due every day.",
  "Keep going, even slow progress is progress.",
  "Your effort today shapes your tomorrow.",
  "Dreams work when you do.",
  "Be consistent, not intense.",
  "Every day is a fresh opportunity.",
  "Hard work compounds over time.",
  "Stay patient and trust the process.",
  "You don’t need motivation, you need routine.",
  "Win the day, one task at a time."
];

function Content() {
  const [greeting, setGreeting] = useState("");
  const [displayText, setDisplayText] = useState("");

  const quoteRef = useRef("");
  const typingTimeout = useRef(null);
  const erasingTimeout = useRef(null);
  const intervalRef = useRef(null);

  // Greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    const typeText = (text, index = 0) => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        typingTimeout.current = setTimeout(
          () => typeText(text, index + 1),
          50
        );
      }
    };

    const eraseText = (text, index = text.length) => {
      if (index >= 0) {
        setDisplayText(text.slice(0, index));
        erasingTimeout.current = setTimeout(
          () => eraseText(text, index - 1),
          40
        );
      }
    };

    const showNewQuote = () => {
      const randomQuote =
        quotes[Math.floor(Math.random() * quotes.length)];
      quoteRef.current = randomQuote;
      typeText(randomQuote);
    };

    // Initial quote
    showNewQuote();

    // Change quote every 1 minute
    intervalRef.current = setInterval(() => {
      eraseText(quoteRef.current);
      setTimeout(showNewQuote, 2000);
    }, 60000);

    return () => {
      clearTimeout(typingTimeout.current);
      clearTimeout(erasingTimeout.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="xd-content">
      <h2 className="xd-greeting">
        {greeting}, <span className="xd-name">Mr. Patel</span>
      </h2>

      <p className="xd-quote">{displayText}</p>
    </div>
  );
}

export default Content;
