import React from 'react';

function Button({ text, children, className = '', ...props }) {
  return (
    <button className={className} {...props}>
      {children ?? text}
    </button>
  );
}

export default Button;