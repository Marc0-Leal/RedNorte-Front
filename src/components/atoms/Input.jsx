import React from 'react';

function Input({
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  className = '',
  ...props
}) {
  if (type === 'textarea') {
    return (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  );
}

export default Input;