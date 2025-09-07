import { createContext, useContext, useState, ReactNode } from "react";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  farmer: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  orderDate: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  farmer: string;
  address: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "status">) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (order: Omit<Order, "status">) => {
    setOrders(prev => [
      { ...order, status: "pending" },
      ...prev,
    ]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within an OrderProvider");
  return context;
}
