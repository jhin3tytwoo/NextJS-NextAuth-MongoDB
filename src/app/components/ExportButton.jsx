"use client";

import React from 'react';

function ExportButton() {
  const handleExport = async () => {
    try {
      const response = await fetch('/api/export');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to export data');
      }

      const blob = new Blob([JSON.stringify(data.posts)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <button onClick={handleExport} className='bg-blue-500 text-white p-2 rounded'>
      Export Data
    </button>
  );
}

export default ExportButton;
