import React, { useState } from 'react';

interface NameInputFormProps {
  onNameSubmit: (name: string) => void;
  disabled?: boolean;
  maxLeaves?: number;
  currentLeaves?: number;
}

const NameInputForm: React.FC<NameInputFormProps> = ({
  onNameSubmit,
  disabled = false,
  maxLeaves = 170,
  currentLeaves = 0
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }
    
    if (currentLeaves >= maxLeaves) {
      setError('All leaves have been used');
      return;
    }

    // Clear error and submit
    setError('');
    onNameSubmit(name.trim());
    setName('');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="name-input-form p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add a Name to the Tree</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Enter a name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            disabled={disabled || currentLeaves >= maxLeaves}
            placeholder="Type a name here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            maxLength={50}
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        
        <button
          type="submit"
          disabled={disabled || currentLeaves >= maxLeaves || !name.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {currentLeaves >= maxLeaves ? 'All Leaves Used' : 'Add Name to Tree'}
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Leaves used: {currentLeaves} / {maxLeaves}</p>
        {currentLeaves >= maxLeaves && (
          <p className="text-orange-600 font-medium">The tree is full!</p>
        )}
      </div>
    </div>
  );
};

export default NameInputForm;
