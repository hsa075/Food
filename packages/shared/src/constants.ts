import { OotaComponent } from './types/menu.js';

export const BRAND_NAME = 'Uttara';
export const BRAND_TAGLINE = 'Simple Oota. North Karnataka Soul.';
export const BRAND_HEADLINE = 'Simple Oota. North Karnataka Soul.';
export const BRAND_SUBTITLE = 'Jolada rotti, palya, rice, sambar and the flavours of home — served simply.';

export const BASE_OOTA_PRICE = 139; // INR
export const PACKAGING_FEE = 15; // INR
export const GST_RATE = 0.05; // 5% GST

export const DEFAULT_OOTA_COMPONENTS: OotaComponent[] = [
  {
    id: 'rotti',
    name: 'Jolada Rotti / Chapati',
    kannadaName: 'ಜೋಳದ ರೊಟ್ಟಿ',
    description: 'Freshly patted thin sorghum rottis, flame-toasted to soft perfection.',
    quantityDescription: '3 Rotti / Chapati',
    isRotating: false,
    allergens: ['Gluten (Chapati only)']
  },
  {
    id: 'palya_1',
    name: 'Yennegayi Badanekayi Palya',
    kannadaName: 'ಎಣ್ಣೆಗಾಯಿ ಬದನೆಕಾಯಿ',
    description: 'Tender baby brinjals stuffed with peanut, sesame, and roasted Deccan spices.',
    quantityDescription: '1 Portion',
    isRotating: true,
    allergens: ['Peanuts', 'Sesame']
  },
  {
    id: 'palya_2',
    name: 'Hesaru Kalu Usli',
    kannadaName: 'ಹೆಸರು ಕಾಳು ಉಸ್ಲಿ',
    description: 'Sprouted green gram tempered with mustard seeds, curry leaves, and freshly grated coconut.',
    quantityDescription: '1 Portion',
    isRotating: true,
    allergens: ['Coconut']
  },
  {
    id: 'rice',
    name: 'Steamed Sona Masoori Rice',
    kannadaName: 'ಅನ್ನ',
    description: 'Steamed fragrant aged rice.',
    quantityDescription: '1 Cup',
    isRotating: false
  },
  {
    id: 'sambar',
    name: 'North Karnataka Bele Saaru',
    kannadaName: 'ತೊವ್ವೆ / ಬೇಳೆ ಸಾರು',
    description: 'Slow-simmered toor dal with byadgi chilli aroma and tamarind tang.',
    quantityDescription: '1 Bowl',
    isRotating: false
  },
  {
    id: 'chutney_pudi',
    name: 'Shenga & Agasi Chutney Pudi',
    kannadaName: 'ಶೇಂಗಾ & ಅಗಸಿ ಚಟ್ನಿ ಪುಡಿ',
    description: 'Stone-ground roasted peanut chutney powder & flaxseed powder with fresh curd or dollop of butter.',
    quantityDescription: '2 Accompaniments',
    isRotating: false,
    allergens: ['Peanuts']
  },
  {
    id: 'curd',
    name: 'Fresh Mosaru',
    kannadaName: 'ತಾಜಾ ಮೊಸರು',
    description: 'Freshly set earthen curd to cool the palate.',
    quantityDescription: '1 Cup',
    isRotating: false,
    allergens: ['Dairy']
  }
];

export const POINTS_PER_RUPEE = 1; // 1 point per ₹10 spent
export const REDEEM_THRESHOLD_POINTS = 300; // Free Oota at 300 points
