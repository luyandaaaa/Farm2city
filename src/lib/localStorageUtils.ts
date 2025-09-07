// src/lib/localStorageUtils.ts

export const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

// User management
export const registerUser = (user: { username: string; password: string; role: string; [key: string]: any }) => {
  const users = getFromLocalStorage('users') || [];
  users.push(user);
  saveToLocalStorage('users', users);
};

export const findUser = (username: string, password: string) => {
  const users = getFromLocalStorage('users') || [];
  return users.find((u: any) => u.username === username && u.password === password);
};

export const getUserByUsername = (username: string) => {
  const users = getFromLocalStorage('users') || [];
  return users.find((u: any) => u.username === username);
};

// Consumer profile
export const saveUserProfile = (username: string, profile: any) => {
  const users = getFromLocalStorage('users') || [];
  const idx = users.findIndex((u: any) => u.username === username);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...profile };
    saveToLocalStorage('users', users);
  }
};

export const getUserProfile = (username: string) => {
  return getUserByUsername(username);
};

// Order management
export const saveOrder = (order: any) => {
  const orders = getFromLocalStorage('orders') || [];
  orders.push(order);
  saveToLocalStorage('orders', orders);
};

export const updateOrderStatus = (orderId: string, status: string) => {
  const orders = getFromLocalStorage('orders') || [];
  const idx = orders.findIndex((o: any) => o.id === orderId);
  if (idx !== -1) {
    orders[idx].status = status;
    saveToLocalStorage('orders', orders);
  }
};

export const updateOrderDriver = (orderId: string, driver: any, address: string) => {
  const orders = getFromLocalStorage('orders') || [];
  const idx = orders.findIndex((o: any) => o.id === orderId);
  if (idx !== -1) {
    orders[idx].driver = driver;
    orders[idx].deliveryAddress = address;
    orders[idx].status = 'shipped';
    saveToLocalStorage('orders', orders);
  }
};

export const getOrdersByUser = (username: string, role: string) => {
  const orders = getFromLocalStorage('orders') || [];
  if (role === 'consumer') {
    return orders.filter((o: any) => o.consumer === username);
  } else if (role === 'farmer') {
    return orders.filter((o: any) => o.farmer === username);
  }
  return [];
};

export const getOrderById = (orderId: string) => {
  const orders = getFromLocalStorage('orders') || [];
  return orders.find((o: any) => o.id === orderId);
};

// Returns & Disputes
export const saveReturn = (returnObj: any) => {
  const returns = getFromLocalStorage('returns') || [];
  returns.push(returnObj);
  saveToLocalStorage('returns', returns);
};

export const getReturnsByUser = (username: string) => {
  const returns = getFromLocalStorage('returns') || [];
  return returns.filter((r: any) => r.username === username);
};

export const saveDispute = (disputeObj: any) => {
  const disputes = getFromLocalStorage('disputes') || [];
  disputes.push(disputeObj);
  saveToLocalStorage('disputes', disputes);
};

export const getDisputesByUser = (username: string) => {
  const disputes = getFromLocalStorage('disputes') || [];
  return disputes.filter((d: any) => d.username === username);
};

// Community posts
export const saveCommunityPost = (post: any) => {
  const posts = getFromLocalStorage('communityPosts') || [];
  posts.push(post);
  saveToLocalStorage('communityPosts', posts);
};

export const getCommunityPosts = () => {
  return getFromLocalStorage('communityPosts') || [];
};

// Farm rewards
export const saveFarmRewards = (username: string, rewards: any) => {
  const allRewards = getFromLocalStorage('farmRewards') || {};
  allRewards[username] = rewards;
  saveToLocalStorage('farmRewards', allRewards);
};

export const getFarmRewards = (username: string) => {
  const allRewards = getFromLocalStorage('farmRewards') || {};
  return allRewards[username] || null;
};

// Crop analysis history
export const saveCropScan = (username: string, scan: any) => {
  const allScans = getFromLocalStorage('cropScans') || {};
  if (!allScans[username]) allScans[username] = [];
  allScans[username].push(scan);
  saveToLocalStorage('cropScans', allScans);
};

export const getCropScans = (username: string) => {
  const allScans = getFromLocalStorage('cropScans') || {};
  return allScans[username] || [];
};

// Farmer products
export const saveFarmerProduct = (username: string, product: any) => {
  const allProducts = getFromLocalStorage('farmerProducts') || {};
  if (!allProducts[username]) allProducts[username] = [];
  allProducts[username].push(product);
  saveToLocalStorage('farmerProducts', allProducts);
};

export const getAllFarmerProducts = () => {
  const allProducts = getFromLocalStorage('farmerProducts') || {};
  // Flatten all products into a single array
  return Object.values(allProducts).flat();
};

export const getFarmerProducts = (username: string) => {
  const allProducts = getFromLocalStorage('farmerProducts') || {};
  return allProducts[username] || [];
};

// Dispute/Return status update (admin)
export const updateDisputeStatus = (disputeId: string, status: string) => {
  const disputes = getFromLocalStorage('disputes') || [];
  const idx = disputes.findIndex((d: any) => d.id === disputeId);
  if (idx !== -1) {
    disputes[idx].status = status;
    saveToLocalStorage('disputes', disputes);
  }
};

export const getAllDisputes = () => {
  return getFromLocalStorage('disputes') || [];
};

export const getAllReturns = () => {
  return getFromLocalStorage('returns') || [];
};
