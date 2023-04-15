import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm'


const MarkdownParser = ({ markdown }) => {
  return <ReactMarkdown remarkPlugins={[gfm]} >{markdown}</ReactMarkdown>;
};

export default MarkdownParser;