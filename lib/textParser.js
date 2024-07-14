const parseTextToSections = (text) => {
  const sections = [];
  const lines = text.split('\n');
  let currentSection = null;

  lines.forEach((line) => {
    if (line.startsWith('# ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { heading: line.substring(2).trim(), content: [] };
    } else if (line.startsWith('## ')) {
      if (currentSection) {
        currentSection.content.push(line.substring(3).trim());
      }
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections.filter(
    (section) => section.heading && section.content.length > 0
  );
};

const formatSectionsToText = (sections) => {
  return sections
    .map(
      (section) =>
        `# ${section.heading}\n${section.content
          .map((item) => `## ${item}`)
          .join('\n')}`
    )
    .join('\n');
};

const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const lines = text.substring(0, start).split('\n');
    const lastLine = lines[lines.length - 1];
    let prefix = '';

    const hashMatch = lastLine.match(/^(#+) /);
    if (hashMatch) {
      prefix = `${hashMatch[1]} `;
    }

    textarea.setRangeText(`\n${prefix}`, start, end, 'end');
  }
};

const cleanText = (text) => {
  const lines = text.split('\n').filter((line) => line.trim() !== '');
  const cleanedLines = lines.filter((line, index) => {
    if (line.startsWith('## ')) {
      return line.trim().length > 3; // Filter out empty items
    } else if (line.startsWith('# ')) {
      const nextLine = lines[index + 1] || '';
      return line.trim().length > 2 && nextLine.startsWith('## '); // Filter out empty sections
    } else {
      return true;
    }
  });

  return cleanedLines.join('\n');
};

export { parseTextToSections, formatSectionsToText, handleKeyDown, cleanText };
