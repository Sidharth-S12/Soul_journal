import React from 'react';

export default function Button({ children, type = 'button', onClick, className = '', loading, disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`neon-btn-primary w-full flex items-center justify-center gap-2 ${className}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      ) : (
        children
      )}
    </button>
  );
}
