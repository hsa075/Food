import { prisma } from '../../plugins/prisma.js';

// Haversine formula to calculate distance between two coordinates in kilometers
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export class OutletsService {
  static async listOutlets(userLat?: number, userLng?: number, search?: string) {
    const outlets = await prisma.outlet.findMany({
      where: {
        isActive: true,
        ...(search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { locality: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
          ]
        } : {})
      },
      orderBy: { locality: 'asc' },
    });

    const now = new Date();
    // Bengaluru is IST (UTC + 5:30)
    const istTimeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    const mapped = outlets.map((o) => {
      const distance = (userLat !== undefined && userLng !== undefined)
        ? calculateDistanceKm(userLat, userLng, o.latitude, o.longitude)
        : undefined;

      const isWithinHours = istTimeStr >= o.opensAt && istTimeStr <= o.closesAt;
      const isOpenNow = isWithinHours && o.currentStatus !== 'CLOSED';

      return {
        ...o,
        distanceKm: distance,
        isOpenNow,
      };
    });

    if (userLat !== undefined && userLng !== undefined) {
      mapped.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    }

    return mapped;
  }

  static async getOutlet(idOrSlug: string) {
    const outlet = await prisma.outlet.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
      },
      include: {
        dailyMenus: {
          take: 1,
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!outlet) {
      throw new Error('Outlet not found');
    }

    const now = new Date();
    const istTimeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    const isWithinHours = istTimeStr >= outlet.opensAt && istTimeStr <= outlet.closesAt;
    const isOpenNow = isWithinHours && outlet.currentStatus !== 'CLOSED';

    return {
      ...outlet,
      isOpenNow,
    };
  }
}
