const PRODUCT_KEY = "inventory_products_v1";
const ORDER_KEY = "inventory_orders_v1";
const BUYER_KEY = "inventory_buyers_v1";
const COMPANY_KEY = "inventory_company";

const defaultCompany = {
  logo: "",
  name: "Your Company Name",
  phone: "",
  address: "",
  fax: "",
};

export function readProducts() {
  return JSON.parse(localStorage.getItem(PRODUCT_KEY) || "[]");
}

export function saveProducts(products) {
  localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
}

export function readOrders() {
  return JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
}

export function saveOrders(orders) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
}

export function readBuyers() {
  return JSON.parse(localStorage.getItem(BUYER_KEY) || "[]");
}

export function saveBuyers(buyers) {
  localStorage.setItem(BUYER_KEY, JSON.stringify(buyers));
}


export function readCompany() {
  const data = localStorage.getItem(COMPANY_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveCompany(company) {
  localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
}

export function seedIfEmpty() {
  if (readProducts().length === 0) {
    saveProducts([
      {
        id: crypto.randomUUID(),
        name: "Wireless Mouse",
        number: "P-1001",
        category: "Accessories",
        quantity: 120,
        inStock: 95,
        defected: 3,
        price: 25,
        salePrice: 22,
        discountEnabled: true
      },
      {
        id: crypto.randomUUID(),
        name: "Mechanical Keyboard",
        number: "P-1002",
        category: "Accessories",
        quantity: 80,
        inStock: 60,
        defected: 2,
        price: 85,
        salePrice: 79,
        discountEnabled: true
      },
      {
        id: crypto.randomUUID(),
        name: "27 inch Monitor",
        number: "P-1003",
        category: "Display",
        quantity: 40,
        inStock: 28,
        defected: 1,
        price: 240,
        salePrice: 219,
        discountEnabled: true
      }
    ]);
  }

  if (readBuyers().length === 0) {
    saveBuyers([
      {
        id: crypto.randomUUID(),
        buyerId: "B-001",
        name: "Alice Wong",
        companyName: "Alpha Trading",
        phone: "123-456-7890",
        address: "1 Main Street",
        email: "alice@example.com",
        fax: "123-456-7000"
      }
    ]);
  }

  if (!localStorage.getItem(COMPANY_KEY)) {
    saveCompany(defaultCompany);
  }
}