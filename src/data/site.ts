// All business content lives here. Edit this file to change numbers, prices or addresses.

export const site = {
  name: "EcoSpin Dry-Cleaners",
  shortName: "EcoSpin",
  tagline: "Shine Naturally",
  url: "https://www.ecospin.co.in",
  description:
    "EcoSpin Dry-Cleaners — dry cleaning, laundry, steam pressing, carpet & curtain cleaning with free pickup and delivery in Thane, Mulund and Kharghar (Navi Mumbai).",
  areasServed: ["Thane", "Mulund", "Kharghar", "Navi Mumbai"],
};

export type Store = {
  slug: "thane" | "kharghar";
  name: string;
  area: string;
  address: string[];
  call: string; // 10-digit Indian mobile
  whatsapp: string;
  closedOn: string;
  hours: string | null; // null = not confirmed yet
  turnaround: string;
  mapQuery: string;
};

export const stores: Store[] = [
  {
    slug: "thane",
    name: "Thane Store",
    area: "Thane (W)",
    address: ["Shop No. 20, Dev Darshan Bldg.", "Dongari Pada, G B Road", "Thane (W) – 400615"],
    call: "8657422055",
    whatsapp: "8657422055",
    closedOn: "Friday",
    hours: null,
    turnaround: "5 working days",
    mapQuery: "EcoSpin Dry Cleaners, Dev Darshan Building, Dongari Pada, G B Road, Thane West 400615",
  },
  {
    slug: "kharghar",
    name: "Kharghar Store",
    area: "Kharghar, Navi Mumbai",
    address: ["Shop No. 19, Green Heritage CHS.", "Plot No. 79/80, Sector 20", "Kharghar, Navi Mumbai – 410210"],
    call: "8657422155",
    whatsapp: "8657422355",
    closedOn: "Friday",
    hours: "9:00 am – 9:00 pm",
    turnaround: "4 working days",
    mapQuery: "Green Heritage CHS, Plot 79/80, Sector 20, Kharghar, Navi Mumbai 410210",
  },
];

