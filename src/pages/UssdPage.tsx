import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Product, CartItem, Order, PaymentMethod, Transaction types
const initialState = {
  currentMenu: "main",
  userType: null,
  cart: [],
  farmerProducts: [
    { id: 1, name: "Tomatoes", price: 18.99, stock: 50, category: "vegetables", farmer: "Green Valley Farm" },
    { id: 2, name: "Spinach", price: 24.5, stock: 30, category: "vegetables", farmer: "Green Valley Farm" },
    { id: 3, name: "Carrots", price: 21.99, stock: 40, category: "vegetables", farmer: "Sunny Acres" },
    { id: 4, name: "Strawberries", price: 35.5, stock: 20, category: "fruits", farmer: "Berry Good Farms" },
    { id: 5, name: "Apples", price: 12.99, stock: 35, category: "fruits", farmer: "Orchard Fresh" },
    { id: 6, name: "Free Range Eggs", price: 45.0, stock: 15, category: "eggs", farmer: "Happy Hens" }
  ],
  orders: [
    { id: 1, items: ["Tomatoes (2kg)", "Carrots (1kg)"], total: 59.97, date: "2023-05-15", status: "delivered" },
    { id: 2, items: ["Strawberries (1 box)", "Apples (3kg)"], total: 84.47, date: "2023-06-02", status: "delivered" }
  ],
  balance: 1845.97,
  paymentMethods: [
    { id: 1, name: "Mobile Money", number: "0821234567" },
    { id: 2, name: "Bank Transfer", number: "1234567890", bank: "Standard Bank" }
  ],
  currentProduct: null,
  newProduct: {},
  currentOrder: null,
  paymentStatus: null,
  currentCategory: null,
  currentPaymentMethod: null,
  transactions: [
    { date: "2023-06-28", amount: 45.0, type: "sale", order: 2 },
    { date: "2023-06-15", amount: 59.97, type: "sale", order: 1 },
    { date: "2023-05-30", amount: -200.0, type: "payout", reference: "PAY12345" }
  ]
};

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

const categoryMap = {
  "Vegetables": "vegetables",
  "Fruits": "fruits",
  "Eggs & Dairy": "eggs",
  "All Products": "all"
};
const categories = ["vegetables", "fruits", "eggs", "dairy", "other"];
const editCategories = ["vegetables", "fruits", "eggs", "dairy", "other"];

function getMenuText(state, menus, data = null) {
  const menu = menus[state.currentMenu];
  if (typeof menu === "function") {
    if (state.currentMenu === "productCategory") return menu(data || "All Products", state);
    if (state.currentMenu === "productDetail") return menu(state.currentProduct, state);
    if (state.currentMenu === "checkout") return menu(state.cart.reduce((sum, item) => sum + item.price * item.qty, 0), state);
    if (state.currentMenu === "paymentConfirm") return menu(state.currentPaymentMethod, state.cart.reduce((sum, item) => sum + item.price * item.qty, 0), state);
    return menu(data, state);
  }
  return menu || "Menu not found";
}

