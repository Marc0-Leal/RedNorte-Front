import React from 'react';

function Input({
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  className = '',
  error = '',
  ...props
}) {
  if (type === 'textarea') {
    return (
      <div className="input-wrapper">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${className} ${error ? 'input-error' : ''}`}
          {...props}
        />
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }

  return (
    <div className="input-wrapper">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${className} ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default Input;