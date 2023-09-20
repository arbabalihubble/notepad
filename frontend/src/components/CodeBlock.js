import PropTypes from 'prop-types';
import hljs from 'highlight.js/lib/core';

const CodeBlock = ({ language, value }) => {
  const highlightedCode = hljs.highlight(language, value).value;

  return (
    <pre>
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
};

CodeBlock.propTypes = {
  language: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default CodeBlock;
