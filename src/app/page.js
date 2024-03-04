"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { API_KEY, API_URL } from "./constants";

export default function Home() {
  const [domainName, setDomainName] = useState("");
  const [domainData, setDomainData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const tlds = [
    "com",
    "nl",
    "org",
    "net",
    "io",
    "ai",
    "app",
    "dev",
    "tech",
    "co",
    "io",
    "design",
    "blog",
    "shop",
    "store",
    "online",
    "website",
    "site",
    "host",
    "hosting",
    "cloud",
  ];

  const useLocalData = true;

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // Function to toggle cart visibility
  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  // Function to check domain availability
  const handleCheckDomain = async () => {
    if (!domainName) {
      alert("Please enter a domain name");
      return;
    } else if (domainName.length < 3) {
      alert("Please enter a valid domain name");
      return;
    }

    if (useLocalData) {
      const localDataArray = [];

      for (let i = 0; i < tlds.length; i++) {
        const localData = {
          domain: domainName,
          price: Math.floor(Math.random() * 99 + 1).toFixed(2),
          status: Math.random() > 0.5 ? "free" : "active",
          tld: tlds[i],
        };
        localDataArray.push(localData);
      }
      setDomainData(localDataArray);
    } else {
      try {
        const response = await axios.post(
          `${API_URL}`,
          {
            name: domainName,
            extension: "nl",
          },
          {
            headers: {
              Authorization: `Basic ${API_KEY}`,
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );

        if (response.status === 200) {
          console.log("Domain information:", response.data);
          setDomainData([response.data]);
        } else {
          console.error("Failed to fetch domain information");
          console.error(response);
        }
      } catch (error) {
        console.error("Error during API request:", error);
      }
    }
  };

  // Function to add domain to cart
  const addToCart = (domain) => {
    if (
      cartItems.some(
        (item) => item.domain === domain.domain && item.tld === domain.tld,
      )
    ) {
      alert("This domain is already in the cart.");
      return;
    }

    const updatedCart = [...cartItems, domain];
    setCartItems(updatedCart);

    // Update localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  // Function to remove domain from cart
  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);

    // Update localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  // Function to calculate subtotal
  const Cart = () => {
    const calculateSubtotal = () => {
      return cartItems.reduce(
        (total, item) => total + parseFloat(item.price),
        0,
      );
    };

    return (
      <div className="cart-popup absolute top-full mt-2 p-4 bg-white border rounded-lg shadow-md text-black">
        <h3 className="mb-4 text-lg font-semibold">Your Cart</h3>
        {cartItems.map((item, index) => (
          <div key={index} className="mb-4 flex border-b pb-2 last:border-b-0">
            <div className="ml-3">
              <p className="text-sm font-medium">
                {item.domain}.{item.tld}
              </p>
              <p className="text-gray-600 text-sm">Price: €{item.price}</p>
            </div>
            <button
              className="cart-delete align-self-end ml-5 text-red-500 hover:text-red-700"
              onClick={() => removeFromCart(index)}
            >
              Remove
            </button>
          </div>
        ))}
        {cartItems.length === 0 && (
          <p className="mt-4 text-gray-500">Your cart is empty.</p>
        )}
        {cartItems.length > 0 && (
          <>
            <h5 className="mt-4">
              Subtotal: €{calculateSubtotal().toFixed(2)}
            </h5>
            <div className="mt-4 flex justify-end">
              <Link href={{ pathname: "/cart" }}>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-md">
                  Checkout
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <main>
      <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 sticky top-0">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Domain Checker
            </span>
          </a>
          <div
            className="hidden w-full md:block md:w-auto"
            id="navbar-solid-bg"
          >
            <div className="cart-icon" onClick={toggleCartVisibility}>
              🛒
            </div>
          </div>
        </div>
        {isCartVisible && <Cart />}
      </nav>
      <div className="flex flex-col pt-24 px-10 items-center">
        <div className="max-w-xl w-full items-center justify-between font-mono text-sm flex mb-5">
          <input
            type="text"
            placeholder="Type here your domain name"
            className="w-full p-2 rounded-s-lg text-black"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
          />
          <button
            className="p-2 bg-blue-500 text-white rounded-r-lg"
            onClick={handleCheckDomain}
          >
            Check
          </button>
        </div>

        {domainData &&
          domainData.map((data, dataIndex) => (
            <div
              key={dataIndex}
              className="max-w-xl w-full mx-auto mb-4 bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex-row items-start">
                  <p className="text-lg text-black">
                    <span>{data.domain}</span>
                    <span className="font-bold">.{data.tld}</span>
                  </p>
                  <span
                    className={` p-1 rounded-lg text-sm ${
                      data.status === "free"
                        ? "text-green-700 bg-green-100"
                        : "text-red-700 bg-red-100"
                    }`}
                  >
                    {data.status === "free" ? "Available" : "Not available"}
                  </span>
                </div>

                <div className="flex items-center justify-items-start">
                  <p className="mr-4 text-lg text-black font-bold">
                    €{data.price}
                  </p>
                  {data.status === "free" ? (
                    <button
                      className="atc-button bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => addToCart(data)}
                    >
                      Add to cart
                    </button>
                  ) : (
                    <button className="atc-button bg-red-500 text-white rounded-lg cursor-not-allowed">
                      Not available
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
