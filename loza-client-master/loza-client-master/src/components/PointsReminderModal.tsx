"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Gift, Star } from "lucide-react";
import LoginModal from "./LoginModal";

interface PointsReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPoints: number;
}

export default function PointsReminderModal({ 
  isOpen, 
  onClose, 
  totalPoints 
}: PointsReminderModalProps) {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!isOpen) return null;

  const handleContinueWithoutLogin = () => {
    onClose();
    router.push("/checkout");
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    onClose();
    // Redirect to checkout after successful login
    setTimeout(() => {
      router.push("/checkout");
    }, 500);
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl z-10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-light text-gray-900 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Don't Miss Out on Rewards!
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-gray-900 fill-gray-900" />
                <p className="text-lg font-light text-gray-900 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Earn {totalPoints} Points with This Order
                </p>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                By creating an account and logging in, you can earn <span className="font-medium text-gray-900">{totalPoints} points</span> (worth <span className="font-medium text-gray-900">{totalPoints * 10} EGP</span>) with this purchase!
              </p>
              
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-4">
                <p className="text-sm text-gray-800 font-medium mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Benefits of creating an account:
                </p>
                <ul className="space-y-2 text-sm text-gray-700" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span className="font-light">Earn points with every purchase</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span className="font-light">Use points for discounts on future orders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span className="font-light">Track your order history</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span className="font-light">Faster checkout experience</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLogin}
                className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-light tracking-wide hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                Sign In / Sign Up
              </button>
              <button
                onClick={handleContinueWithoutLogin}
                className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg font-light tracking-wide border-2 border-gray-300 hover:border-gray-900 hover:text-gray-900 transition-all duration-200" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                Continue Without Account
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              You can still complete your purchase without an account, but you won't earn points or discounts.
            </p>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => {
            setShowLoginModal(false);
            // After login, close points modal and redirect to checkout
            handleLoginSuccess();
          }}
        />
      )}
    </>
  );
}

