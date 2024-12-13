interface TextShortcutProps {
  text: string;
  shortcutLetter?: string;
}

export const TextShortcut = ({ text, shortcutLetter }: TextShortcutProps) => {
  const renderTextWithUnderline = () => {
    if (shortcutLetter) {
      const index = text.indexOf(shortcutLetter);
      if (index !== -1) {
        return (
          <p>
            {text.slice(0, index)}
            <u>{text.charAt(index)}</u>
            {text.slice(index + 1, text.length)}
          </p>
        );
      }
    }
    return (
      <p>
        <u className="underline-offset-2 decoration-1">{text.charAt(0)}</u>
        {text.slice(1, text.length)}
      </p>
    );
  };

  return renderTextWithUnderline();
};
