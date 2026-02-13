import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeBlock.css';

interface CodeBlockProps {
  code: string;
  language: string;
  maxHeight?: number;
  showHeader?: boolean;
}

const LANGUAGE_MAP: Record<string, string> = {
  'JavaScript': 'javascript',
  'TypeScript': 'typescript',
  'Python': 'python',
  'Java': 'java',
  'C++': 'cpp',
  'C#': 'csharp',
  'Go': 'go',
  'Rust': 'rust',
  'Ruby': 'ruby',
  'PHP': 'php',
  'Swift': 'swift',
  'Kotlin': 'kotlin',
  'HTML': 'html',
  'CSS': 'css',
  'SQL': 'sql',
};

export default function CodeBlock({ code, language, maxHeight, showHeader = true }: CodeBlockProps) {
  const langKey = LANGUAGE_MAP[language] ?? language.toLowerCase();

  return (
    <div className="codeblock-container">
      {showHeader && (
        <div className="codeblock-header">
          <div className="codeblock-dots">
            <span className="codeblock-dot codeblock-dot-red" />
            <span className="codeblock-dot codeblock-dot-yellow" />
            <span className="codeblock-dot codeblock-dot-green" />
          </div>
          <span className="codeblock-lang">{language}</span>
          <div className="codeblock-dots" style={{ visibility: 'hidden' }}>
            <span className="codeblock-dot" />
            <span className="codeblock-dot" />
            <span className="codeblock-dot" />
          </div>
        </div>
      )}
      <div className="codeblock-body" style={maxHeight ? { maxHeight, overflow: 'hidden' } : undefined}>
        <SyntaxHighlighter
          language={langKey}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: 'var(--space-md)',
            background: 'transparent',
            fontSize: 'var(--text-sm)',
            lineHeight: '1.7',
            borderRadius: 0,
          }}
          showLineNumbers={false}
          wrapLines
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
        {maxHeight && <div className="codeblock-fade" />}
      </div>
    </div>
  );
}
