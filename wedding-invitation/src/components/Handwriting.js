// src/components/Handwriting.js
import { useEffect, useState } from "react";
import "./handwriting.css";

export default function Handwriting({
  open = true,
  maxWidth = 420,
  autoCloseMs = 0,
  onClose,
}) {
  const [visible, setVisible] = useState(open);

  useEffect(() => setVisible(open), [open]);
  useEffect(() => {
    if (!visible || !autoCloseMs) return;
    const t = setTimeout(() => { setVisible(false); onClose?.(); }, autoCloseMs);
    return () => clearTimeout(t);
  }, [visible, autoCloseMs, onClose]);

  if (!visible) return null;

  return (
    <div className="hw-overlay" role="dialog" aria-modal="true">
      <img src="/handwriting.gif" alt="Handwriting Animation" className="hw-gif" />
    </div>
  );
}
