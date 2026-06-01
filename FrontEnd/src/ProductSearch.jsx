// src/ProductSearch.jsx
// 单独搜索栏组件，仅包含输入框和搜索按钮，父组件负责调用搜索 API

import React, { useState } from 'react';

function ProductSearch({ onSearch }) {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    onSearch(keyword);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-area">
      <input
        type="text"
        placeholder="Search products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default ProductSearch;