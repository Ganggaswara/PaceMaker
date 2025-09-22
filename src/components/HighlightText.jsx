import React from 'react';

const HighlightText = ({ text, searchTerm }) => {
  if (!searchTerm || searchTerm.trim() === '') return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="bg-yellow-400 text-black px-1 rounded">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

export default HighlightText;
