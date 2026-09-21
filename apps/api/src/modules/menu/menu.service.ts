import { prisma } from '../../plugins/prisma.js';
import { DEFAULT_OOTA_COMPONENTS, BASE_OOTA_PRICE } from '@uttara/shared';

export class MenuService {
  static async getTodayMenu(outletId?: string) {
    const todayStr = new Date().toISOString().split('T')[0];

    // Check if outlet has an override, otherwise get global daily menu
    let dailyMenu = null;
    if (outletId) {
      dailyMenu = await prisma.dailyMenu.findFirst({
        where: { outletId, date: todayStr, isAvailable: true },
      });
    }

    if (!dailyMenu) {
      dailyMenu = await prisma.dailyMenu.findFirst({
        where: { date: todayStr, isAvailable: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    // If no record for today, take latest available daily menu
    if (!dailyMenu) {
      dailyMenu = await prisma.dailyMenu.findFirst({
        where: { isAvailable: true },
        orderBy: { date: 'desc' },
      });
    }

    const coreItem = await prisma.menuItem.findFirst({
      where: { isDefaultOota: true, isActive: true },
    });

    const price = dailyMenu?.overridePrice ?? coreItem?.basePrice ?? BASE_OOTA_PRICE;

    // Components with rotating palya names populated
    const components = DEFAULT_OOTA_COMPONENTS.map((comp) => {
      if (comp.id === 'palya_1' && dailyMenu?.palya1Name) {
        return {
          ...comp,
          name: dailyMenu.palya1Name,
          kannadaName: dailyMenu.palya1KannadaName || comp.kannadaName,
          description: dailyMenu.palya1Description,
        };
      }
      if (comp.id === 'palya_2' && dailyMenu?.palya2Name) {
        return {
          ...comp,
          name: dailyMenu.palya2Name,
          kannadaName: dailyMenu.palya2KannadaName || comp.kannadaName,
          description: dailyMenu.palya2Description,
        };
      }
      return comp;
    });

    return {
      menuItemId: coreItem?.id,
      title: 'North Karnataka Oota',
      kannadaTitle: 'ಉತ್ತರ ಕರ್ನಾಟಕ ಊಟ',
      date: dailyMenu?.date || todayStr,
      price,
      isAvailable: dailyMenu?.isAvailable ?? true,
      palya1: {
        name: dailyMenu?.palya1Name || 'Yennegayi Badanekayi',
        kannadaName: dailyMenu?.palya1KannadaName || 'ಎಣ್ಣೆಗಾಯಿ ಬದನೆಕಾಯಿ',
        description: dailyMenu?.palya1Description || 'Tender stuffed baby brinjals in rich peanut-sesame masala.',
      },
      palya2: {
        name: dailyMenu?.palya2Name || 'Hesaru Kalu Usli',
        kannadaName: dailyMenu?.palya2KannadaName || 'ಹೆಸರು ಕಾಳು ಉಸ್ಲಿ',
        description: dailyMenu?.palya2Description || 'Sprouted moong beans tempered with mustard and coconut.',
      },
      specialItem: dailyMenu?.specialItem,
      components,
      dietary: {
        isVegetarian: true,
        isSattvicOptionAvailable: true,
        allergens: ['Peanuts', 'Sesame', 'Gluten', 'Dairy'],
        caloriesEstimate: 620,
      },
    };
  }
}