const menus = {
  main: `\nWelcome to Farm2City\n==========================\n1. Consumer\n2. Farmer\n\n00. Exit\n            `,
  consumer: state => `\nConsumer Menu\n=============\n1. Browse Products\n2. My Cart (${state.cart.length})\n3. Checkout\n4. Order History\n\n0. Main Menu\n00. Exit\n            `,
  farmer: state => `\nFarmer Dashboard\n===============\n1. Product Management\n2. Order Management\n3. Sales Analytics\n4. Payment Settings\n5. Account (R${state.balance.toFixed(2)})\n\n0. Main Menu\n00. Exit\n            `,
  browseProducts: `\nBrowse Products\n===============\n1. Vegetables\n2. Fruits\n3. Eggs & Dairy\n4. All Products\n\n0. Back\n00. Main Menu\n            `,
  productCategory: (category, state) => {
    const cat = categoryMap[category] || "all";
    const products = state.farmerProducts.filter(p => cat === "all" || p.category === cat);
    return `\n${category} Available\n${"=".repeat(category.length + 9)}\n${products.map((p, i) => `${i + 1}. ${p.name} - R${p.price.toFixed(2)} (${p.stock} left)`).join("\n")}\n\n0. Back\n00. Main Menu\n                `;
  },
  productDetail: (product, state) => `\n${product.name}\n${"=".repeat(product.name.length)}\nPrice: R${product.price.toFixed(2)}\nStock: ${product.stock}\nCategory: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}\n\n1. Add to Cart\n2. View Farmer Info\n\n0. Back\n00. Main Menu\n            `,
  cart: state => `\nYour Shopping Cart\n=================\n${state.cart.length > 0 ? state.cart.map((item, i) => `${i + 1}. ${item.name} x${item.qty} - R${(item.price * item.qty).toFixed(2)}`).join("\n") + `\n\nTotal: R${state.cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2)}` : "Your cart is empty"}\n\n1. Checkout\n2. Remove Item\n3. Clear Cart\n\n0. Back\n00. Main Menu\n            `,
  checkout: (total, state) => `\nConfirm Order\n============\nItems: ${state.cart.length}\nTotal: R${total.toFixed(2)}\n\n1. Proceed to Payment\n2. Change Order\n\n0. Back\n00. Main Menu\n            `,
  paymentMethods: state => `\nSelect Payment Method\n====================\n${state.paymentMethods.map((method, i) => `${i + 1}. ${method.name}${method.bank ? ` (${method.bank})` : ""}`).join("\n")}\n\n0. Back\n00. Main Menu\n            `,
  paymentConfirm: (method, total, state) => `\nConfirm Payment\n==============\nAmount: R${total.toFixed(2)}\nMethod: ${method.name}\n${method.bank ? `Bank: ${method.bank}\nAccount: ${method.number}` : `Number: ${method.number}`}\n\n1. Confirm Payment\n2. Change Method\n\n0. Cancel\n            `,
  farmerProducts: `\nProduct Management\n=================\n1. View All Products\n2. Add New Product\n3. Edit Product\n4. Delete Product\n\n0. Back\n00. Main Menu\n            `,
  farmerOrders: `\nOrder Management\n===============\n1. View All Orders\n2. View Pending\n3. View Completed\n4. Update Status\n\n0. Back\n00. Main Menu\n            `,
  salesAnalytics: state => `\nSales Analytics\n==============\nTotal Sales: R${state.orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}\nTotal Orders: ${state.orders.length}\nThis Month: R${state.orders.filter(o => o.date.includes("2023-06")).reduce((sum, o) => sum + o.total, 0).toFixed(2)}\n\n1. Sales Report\n2. Popular Items\n\n0. Back\n00. Main Menu\n            `,
  paymentSettings: `\nPayment Settings\n===============\n1. View Methods\n2. Add Method\n3. Remove Method\n\n0. Back\n00. Main Menu\n            `,
  accountBalance: state => `\nAccount Balance\n==============\nAvailable: R${state.balance.toFixed(2)}\nPending: R0.00\n\n1. Request Payout\n2. Transaction History\n\n0. Back\n00. Main Menu\n            `
};

const Instructions = () => (
  <div className="instructions">
    <h2>How to Use Farm2CityUSSD</h2>
    <p>Welcome to Farm2City - your gateway to connecting farmers and consumers for fresh, healthy produce.</p>
    <h3>Getting Started:</h3>
    <ol>
      <li>Select your role: <strong>1 for Consumer</strong> or <strong>2 for Farmer</strong></li>
      <li>Follow the menu prompts to navigate the system</li>
      <li>Use <strong>* to clear</strong> your input</li>
      <li>Press <strong># to send</strong> your selection</li>
      <li>Type <strong>00 at any time</strong> to exit</li>
    </ol>
    <h3>For Consumers:</h3>
    <p>Browse fresh produce, add items to your cart, and complete purchases directly from local farmers.</p>
    <h3>For Farmers:</h3>
    <p>Manage your product listings, track orders, view sales analytics, and receive payments.</p>
    
  </div>
);

