import React from 'react';

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
  return (
    <div className="w-60 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div 
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer"
      >
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {product?.salePrice > 0 && (
            <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full">
              Sale
            </span>
          )}
        </div>
        
        <div className="p-3 space-y-2">
          <h2 className="text-sm font-bold line-clamp-1 text-gray-900">
            {product?.title}
          </h2>
          
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>{product?.category}</span>
            <span>{product?.brand}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${product?.salePrice > 0 ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-sm font-bold text-red-600">
                ${product?.salePrice}
              </span>
            )}
          </div>

          <button onClick={()=>handleAddtoCart(product?._id)} className="w-full py-1.5 px-3 text-sm bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-md transition-colors duration-200">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingProductTile;