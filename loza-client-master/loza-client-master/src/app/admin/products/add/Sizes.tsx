import React, { FC } from "react";
import { AiOutlineMinusCircle } from "react-icons/ai";

type Props = {
  productInfo: any;
  setProductInfo: any;
};

const AddSize: FC<Props> = ({ productInfo, setProductInfo }) => {
  const availableSizes = ["S", "M", "L", "XL"];

  const handleSizeToggle = (size: string) => {
    const existingSizeIndex = productInfo.findIndex((item: any) => item.size === size);
    
    if (existingSizeIndex >= 0) {
      // Remove the size if already selected
      const updated = [...productInfo];
      updated.splice(existingSizeIndex, 1);
      setProductInfo(updated);
    } else {
      // Add the size with default quantity 0
      setProductInfo([...productInfo, { size, quantity: 0 }]);
    }
  };

  const handleQuantityChange = (index: number, value: any) => {
    const updatedQuantity = [...productInfo];
    updatedQuantity[index].quantity = parseInt(value) || 0;
    setProductInfo(updatedQuantity);
  };

  const handleRemoveSize = (index: number) => {
    const updated = [...productInfo];
    updated.splice(index, 1);
    setProductInfo(updated);
  };

  const isSizeSelected = (size: string) => {
    return productInfo.some((item: any) => item.size === size);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Size Selection Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Sizes
        </label>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeToggle(size)}
              className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                isSizeSelected(size)
                  ? "border-purple-600 bg-purple-600 text-white"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Inputs for Selected Sizes */}
      {productInfo.length > 0 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Quantity for Selected Sizes
          </label>
          {productInfo.map((item: any, index: number) => (
            <div
              className="flex flex-row justify-between items-center py-2 gap-4 border-b pb-4"
              key={index}
            >
              {/* Size Label */}
              <div className="flex w-[20%] flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {item.size}
                </span>
              </div>

              {/* QUANTITY */}
              <div className="flex w-[60%] flex-col">
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={item.quantity}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
              </div>

              {/* REMOVE BUTTON */}
              <div className="flex flex-col items-center justify-center">
                <AiOutlineMinusCircle
                  className="cursor-pointer text-red-600 hover:text-red-800 h-[26px] w-[26px]"
                  onClick={() => handleRemoveSize(index)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddSize;