export const formatPhone = (n: string) => `${n.slice(0, 4)} ${n.slice(4, 6)} ${n.slice(6, 8)} ${n.slice(8)}`;
export const telHref = (n: string) => `tel:+91${n}`;
export const waHref = (n: string, text?: string) =>
  `https://wa.me/91${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const mapsHref = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
export const mapsEmbed = (q: string) => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;

/* ---------- Services ---------- */

export type Service = {
  slug: string;
  title: string;
  summary: string;
  detail: string;
  covers: string[];
};

export const services: Service[] = [
  {
    slug: "dry-cleaning",
    title: "Dry cleaning",
    summary: "European machines and German solvents for suits, silks and anything that says “dry clean only”.",
    detail:
      "Every garment is cleaned on European-technology equipment using German solvents, by operators trained to European laundry standards. We read the brand’s care label and the fabric before choosing a process, so delicate and expensive pieces are treated the way their makers intended.",
    covers: ["Suits, blazers & coats", "Silk sarees & dupattas", "Leather & rider jackets", "Party wear & gowns"],
  },
  {
    slug: "laundry",
    title: "Laundry & wet cleaning",
    summary: "American machines, treated water and eco-friendly detergents for everyday and branded wear.",
    detail:
      "Hi-tech American machines run on treated water with eco-friendly detergents, softeners and brighteners, managed by experienced domain experts. It’s the gentler choice for branded and expensive fabrics that can be washed but deserve more care than a home machine gives them.",
    covers: ["Shirts, T-shirts & trousers", "Kids’ clothes", "Bed sheets & towels", "Machine-load wash"],
  },
  {
    slug: "steam-pressing",
    title: "Steam pressing",
    summary: "Crisp, wrinkle-free finishing with professional steam — no shine marks, no scorching.",
    detail:
      "Steam pressing on its own, for clothes that are clean but need a sharp finish. Professional steam relaxes the fibres instead of flattening them, so collars, pleats and creases come back crisp without the shine a hot iron leaves.",
    covers: ["Office wear", "Sarees & kurtas", "Sherwanis", "Trousers with creases"],
  },
  {
    slug: "ethnic-bridal",
    title: "Bridal & ethnic wear",
    summary: "Safe, gentle cleaning for lehengas, sherwanis and wedding outfits you want to keep for years.",
    detail:
      "Ornamental lehengas, designer sherwanis, embroidered sarees and wedding dresses get individual handling — stain treatment by hand, the right solvent for the embellishment, and careful pressing so zari, sequins and stonework stay intact.",
    covers: ["Lehengas", "Designer sherwanis", "Ornamental sarees", "Wedding dresses"],
  },
  {
    slug: "home-furnishings",
    title: "Curtains, carpets & bedding",
    summary: "Curtains, carpets, blankets, quilts and sofa covers — plus sofa cleaning at your home.",
    detail:
      "Your curtains are holding more than just dust. We clean sheer and heavy curtain panels, cotton carpets (also by the square foot), blankets, quilts, duvets and bed spreads. Sofa cleaning is done at your home for 1, 2 and 3-seater sofas.",
    covers: ["Curtains", "Carpets & foot mats", "Blankets, quilts & duvets", "Sofa cleaning at home"],
  },
  {
    slug: "shoes-toys-bags",
    title: "Shoes, soft toys & bags",
    summary: "From sneakers to teddy bears — the things that are hard to wash at home.",
    detail:
      "From laces to soles, we wash the whole shoe. Soft toys are cleaned gently and dried thoroughly so they stay soft and safe for children. Bags, caps, hats and gloves are cleaned too.",
    covers: ["Shoes & sneakers", "Soft toys", "Bags", "Caps, hats & gloves"],
  },
];

export const strengths = [
  { title: "Treated water", text: "Soft, treated water protects colours and fibres wash after wash." },
  { title: "European practices", text: "Standard operating procedures in line with European laundry standards." },
  { title: "German chemicals", text: "Quality solvents and eco-friendly detergents, chosen per fabric." },
  { title: "European & American machines", text: "Commercial-grade equipment built for professional laundries." },
  { title: "Trained, experienced staff", text: "A team with experience in India and abroad, including five-star hotel laundries." },
  { title: "Dust-proof workspace", text: "Clothes are processed in a clean, dust-proof environment." },
  { title: "DLI, USA member", text: "International membership of the Drycleaning & Laundry Institute." },
];

export const processSteps = [
  "View, pickup / receive",
  "First QC check",
  "System entry",
  "Tagging",
  "Classification",
  "Stain removal & pre-wash treatment",
  "Automatic machine cleaning",
  "Second QC check",
  "Finishing & steam pressing",
  "Final QC check",
  "Packaging",
  "Delivery / collect",
];

/* ---------- Price list (same at both stores) ---------- */

export type PriceRow = { item: string; dc: number | null; press?: number | null };
export type PriceCategory = { slug: string; title: string; columns: "dc+press" | "price"; rows: PriceRow[] };

export const priceList: PriceCategory[] = [
  {
    slug: "gentlemen",
    title: "Gentlemen",
    columns: "dc+press",
    rows: [
      { item: "Shirt / T-shirt", dc: 140, press: 45 },
      { item: "Payjama / Trouser / Shorts", dc: 170, press: 60 },
      { item: "Kurta", dc: 190, press: 60 },
      { item: "Jeans / Track Pant / Capri", dc: 190, press: 60 },
      { item: "Coat / Blazer", dc: 390, press: 160 },
      { item: "Jacket", dc: 390, press: 160 },
      { item: "Leather Jacket", dc: 1100, press: null },
      { item: "Rider Jacket", dc: 1100, press: 300 },
      { item: "Tie", dc: 100, press: 45 },
      { item: "Overcoat", dc: 560, press: 200 },
      { item: "Long Coat", dc: 750, press: 270 },
      { item: "Waist Coat", dc: 290, press: 110 },
      { item: "Sherwani (Designer)", dc: 650, press: 220 },
      { item: "Sherwani Ornamental", dc: 850, press: 350 },
      { item: "Dhoti", dc: 290, press: 60 },
      { item: "Pullover", dc: 360, press: 110 },
      { item: "Sweater", dc: 360, press: 110 },
    ],
  },
  {
    slug: "ladies",
    title: "Ladies",
    columns: "dc+press",
    rows: [
      { item: "Shirt / T-shirt / Top / Blouse / Scarf", dc: 140, press: 45 },
      { item: "Short Kameez", dc: 140, press: 45 },
      { item: "Saree", dc: 370, press: 125 },
      { item: "Silk Saree", dc: 400, press: 150 },
      { item: "Salwar / Slacks / Short Skirts", dc: 140, press: 45 },
      { item: "Palazzo", dc: 280, press: 60 },
      { item: "Long Kameez", dc: 280, press: 60 },
      { item: "Ornamental Kameez", dc: 320, press: 90 },
      { item: "Long Skirt", dc: 280, press: 60 },
      { item: "Heavy Long Skirt", dc: 420, press: 100 },
      { item: "Lehanga Light", dc: 380, press: 100 },
      { item: "Ornamental Lehanga", dc: 550, press: 150 },
      { item: "Dress / Frock – Normal", dc: 350, press: 150 },
      { item: "Ornamental Scarf", dc: 180, press: 60 },
      { item: "Saree Ornamental", dc: 490, press: 175 },
      { item: "Wedding Dress – Medium", dc: 850, press: 200 },
      { item: "Cardigan", dc: 400, press: 150 },
      { item: "Party Wear", dc: 1200, press: 300 },
      { item: "Shawl", dc: 200, press: 60 },
    ],
  },
  {
    slug: "household",
    title: "Household",
    columns: "price",
    rows: [
      { item: "Sheer Curtain Panel (3×6 ft max)", dc: 180 },
      { item: "Heavy Curtain Panel (3×6 ft max)", dc: 260 },
      { item: "Bed Sheet – Single", dc: 200 },
      { item: "Bed Sheet – Double", dc: 280 },
      { item: "Pillow Covers", dc: 90 },
      { item: "Handkerchief", dc: 50 },
      { item: "Hand Towel", dc: 50 },
      { item: "Bath Towel", dc: 140 },
      { item: "Blanket Single", dc: 330 },
      { item: "Blanket Double", dc: 460 },
      { item: "Quilt / Duvet Single", dc: 460 },
      { item: "Quilt / Duvet Double", dc: 550 },
      { item: "Bed Spread Single", dc: 360 },
      { item: "Bed Spread Double", dc: 460 },
      { item: "Table Cloth Medium", dc: 220 },
      { item: "Table Cloth Large", dc: 320 },
      { item: "Stuff Toy (Small)", dc: 210 },
      { item: "Stuff Toy (Medium)", dc: 410 },
      { item: "Hat", dc: 140 },
      { item: "Cap", dc: 90 },
      { item: "Socks Pair", dc: 90 },
      { item: "Car Seat Cover – Single Seat", dc: 310 },
      { item: "Sofa Cushion Cover – Single Seat", dc: 310 },
      { item: "1 Seater Sofa @home (min ₹800)", dc: 700 },
      { item: "2 Seater Sofa @home (min ₹1,000)", dc: 1200 },
      { item: "3 Seater Sofa @home", dc: 2800 },
      { item: "Cotton Carpet (Single)", dc: 360 },
      { item: "Carpet – per sq. ft", dc: 48 },
      { item: "Foot Mat", dc: 140 },
      { item: "Load Medium", dc: 280 },
      { item: "Bag – Medium (2 cubic ft)", dc: 360 },
      { item: "Hand Gloves – Pair", dc: 160 },
      { item: "Muffler", dc: 180 },
      { item: "Shoes", dc: 400 },
    ],
  },
];

export const priceNotes = [
  "Free pickup on orders of at least 7 garments or a ₹700 bill.",
  "Minimum 7 garments or a ₹1,000 bill for dry cleaning.",
  "Express delivery: same day at 100% extra, next day at 50% extra.",
  "Kids’ clothes (up to 10 years) are charged at about 70% of the adult price.",
  "Any garment not listed is charged in proportion to a similar listed item.",
  "Regular turnaround: Thane 5 working days, Kharghar 4 working days.",
  "Clothes come folded as standard. Packing on hangers is charged extra.",
  "Refer a friend and get an extra discount — ask at the store.",
];

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
