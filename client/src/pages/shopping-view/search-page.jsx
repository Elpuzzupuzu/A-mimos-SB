// search-page.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts, clearSearchResults } from "../../redux/shop/search-slice";

const SearchPage = () => {
    const dispatch = useDispatch();
    const { searchResults, isLoading } = useSelector((state) => state.shopSearch);
    const [query, setQuery] = useState("");
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);

    const handleSearch = () => {
        if (query) {
            dispatch(searchProducts({ query, limit, offset }));
        }
    };

    const handleClearSearch = () => {
        setQuery("");
        dispatch(clearSearchResults());
    };

    return (
        <div>
            <h2>Search Products</h2>
            <div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, description, or category"
                />
                <button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? "Searching..." : "Search"}
                </button>
                <button onClick={handleClearSearch}>Clear</button>
            </div>

            <div>
                {searchResults.data.length > 0 && (
                    <ul>
                        {searchResults.data.map((product) => (
                            <li key={product.id}>
                                <h3>{product.title}</h3>
                                <p>{product.description}</p>
                                <p>Category: {product.category}</p>
                                <p>Price: ${product.price}</p>
                            </li>
                        ))}
                    </ul>
                )}

                {searchResults.data.length === 0 && !isLoading && (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
