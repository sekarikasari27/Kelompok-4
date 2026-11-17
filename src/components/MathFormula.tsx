import React, { useMemo } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  content: string;
  className?: string;
  block?: boolean;
}

export const MathFormula: React.FC<MathFormulaProps> = ({
  content,
  className = '',
  block = false
}) => {
  const renderedHtml = useMemo(() => {
    try {
      return katex.renderToString(content.trim(), {
        displayMode: block,
        throwOnError: false,
        output: 'htmlAndMathml'
      });
    } catch {
      return content;
    }
  }, [content, block]);

  if (block) {
    return (
      <div
        className={`math-block-container ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  return (
    <span
      className={`math-inline-container ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

interface TeksDenganRumusProps {
  teks: string;
  className?: string;
}

/**
 * Komponen cerdas untuk merender paragraf materi yang bercampur teks biasa
 * dan rumus LaTeX ($$...$$, \\[...\\], $...$, atau \\(...\\))
 */
export const TeksDenganRumus: React.FC<TeksDenganRumusProps> = ({ teks, className = '' }) => {
  const parts = useMemo(() => {
    // Pola regex mencakup:
    // 1. Block: $$ ... $$ atau \[ ... \]
    // 2. Inline: $ ... $ atau \( ... \)
    const regex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$\n]+?\$|\\\([\s\S]*?\\\))/g;
    const tokens = teks.split(regex);

    return tokens.map((token, index) => {
      if (!token) return null;

      // Cek apakah block math $$...$$ atau \[...\]
      if (token.startsWith('$$') && token.endsWith('$$')) {
        const math = token.slice(2, -2).trim();
        return (
          <MathFormula key={index} content={math} block={true} />
        );
      }
      if (token.startsWith('\\[') && token.endsWith('\\]')) {
        const math = token.slice(2, -2).trim();
        return (
          <MathFormula key={index} content={math} block={true} />
        );
      }

      // Cek apakah inline math $...$ atau \(...\)
      if (token.startsWith('$') && token.endsWith('$') && token.length > 2) {
        const math = token.slice(1, -1).trim();
        return (
          <MathFormula key={index} content={math} block={false} />
        );
      }
      if (token.startsWith('\\(') && token.endsWith('\\)')) {
        const math = token.slice(2, -2).trim();
        return (
          <MathFormula key={index} content={math} block={false} />
        );
      }

      // Teks biasa
      return <span key={index}>{token}</span>;
    });
  }, [teks]);

  return <span className={`teks-dengan-rumus ${className}`}>{parts}</span>;
};

