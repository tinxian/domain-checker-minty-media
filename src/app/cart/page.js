"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { taxRate } from "../constants";

export default function Cart() {
  // State variable to store cart items
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // Function to remove item from cart
  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);

    // Update localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  // Function to calculate total including taxes
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * taxRate;
    return subtotal + tax;
  };

  return (
    <div className="flex flex-col max-w-md mx-auto">
      <header className="flex items-center gap-4 border-b p-4">
        <Link
          className="flex items-center gap-2 text-lg font-bold md:text-base lg:text-lg xl:text-base"
          href={{ pathname: "/" }}
        >
          Cart
        </Link>
        <Link
          className="ml-auto flex items-center gap-2"
          href={{ pathname: "/" }}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="underline">Continue shopping</span>
        </Link>
      </header>
      <main className="flex-1 p-4 bg-white text-black rounded">
      {cartItems.length === 0 ? (
          <p className="text-black text-center">Your cart is empty.</p>
        ) : (
          <div className="grid gap-4">
            {cartItems.map((item, index) =>
              cartItem(index, item, removeFromCart)
            )}
          </div>
        )}
        {cartItems.length > 0 && (
          <div className="border border-black rounded-lg p-4 grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Subtotal</h4>
              <h4 className="font-semibold">
                €{calculateSubtotal().toFixed(2)}
              </h4>
            </div>
            <div className="md:col-span-2 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-1.5">
              <div className="flex flex-col gap-2">
                <h4 className="font-semibold">Tax</h4>
                <p className="text-sm">
                  ({(taxRate * 100).toFixed(0)}%): €
                  {(calculateSubtotal() * taxRate).toFixed(2)}
                </p>
              </div>
              <div className="ml-auto md:ml-10">
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold">Total</h4>
                  <h4 className="font-semibold">
                    €{calculateTotal().toFixed(2)}
                  </h4>
                </div>
              </div>
            </div>
            <button className="md:col-span-2 bg-blue-500 text-white p-2 rounded">
              Proceed to checkout
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function cartItem(index, item, removeFromCart) {
  return (
    <div key={index} className="border rounded-lg p-4 grid items-start gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font- text-base md:text-lg lg:text-base">
          {item.domain}.{item.tld}
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <button
            className="w-8 h-8"
            size="icon"
            variant="ghost"
            onClick={() => removeFromCart(index)}
          >
            <TrashIcon className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </button>
        </div>
      </div>
      <div className="md:col-span-2 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-1.5">
        <h3 className="font-semibold text-sm md:text-base">€{item.price}</h3>
      </div>
    </div>
  );
}

function ChevronLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