const UssdPage = () => {
  const [state, setState] = useState(initialState);
  const [inputValue, setInputValue] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "", visible: false });
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Helper for notification
  const showNotification = (message, type = "", duration = 2000) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification({ message: "", type: "", visible: false }), duration);
  };

  // Keypad handler
  const pressKey = key => {
    if (key === "*") {
      setInputValue("");
      inputRef.current?.focus();
    } else if (key === "#") {
      if (inputValue.trim()) handleSend();
    } else {
      setInputValue(prev => prev + key);
      inputRef.current?.focus();
    }
  };

  // Send button handler
  const handleSend = () => {
    if (inputValue.trim()) {
      processInput(inputValue);
      setInputValue("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Main USSD logic
  function processInput(input) {
    input = input.trim();
    let newState = { ...state };
    // Main Menu
    if (state.currentMenu === "main") {
      if (input === "1") {
        newState.userType = "consumer";
        newState.currentMenu = "consumer";
      } else if (input === "2") {
        newState.userType = "farmer";
        newState.currentMenu = "farmer";
      } else if (input === "00") {
        showNotification("Thank you for using Farm2City!", "success");
        setTimeout(() => setState({ ...initialState }), 2000);
        return;
      }
      setState(newState);
      return;
    }
    // Consumer Menu
    if (state.currentMenu === "consumer") {
      if (input === "1") newState.currentMenu = "browseProducts";
      else if (input === "2") newState.currentMenu = "cart";
      else if (input === "3") {
        if (state.cart.length > 0) newState.currentMenu = "checkout";
        else showNotification("Your cart is empty.", "warning");
      }
      else if (input === "4") newState.currentMenu = "orderHistory";
      else if (input === "0") newState.currentMenu = "main";
      else if (input === "00") {
        showNotification("Thank you for using Farm2City!", "success");
        setTimeout(() => setState({ ...initialState }), 2000);
        return;
      }
      setState(newState);
      return;
    }
    // Browse Products
    if (state.currentMenu === "browseProducts") {
      if (["1","2","3","4"].includes(input)) {
        let cat = ["Vegetables","Fruits","Eggs & Dairy","All Products"][parseInt(input)-1];
        newState.currentCategory = cat;
        newState.currentMenu = "productCategory";
      } else if (input === "0") newState.currentMenu = "consumer";
      else if (input === "00") newState.currentMenu = "main";
      setState(newState);
      return;
    }
    // Product Category
    if (state.currentMenu === "productCategory") {
      const cat = categoryMap[state.currentCategory] || "all";
      const products = state.farmerProducts.filter(p => cat === "all" || p.category === cat);
      const idx = parseInt(input)-1;
      if (!isNaN(idx) && idx >= 0 && idx < products.length) {
        newState.currentProduct = products[idx];
        newState.currentMenu = "productDetail";
      } else if (input === "0") newState.currentMenu = "browseProducts";
      else if (input === "00") newState.currentMenu = "main";
      setState(newState);
      return;
    }
    // Product Detail
    if (state.currentMenu === "productDetail") {
      if (input === "1") {
        // Add to cart
        const prod = state.currentProduct;
        let cartItem = newState.cart.find(item => item.id === prod.id);
        if (cartItem) cartItem.qty += 1;
        else newState.cart.push({ ...prod, qty: 1 });
        showNotification("Added to cart!", "success");
      } else if (input === "2") {
        showNotification(`Farmer: ${state.currentProduct.farmer}`, "info");
      } else if (input === "0") newState.currentMenu = "productCategory";
      else if (input === "00") newState.currentMenu = "main";
      setState(newState);
      return;
    }
    // Cart
    if (state.currentMenu === "cart") {
      if (input === "1") {
        if (state.cart.length > 0) newState.currentMenu = "checkout";
        else showNotification("Your cart is empty.", "warning");
      } else if (input === "2") {
        if (state.cart.length > 0) {
          newState.cart.pop();
          showNotification("Last item removed.", "info");
        } else showNotification("Cart is empty.", "warning");
      } else if (input === "3") {
        newState.cart = [];
        showNotification("Cart cleared.", "info");
      } else if (input === "0") newState.currentMenu = "consumer";
      else if (input === "00") newState.currentMenu = "main";
      setState(newState);
      return;
    }
    // Checkout
    if (state.currentMenu === "checkout") {
      if (input === "1") newState.currentMenu = "paymentMethods";
      else if (input === "2") newState.currentMenu = "cart";
      else if (input === "0") newState.currentMenu = "cart";
      else if (input === "00") newState.currentMenu = "main";
      setState(newState);
      return;
    }
    // Payment Methods
    if (state.currentMenu === "paymentMethods") {
      const idx = parseInt(input)-1;
      if (!isNaN(idx) && idx >= 0 && idx < state.paymentMethods.length) {
        newState.currentPaymentMethod = state.paymentMethods[idx];
        newState.currentMenu = "paymentConfirm";
      } else if (input === "0") newState.currentMenu = "checkout";
      else if (input === "00") newState.currentMenu = "main";
      setState(newState);
      return;
    }
    // Payment Confirm
    if (state.currentMenu === "paymentConfirm") {
      if (input === "1") {
        showNotification("Payment successful!", "success");
        newState.orders.push({
          id: state.orders.length+1,
          items: state.cart.map(item => `${item.name} (${item.qty})`),
          total: state.cart.reduce((sum, item) => sum + item.price * item.qty, 0),
          date: new Date().toISOString().slice(0,10),
          status: "delivered"
        });
        newState.cart = [];
        newState.currentMenu = "consumer";
      } else if (input === "2") newState.currentMenu = "paymentMethods";
      else if (input === "0") newState.currentMenu = "checkout";
      setState(newState);
      return;
    }
    // Order History
    if (state.currentMenu === "orderHistory") {
      if (input === "0") newState.currentMenu = "consumer";
      else if (input === "00") newState.currentMenu = "main";
      setState(newState);
      return;
    }
    // Farmer Menu
    if (state.currentMenu === "farmer") {
      if (input === "1") newState.currentMenu = "farmerProducts";
      else if (input === "2") newState.currentMenu = "farmerOrders";
      else if (input === "3") newState.currentMenu = "salesAnalytics";
      else if (input === "4") newState.currentMenu = "paymentSettings";
      else if (input === "5") newState.currentMenu = "accountBalance";
      else if (input === "0") newState.currentMenu = "main";
      else if (input === "00") {
        showNotification("Thank you for using Farm2City!", "success");
        setTimeout(() => setState({ ...initialState }), 2000);
        return;
      }
      setState(newState);
      return;
    }
    // Farmer Products
    if (state.currentMenu === "farmerProducts") {
      if (input === "1") newState.currentMenu = "viewProducts";
      else if (input === "2") newState.currentMenu = "addProduct";
      else if (input === "3") newState.currentMenu = "editProduct";
      else if (input === "4") newState.currentMenu = "deleteProduct";
      else if (input === "0") newState.currentMenu = "farmer";
      else if (input === "00") newState.currentMenu = "main";
      setState(newState);
      return;
    }
    // View Products
    if (state.currentMenu === "viewProducts") {
      if (input === "0") newState.currentMenu = "farmerProducts";
      else if (input === "00") newState.currentMenu = "main";
      setState(newState);
      return;
    }
    // Add Product
    if (state.currentMenu === "addProduct") {
      // For demo, just add a dummy product
      newState.farmerProducts.push({
        id: state.farmerProducts.length+1,
        name: `New Product ${state.farmerProducts.length+1}`,
        price: 10.0,
        stock: 10,
        category: "other",
        farmer: "Demo Farmer"
      });
      showNotification("Product added!", "success");
      newState.currentMenu = "farmerProducts";
      setState(newState);
      return;
    }
    // Edit Product
    if (state.currentMenu === "editProduct") {
      if (state.farmerProducts.length > 0) {
        newState.farmerProducts[0].name += " (Edited)";
        showNotification("First product edited!", "info");
      }
      newState.currentMenu = "farmerProducts";
      setState(newState);
      return;
    }
    // Delete Product
    if (state.currentMenu === "deleteProduct") {
      if (state.farmerProducts.length > 0) {
        newState.farmerProducts.pop();
        showNotification("Last product deleted!", "danger");
      }
      newState.currentMenu = "farmerProducts";
      setState(newState);
      return;
    }
    // Farmer Orders
    if (state.currentMenu === "farmerOrders") {
      if (input === "0") newState.currentMenu = "farmer";
      else if (input === "00") newState.currentMenu = "main";
      setState(newState);
      return;
    }
    // Sales Analytics
    if (state.currentMenu === "salesAnalytics") {
      if (input === "0") newState.currentMenu = "farmer";
      else if (input === "00") newState.currentMenu = "main";
      setState(newState);
      return;
    }
    // Payment Settings
    if (state.currentMenu === "paymentSettings") {
      if (input === "0") newState.currentMenu = "farmer";
      else if (input === "00") newState.currentMenu = "main";
      setState(newState);
      return;
    }
    // Account Balance
    if (state.currentMenu === "accountBalance") {
      if (input === "1") {
        showNotification("Payout requested!", "success");
      } else if (input === "2") {
        showNotification("Transaction history shown.", "info");
      } else if (input === "0") newState.currentMenu = "farmer";
      else if (input === "00") newState.currentMenu = "main";
      setState(newState);
      return;
    }
    // Default: invalid input
    showNotification("Invalid option. Please try again.", "danger");
  }

  // Header text
  const getHeader = () => {
    if (state.userType) return `Farm2City (${state.userType})`;
    if (state.currentMenu === "productDetail" && state.currentProduct) return state.currentProduct.name;
    return "Farm2City";
  };

  // Styling
  useEffect(() => {
    inputRef.current?.focus();
  }, [state.currentMenu]);

  return (
    <>
      <style>{`
        :root { --primary: #2ecc71; --secondary: #27ae60; --accent: #e67e22; --dark: #2c3e50; --light: #ecf0f1; --text: #333; --gray: #757575; --warning: #f39c12; --danger: #e74c3c; }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Courier New', monospace; }
        body, #ussd-root { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') no-repeat center center fixed; background-size: cover; position: relative; }
        body::before, #ussd-root::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(46, 204, 113, 0.1); z-index: -1; }
        .container { display: flex; gap: 40px; max-width: 1200px; margin: 20px; align-items: center; }
        .instructions { background: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 400px; }
        .instructions h2 { color: var(--primary); margin-bottom: 15px; border-bottom: 2px solid var(--primary); padding-bottom: 8px; }
        .instructions p { margin-bottom: 15px; line-height: 1.6; }
        .instructions ol { padding-left: 20px; margin-bottom: 20px; }
        .instructions li { margin-bottom: 8px; }
        .phone-container { position: relative; width: 320px; height: 650px; perspective: 1000px; }
        .phone { width: 100%; height: 100%; background: #111; border-radius: 35px; padding: 25px; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 0 8px #333, 0 0 0 12px #555; transform-style: preserve-3d; transform: rotateY(0deg); transition: transform 0.5s ease; }
        .phone:hover { transform: rotateY(5deg); }
        .screen { background: #000; height: 100%; border-radius: 15px; padding: 15px; color: #fff; overflow: hidden; display: flex; flex-direction: column; position: relative; }
        .header { color: var(--primary); border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 10px; font-weight: bold; text-align: center; }
        .ussd-display { flex: 1; overflow-y: auto; margin-bottom: 10px; font-size: 14px; line-height: 1.5; white-space: pre-wrap; }
        .input-area { display: flex; height: 40px; align-items: center; background: #111; border-top: 1px solid #333; padding-top: 10px; }
        .input-area input { flex: 1; background: #222; border: 1px solid #333; color: white; padding: 8px 12px; font-family: 'Courier New', monospace; border-radius: 4px; outline: none; }
        .input-area button { background: var(--primary); color: white; border: none; padding: 8px 15px; margin-left: 8px; border-radius: 4px; cursor: pointer; font-weight: bold; transition: all 0.2s; }
        .input-area button:active { transform: scale(0.95); background: var(--secondary); }
        .keypad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px; }
        .key { background: #333; color: white; border-radius: 5px; display: flex; justify-content: center; align-items: center; height: 45px; font-size: 18px; cursor: pointer; user-select: none; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
        .key:active { background: #555; transform: translateY(2px); }
        .key.primary { background: var(--primary); }
        .key.secondary { background: var(--accent); }
        .key.danger { background: var(--danger); }
        .notification { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 15px 20px; border-radius: 8px; z-index: 100; text-align: center; display: block; }
        .notification:not(.visible) { display: none; }
        .phone-notch { position: absolute; top: 15px; left: 50%; transform: translateX(-50%); width: 120px; height: 20px; background: #111; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px; z-index: 10; }
        .phone-speaker { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); width: 60px; height: 5px; background: #222; border-radius: 5px; }
        .phone-power { position: absolute; right: -5px; top: 100px; width: 5px; height: 60px; background: #333; border-top-right-radius: 5px; border-bottom-right-radius: 5px; }
        .phone-vol-up { position: absolute; right: -5px; top: 180px; width: 5px; height: 40px; background: #333; border-top-right-radius: 5px; border-bottom-right-radius: 5px; }
        .phone-vol-down { position: absolute; right: -5px; top: 240px; width: 5px; height: 40px; background: #333; border-top-right-radius: 5px; border-bottom-right-radius: 5px; }
        .phone-home { position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); width: 120px; height: 5px; background: #333; border-radius: 5px; }
        @media (max-width: 900px) { .container { flex-direction: column; padding: 20px; } .instructions { max-width: 100%; order: 2; } .phone-container { order: 1; } }
      `}</style>
      <div id="ussd-root" className="container">
        <div className="phone-container">
          <div className="phone">
            <div className="phone-notch"></div>
            <div className="phone-speaker"></div>
            <div className="phone-power"></div>
            <div className="phone-vol-up"></div>
            <div className="phone-vol-down"></div>
            <div className="phone-home"></div>
            <div className="screen">
              <div className="header">{getHeader()}</div>
              <div className="ussd-display">{getMenuText(state, menus, state.currentCategory)}</div>
              <div className="input-area">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="Enter option..."
                  autoFocus
                />
                <button onClick={handleSend}>SEND</button>
              </div>
              <div className="keypad">
                {KEYS.map((key, i) => (
                  <div
                    key={key}
                    className={`key${key === '*' ? ' secondary' : key === '#' ? ' primary' : ''}`}
                    onClick={() => pressKey(key)}
                  >{key}</div>
                ))}
              </div>
              {notification.visible && (
                <div className={`notification ${notification.type}`}>{notification.message}</div>
              )}
            </div>
          </div>
        </div>
        <Instructions />
      </div>
      <div style={{display:'flex',justifyContent:'center',marginTop:18}}>
        <button
          style={{background:'var(--danger)',color:'#fff',fontWeight:'bold',fontSize:'1.1rem',border:'none',borderRadius:8,padding:'12px 32px',cursor:'pointer'}}
          onClick={() => navigate("/")}
        >Exit USSD Service</button>
      </div>
    </>
  );
};

export default UssdPage;
