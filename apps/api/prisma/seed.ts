import { PrismaClient, Role, OutletStatus, OrderStatus, OrderType, PaymentProvider, PaymentStatus, DiscountType, ProductionStatus, DispatchStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Uttara database seed...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.kitchenOutletDispatch.deleteMany();
  await prisma.kitchenProduction.deleteMany();
  await prisma.loyaltyTransaction.deleteMany();
  await prisma.loyaltyAccount.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.dailyMenu.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.staffOutlet.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.outlet.deleteMany();

  // 1. Create Outlets across Bengaluru
  const outletsData = [
    {
      name: 'Uttara - Indiranagar',
      slug: 'indiranagar',
      code: 'BLR-IND-01',
      address: 'Shop 4, 100 Feet Road, HAL 2nd Stage, Indiranagar',
      locality: 'Indiranagar',
      landmark: 'Near 12th Main Junction',
      latitude: 12.9716,
      longitude: 77.6412,
      phone: '+91 80 4123 4501',
      email: 'indiranagar@uttara.in',
      opensAt: '11:30',
      closesAt: '22:30',
      averagePrepTimeMinutes: 7,
      currentStatus: OutletStatus.OPEN,
    },
    {
      name: 'Uttara - Jayanagar',
      slug: 'jayanagar',
      code: 'BLR-JAY-02',
      address: 'Ground Floor, 11th Main Road, 4th Block, Jayanagar',
      locality: 'Jayanagar',
      landmark: 'Opposite Jayanagar Complex',
      latitude: 12.9308,
      longitude: 77.5838,
      phone: '+91 80 4123 4502',
      email: 'jayanagar@uttara.in',
      opensAt: '11:30',
      closesAt: '22:30',
      averagePrepTimeMinutes: 8,
      currentStatus: OutletStatus.OPEN,
    },
    {
      name: 'Uttara - Malleshwaram',
      slug: 'malleshwaram',
      code: 'BLR-MAL-03',
      address: '22/1, 8th Cross, Sampige Road, Malleshwaram',
      locality: 'Malleshwaram',
      landmark: 'Near Margosa Circle',
      latitude: 13.0031,
      longitude: 77.5702,
      phone: '+91 80 4123 4503',
      email: 'malleshwaram@uttara.in',
      opensAt: '11:30',
      closesAt: '22:00',
      averagePrepTimeMinutes: 6,
      currentStatus: OutletStatus.OPEN,
    },
    {
      name: 'Uttara - Koramangala',
      slug: 'koramangala',
      code: 'BLR-KOR-04',
      address: '88, 80 Feet Road, 5th Block, Koramangala',
      locality: 'Koramangala',
      landmark: 'Near Sony World Signal',
      latitude: 12.9352,
      longitude: 77.6245,
      phone: '+91 80 4123 4504',
      email: 'koramangala@uttara.in',
      opensAt: '11:30',
      closesAt: '23:00',
      averagePrepTimeMinutes: 9,
      currentStatus: OutletStatus.OPEN,
    }
  ];

  const outlets = [];
  for (const o of outletsData) {
    const created = await prisma.outlet.create({ data: o });
    outlets.push(created);
  }
  console.log(`✓ Created ${outlets.length} Bengaluru outlets`);

  // 2. Create Users for all roles
  const defaultPasswordHash = await bcrypt.hash('Uttara@2026', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@uttara.in',
      phone: '+91 98801 00001',
      name: 'Basavaraj Patil (Admin)',
      passwordHash: defaultPasswordHash,
      role: Role.admin,
    }
  });

  const kitchenManager = await prisma.user.create({
    data: {
      email: 'kitchen@uttara.in',
      phone: '+91 98801 00002',
      name: 'Mahadevappa (Kitchen Head)',
      passwordHash: defaultPasswordHash,
      role: Role.kitchen_manager,
    }
  });

  const outletManager = await prisma.user.create({
    data: {
      email: 'manager.indiranagar@uttara.in',
      phone: '+91 98801 00003',
      name: 'Shankar Gowda (Indiranagar Mgr)',
      passwordHash: defaultPasswordHash,
      role: Role.outlet_manager,
      favoriteOutletId: outlets[0].id,
    }
  });

  const staff = await prisma.user.create({
    data: {
      email: 'staff.indiranagar@uttara.in',
      phone: '+91 98801 00004',
      name: 'Ravi Kumar (Counter Staff)',
      passwordHash: defaultPasswordHash,
      role: Role.outlet_staff,
      favoriteOutletId: outlets[0].id,
    }
  });

  await prisma.staffOutlet.create({
    data: {
      userId: staff.id,
      outletId: outlets[0].id,
    }
  });
  await prisma.staffOutlet.create({
    data: {
      userId: outletManager.id,
      outletId: outlets[0].id,
    }
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@uttara.in',
      phone: '+91 98801 00005',
      name: 'Hemanth S.',
      passwordHash: defaultPasswordHash,
      role: Role.customer,
      favoriteOutletId: outlets[0].id,
    }
  });

  const loyaltyAccount = await prisma.loyaltyAccount.create({
    data: {
      userId: customer.id,
      pointsBalance: 245,
      lifetimePointsEarned: 380,
      tier: 'OOTA_PATRON',
    }
  });

  await prisma.loyaltyTransaction.create({
    data: {
      loyaltyAccountId: loyaltyAccount.id,
      points: 139,
      type: 'EARNED',
      description: 'Points earned on Order #UTT-1001',
    }
  });

  console.log('✓ Created users with roles (Admin, Kitchen, Outlet Mgr, Staff, Customer)');

  // 3. Create Core Menu Item (The Oota)
  const ootaItem = await prisma.menuItem.create({
    data: {
      name: 'North Karnataka Oota',
      kannadaName: 'ಉತ್ತರ ಕರ್ನಾಟಕ ಊಟ',
      description: 'Traditional wholesome meal: 3 Jolada Rotti, 2 Kalyana Karnataka Palyas, Sona Masoori Rice, Bele Saaru, Shenga & Agasi Pudi, Fresh Mosaru.',
      basePrice: 139.0,
      isDefaultOota: true,
      imageUrl: '/images/uttara-oota-thali.webp',
      isActive: true,
    }
  });
  console.log('✓ Created Core Menu Item');

  // 4. Create Today's Menu (with authentic rotating palyas)
  const todayStr = new Date().toISOString().split('T')[0];
  await prisma.dailyMenu.create({
    data: {
      outletId: null, // applies globally
      date: todayStr,
      palya1Name: 'Yennegayi Badanekayi',
      palya1KannadaName: 'ಎಣ್ಣೆಗಾಯಿ ಬದನೆಕಾಯಿ',
      palya1Description: 'Tender baby brinjals slow-roasted with stone-ground peanut, sesame, Deccan spices, and tamarind.',
      palya2Name: 'Hesaru Kalu Usli',
      palya2KannadaName: 'ಹೆಸರು ಕಾಳು ಉಸ್ಲಿ',
      palya2Description: 'Sprouted whole moong beans tempered with mustard, curry leaves, ginger, and freshly scraped coconut.',
      isAvailable: true,
    }
  });
  console.log("✓ Created Today's Daily Menu with rotating palyas");

  // 5. Create Coupons
  await prisma.coupon.create({
    data: {
      code: 'UTTARA50',
      description: 'Flat ₹50 off on orders above ₹250',
      discountType: DiscountType.FLAT,
      discountValue: 50.0,
      minOrderValue: 250.0,
      validUntil: new Date('2027-12-31'),
    }
  });

  await prisma.coupon.create({
    data: {
      code: 'FIRSTOOTA',
      description: '20% off your first authentic Oota',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20.0,
      minOrderValue: 139.0,
      maxDiscount: 60.0,
      validUntil: new Date('2027-12-31'),
    }
  });
  console.log('✓ Created promotional coupons');

  // 6. Create Kitchen Production Batch and Outlet Dispatches
  const batch = await prisma.kitchenProduction.create({
    data: {
      date: todayStr,
      batchNumber: `BATCH-${todayStr.replace(/-/g, '')}-01`,
      plannedMeals: 510,
      cookedMeals: 500,
      dispatchedMeals: 480,
      wastageMeals: 10,
      status: ProductionStatus.DISPATCHED,
      notes: 'Morning batch dispatched at 10:45 AM. All spice balances verified.',
    }
  });

  const outletDemands = [
    { outlet: outlets[0], expected: 150, dispatched: 145, received: 145, status: DispatchStatus.RECEIVED },
    { outlet: outlets[1], expected: 140, dispatched: 140, received: 140, status: DispatchStatus.RECEIVED },
    { outlet: outlets[2], expected: 95,  dispatched: 95,  received: 95,  status: DispatchStatus.RECEIVED },
    { outlet: outlets[3], expected: 125, dispatched: 100, received: 100, status: DispatchStatus.DISPATCHED },
  ];

  for (const d of outletDemands) {
    await prisma.kitchenOutletDispatch.create({
      data: {
        kitchenProductionId: batch.id,
        outletId: d.outlet.id,
        expectedMeals: d.expected,
        dispatchedMeals: d.dispatched,
        receivedMeals: d.received,
        status: d.status,
      }
    });
  }
  console.log('✓ Created Kitchen Production batch and dispatches');

  // 7. Create Sample Active & Completed Orders for Indiranagar outlet
  const sampleOrders = [
    {
      orderNumber: 'UTT-1041',
      customerName: 'Ananya Rao',
      customerPhone: '+91 99001 11223',
      status: OrderStatus.READY,
      pickupOtp: '4819',
      quantity: 2,
      subtotal: 278.0,
      packagingFee: 30.0,
      taxAmount: 15.4,
      discountAmount: 0.0,
      totalAmount: 323.4,
      orderType: OrderType.TAKEAWAY,
      notes: 'Please pack extra Shenga Pudi if possible',
    },
    {
      orderNumber: 'UTT-1042',
      customerName: 'Girish Kulkarni',
      customerPhone: '+91 98450 33445',
      status: OrderStatus.PREPARING,
      pickupOtp: '6271',
      quantity: 1,
      subtotal: 139.0,
      packagingFee: 15.0,
      taxAmount: 7.7,
      discountAmount: 0.0,
      totalAmount: 161.7,
      orderType: OrderType.TAKEAWAY,
      notes: 'Freshly warm rotti please',
    },
    {
      orderNumber: 'UTT-1043',
      customerName: 'Priya Sharma',
      customerPhone: '+91 97312 55667',
      status: OrderStatus.PLACED,
      pickupOtp: '8910',
      quantity: 3,
      subtotal: 417.0,
      packagingFee: 45.0,
      taxAmount: 20.6,
      discountAmount: 50.0,
      totalAmount: 432.6,
      orderType: OrderType.TAKEAWAY,
      couponCode: 'UTTARA50',
      notes: null,
    },
    {
      orderNumber: 'UTT-1039',
      customerName: 'Hemanth S.',
      customerPhone: '+91 98801 00005',
      status: OrderStatus.COMPLETED,
      pickupOtp: '1102',
      quantity: 1,
      subtotal: 139.0,
      packagingFee: 15.0,
      taxAmount: 7.7,
      discountAmount: 0.0,
      totalAmount: 161.7,
      orderType: OrderType.TAKEAWAY,
      userId: customer.id,
      notes: null,
    }
  ];

  for (const s of sampleOrders) {
    const readyAt = new Date();
    readyAt.setMinutes(readyAt.getMinutes() + 15);

    const order = await prisma.order.create({
      data: {
        orderNumber: s.orderNumber,
        outletId: outlets[0].id,
        userId: s.userId || null,
        customerName: s.customerName,
        customerPhone: s.customerPhone,
        status: s.status,
        orderType: s.orderType,
        pickupOtp: s.pickupOtp,
        quantity: s.quantity,
        unitPrice: 139.0,
        subtotal: s.subtotal,
        discountAmount: s.discountAmount,
        packagingFee: s.packagingFee,
        taxAmount: s.taxAmount,
        totalAmount: s.totalAmount,
        couponCode: s.couponCode,
        notes: s.notes,
        estimatedReadyAt: readyAt,
      }
    });

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        menuItemId: ootaItem.id,
        name: 'North Karnataka Oota',
        quantity: s.quantity,
        unitPrice: 139.0,
        totalPrice: s.subtotal,
      }
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: s.totalAmount,
        currency: 'INR',
        status: PaymentStatus.SUCCESS,
        provider: PaymentProvider.MOCK,
        providerPaymentId: `pay_mock_${s.orderNumber.toLowerCase()}`,
      }
    });
  }
  console.log('✓ Created sample active and completed orders');

  console.log('\n🎉 Seed completed successfully!');
  console.log('Default credentials for testing:');
  console.log('  Admin:            admin@uttara.in / Uttara@2026');
  console.log('  Kitchen Head:     kitchen@uttara.in / Uttara@2026');
  console.log('  Outlet Manager:   manager.indiranagar@uttara.in / Uttara@2026');
  console.log('  Outlet Staff:     staff.indiranagar@uttara.in / Uttara@2026');
  console.log('  Customer:         customer@uttara.in / Uttara@2026');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
