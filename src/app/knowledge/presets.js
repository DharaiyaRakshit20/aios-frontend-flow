export const PRESETS = {
  retail: {
    label: "Retail / Shop",
    itemWord: "Product",
    categoryHint: "Womens Wear, Mens Wear, Kids",
    trackStock: true,
    examples: [
      { name: "Cotton Kurti", category: "Womens Wear", price: 899, stock: 12, sizes: "S, M, L, XL", colors: "red, blue, black", description: "Pure cotton, daily wear" },
      { name: "Silk Saree", category: "Sarees", price: 2499, stock: 0, sizes: "", colors: "green, maroon", description: "Banarasi silk with zari border" },
    ],
    profile: {
      about: "We are a family-run clothing store in Surat, selling ethnic and casual wear for the whole family since 2010.",
      hours: "Mon-Sat 10:00 AM - 9:00 PM, Sunday closed",
      delivery_info: "Free home delivery within Surat on orders above ₹1000. Outside Surat via courier, 3-5 days, ₹80 charges.",
      return_policy: "7-day exchange with bill. No returns on sale items. Item must be unused with tags.",
      payment_methods: "UPI, Cash, Card, Paytm",
    },
  },
  fintech: {
    label: "Fintech / Financial services",
    itemWord: "Service / Plan",
    categoryHint: "Loans, Insurance, Investments",
    trackStock: false,
    examples: [
      { name: "Personal Loan", category: "Loans", priceText: "10.5% - 16% p.a.", description: "₹50,000 to ₹10 lakh. Tenure 12-60 months. Processing fee 2%. Needs salary slip, PAN, Aadhaar." },
      { name: "Term Insurance Plan", category: "Insurance", priceText: "From ₹499/month", description: "Cover up to ₹1 crore. Age 18-60. Medical check for cover above ₹50 lakh." },
    ],
    profile: {
      about: "We are a licensed financial services provider helping salaried individuals and small businesses with loans, insurance and investment planning.",
      hours: "Mon-Fri 9:30 AM - 6:30 PM, Sat 10 AM - 2 PM",
      delivery_info: "Fully online process. Documents via app or WhatsApp. Loan approval in 24-48 hours after documents.",
      return_policy: "Insurance policies have a 15-day free-look period. Loan foreclosure allowed after 6 EMIs with 2% charges.",
      payment_methods: "NEFT, UPI, Auto-debit (NACH)",
    },
  },
  services: {
    label: "Services (salon, clinic, repair, agency)",
    itemWord: "Service",
    categoryHint: "Hair, Skin, Consultation",
    trackStock: false,
    examples: [
      { name: "Hair Cut & Styling", category: "Hair", priceText: "₹300 - ₹800", description: "Takes about 45 minutes. Walk-in or appointment." },
      { name: "Full Body Massage", category: "Spa", priceText: "₹1200", description: "60 minutes. Appointment required, book one day ahead." },
    ],
    profile: {
      about: "A neighbourhood salon offering hair, skin and spa services with trained professionals.",
      hours: "Tue-Sun 10:00 AM - 8:00 PM, Monday closed",
      delivery_info: "Home service available within 5 km, ₹200 extra.",
      return_policy: "If you are not satisfied with a service, tell us within 24 hours and we will redo it free.",
      payment_methods: "UPI, Cash, Card",
    },
  },
  food: {
    label: "Restaurant / Food",
    itemWord: "Menu item",
    categoryHint: "Starters, Main Course, Desserts",
    trackStock: false,
    examples: [
      { name: "Paneer Butter Masala", category: "Main Course", priceText: "₹280", description: "Serves 1-2. Half plate ₹160. Jain option available." },
      { name: "Gulab Jamun (2 pcs)", category: "Desserts", priceText: "₹80", description: "Served warm." },
    ],
    profile: {
      about: "Pure vegetarian family restaurant serving North Indian and Gujarati food.",
      hours: "Daily 11:00 AM - 3:30 PM and 7:00 PM - 11:00 PM",
      delivery_info: "Delivery within 6 km. Free above ₹500, else ₹40. Also on Swiggy and Zomato.",
      return_policy: "If the order is wrong or cold, call us within 30 minutes for a replacement.",
      payment_methods: "UPI, Cash on delivery, Card",
    },
  },
};
