import React from "react";
import SearchPage from "../../pages/shopping-view/search-page";

const SearchLayout = () => {
  console.log("✅ SearchLayout loaded"); // 🔥 Verifica si aparece en la consola del navegador
  return (
    <div>
      <h1>Search Page</h1>
      <SearchPage />
    </div>
  );
};

export default SearchLayout;
