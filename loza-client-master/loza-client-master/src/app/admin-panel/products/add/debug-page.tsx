"use client";

import { useState } from "react";
import { useCreateProductMutation } from "@/redux/features/products/productApi";
import toast from "react-hot-toast";

export default function DebugProductCreationPage() {
  const [createProduct, { isLoading, error, isSuccess }] = useCreateProductMutation();
  const [result, setResult] = useState("");

  const testProductCreation = async () => {
    setResult("Testing product creation...");
    
    const testData = {
      data: {
        name: "Test Product " + Date.now(),
        description: "Test description",
        price: 100,
        discountPrice: 80,
        points: 10,
        category: "test-category",
        coverImage: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
        images: [],
        info: [
          {
            size: "M",
            quantity: 10
          }
        ]
      }
    };

    try {
      console.log("🔧 Testing product creation with:", testData);
      const response = await createProduct(testData).unwrap();
      setResult(`✅ Success: ${JSON.stringify(response, null, 2)}`);
      toast.success("Product created successfully!");
    } catch (err) {
      console.error("🔧 Product creation error:", err);
      setResult(`❌ Error: ${JSON.stringify(err, null, 2)}`);
      toast.error(`Product creation failed: ${JSON.stringify(err)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Debug Product Creation</h1>
        
        <div className="space-y-4">
          <button
            onClick={testProductCreation}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Test Product Creation"}
          </button>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {result || "No result yet"}
            </pre>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">RTK Query State:</h3>
            <div className="text-sm space-y-1">
              <div>isSuccess: {isSuccess ? "✅" : "❌"}</div>
              <div>isLoading: {isLoading ? "⏳" : "✅"}</div>
              <div>Error: {error ? JSON.stringify(error, null, 2) : "None"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
