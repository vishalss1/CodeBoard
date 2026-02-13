import {
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type ReactElement,
  Children,
  cloneElement,
  isValidElement,
} from 'react';
import './TerminalAnimation.css';

/* ── AnimatedSpan ── */
interface AnimatedSpanProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Injected by Terminal; do NOT set manually */
  _startMs?: number;
}

export function AnimatedSpan({ children, className = '', _startMs = 0 }: AnimatedSpanProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), _startMs);
    return () => clearTimeout(timer);
  }, [_startMs]);

  return (
    <div
      ref={ref}
      className={`terminal-line ${visible ? 'terminal-line-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/* ── TypingAnimation ── */
interface TypingAnimationProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  /** Injected by Terminal; do NOT set manually */
  _startMs?: number;
}

export function TypingAnimation({
  children,
  className = '',
  duration = 60,
  _startMs = 0,
}: TypingAnimationProps) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), _startMs);
    return () => clearTimeout(startTimer);
  }, [_startMs]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(children.slice(0, i + 1));
      i++;
      if (i >= children.length) clearInterval(id);
    }, duration);
    return () => clearInterval(id);
  }, [started, children, duration]);

  return (
    <div className={`terminal-line terminal-line-visible ${className}`}>
      {displayed}
      {started && displayed.length < children.length && (
        <span className="terminal-cursor" />
      )}
    </div>
  );
}

/* ── Terminal ── */
interface TerminalProps {
  children: ReactNode;
  className?: string;
}

export function Terminal({ children, className = '' }: TerminalProps) {
  // Auto-sequence children: each starts after the previous finishes
  const elements = Children.toArray(children).filter(isValidElement) as ReactElement[];
  let cumulativeMs = 0;

  const sequenced = elements.map((child) => {
    const props = child.props as Record<string, unknown>;
    const delay = (props.delay as number) ?? 0;
    const startMs = cumulativeMs + delay;

    // Calculate how long this child takes
    if (child.type === TypingAnimation) {
      const text = props.children as string;
      const duration = (props.duration as number) ?? 60;
      cumulativeMs = startMs + text.length * duration + 200;
    } else {
      // AnimatedSpan: appears instantly after its start
      cumulativeMs = startMs + 400;
    }

    return cloneElement(child, { _startMs: startMs } as Record<string, unknown>);
  });

  return (
    <div className={`terminal ${className}`}>
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
        </div>
        <span className="terminal-title">terminal</span>
        <div className="terminal-dots" style={{ visibility: 'hidden' }}>
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-dot" />
        </div>
      </div>
      <div className="terminal-body">
        {sequenced}
      </div>
    </div>
  );
}
