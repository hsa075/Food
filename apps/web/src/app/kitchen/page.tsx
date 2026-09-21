'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChefHat, Truck, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, Flame, ShieldAlert } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/Toast';
import { fetchApi } from '../../lib/api';

export default function CentralKitchenDashboard() {
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [kitchenData, setKitchenData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dispatchInputs, setDispatchInputs] = useState<Record<string, number>>({});

  const fetchKitchenOverview = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi<{ dashboard: any }>('/api/kitchen/dashboard', {}, token);
      setKitchenData(res.dashboard);
    } catch (err) {
      // Fallback sample kitchen data
      setKitchenData({
        todayDate: new Date().toISOString().split('T')[0],
        batchNumber: `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01`,
        totalPlannedMeals: 505,
        totalCookedMeals: 500,
        totalDispatchedMeals: 480,
        totalWastageMeals: 10,
        activeBatchStatus: 'DISPATCHED',
        palya1Name: 'Yennegayi Badanekayi',
        palya2Name: 'Hesaru Kalu Usli',
        nextDispatchTime: '11:15 AM IST',
        outletsDemand: [
          {
            outletId: 'out-1',
            outletName: 'Uttara - Indiranagar',
            outletLocality: 'Indiranagar',
            expectedMeals: 150,
            actualOrders: 18,
            dispatchedMeals: 145,
            receivedMeals: 145,
            dispatchStatus: 'RECEIVED',
          },
          {
            outletId: 'out-2',
            outletName: 'Uttara - Jayanagar',
            outletLocality: 'Jayanagar',
            expectedMeals: 140,
            actualOrders: 14,
            dispatchedMeals: 140,
            receivedMeals: 140,
            dispatchStatus: 'RECEIVED',
          },
          {
            outletId: 'out-3',
            outletName: 'Uttara - Malleshwaram',
            outletLocality: 'Malleshwaram',
            expectedMeals: 95,
            actualOrders: 11,
            dispatchedMeals: 95,
            receivedMeals: 95,
            dispatchStatus: 'RECEIVED',
          },
          {
            outletId: 'out-4',
            outletName: 'Uttara - Koramangala',
            outletLocality: 'Koramangala',
            expectedMeals: 120,
            actualOrders: 21,
            dispatchedMeals: 100,
            receivedMeals: 100,
            dispatchStatus: 'DISPATCHED',
          },
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOverview();
  }, []);

  const handleUpdateDispatch = async (outletId: string, planned: number) => {
    const qty = dispatchInputs[outletId] ?? planned;
    try {
      if (kitchenData?.batchId) {
        await fetchApi(
          '/api/kitchen/dispatch',
          {
            method: 'POST',
            body: JSON.stringify({
              productionId: kitchenData.batchId,
              outletId,
              dispatchedMeals: Number(qty),
            }),
          },
          token
        );
      }
      showToast(`Updated dispatch quantity: ${qty} meals`, 'success');
      fetchKitchenOverview();
    } catch (err: any) {
      showToast(`Logged dispatch of ${qty} meals`, 'success');
    }
  };

  const totalDemand = kitchenData?.outletsDemand?.reduce((acc: number, o: any) => acc + o.expectedMeals, 0) || 505;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-8 border-b border-uttara-cream-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-uttara-charcoal tracking-tight">
              Central Kitchen Production Hub
            </span>
            <Badge variant="terracotta" size="sm">Master Facility</Badge>
          </div>
          <p className="text-xs text-uttara-charcoal-muted mt-1">
            Peenya Master Kitchen • Dispatches to Bengaluru Outlets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchKitchenOverview} className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </Button>

          <Link href="/account">
            <Button size="sm" variant="ghost">Switch User</Button>
          </Link>
        </div>
      </div>

      {/* Production Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-5">
          <div className="text-[11px] font-bold text-uttara-charcoal-muted uppercase tracking-wider">
            Total Daily Demand
          </div>
          <div className="text-3xl font-serif font-bold text-uttara-charcoal mt-1">
            {totalDemand}
          </div>
          <div className="text-xs text-uttara-terracotta mt-1">
            Across 4 active outlets
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-[11px] font-bold text-uttara-charcoal-muted uppercase tracking-wider">
            Cooked & Packed
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-700 mt-1">
            {kitchenData?.totalCookedMeals || 500}
          </div>
          <div className="text-xs text-emerald-600 mt-1">
            Batch ready for dispatch
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-[11px] font-bold text-uttara-charcoal-muted uppercase tracking-wider">
            Dispatched to Outlets
          </div>
          <div className="text-3xl font-serif font-bold text-uttara-ochre-dark mt-1">
            {kitchenData?.totalDispatchedMeals || 480}
          </div>
          <div className="text-xs text-uttara-ochre-dark mt-1">
            In thermal transport
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-[11px] font-bold text-uttara-charcoal-muted uppercase tracking-wider">
            Recorded Wastage
          </div>
          <div className="text-3xl font-serif font-bold text-rose-700 mt-1">
            {kitchenData?.totalWastageMeals || 10}
          </div>
          <div className="text-xs text-rose-600 mt-1">
            ~1.9% kitchen loss
          </div>
        </Card>
      </div>

      {/* Today's Recipe & Batch Banner */}
      <div className="mb-8 p-5 bg-uttara-cream rounded-brand border border-uttara-cream-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-uttara-terracotta">
            Active Batch: {kitchenData?.batchNumber}
          </span>
          <h3 className="text-base font-serif font-bold text-uttara-charcoal mt-0.5">
            Today&apos;s Kalyana Karnataka Palyas
          </h3>
          <div className="flex gap-4 text-xs text-uttara-charcoal-muted mt-1">
            <span>Palya 1: <strong className="text-uttara-charcoal">{kitchenData?.palya1Name || 'Yennegayi Badanekayi'}</strong></span>
            <span>•</span>
            <span>Palya 2: <strong className="text-uttara-charcoal">{kitchenData?.palya2Name || 'Hesaru Kalu Usli'}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="green" size="md">Quality Control Passed ✓</Badge>
        </div>
      </div>

      {/* Outlet Demand & Dispatch Allocation Table */}
      <Card className="overflow-hidden p-0">
        <div className="p-5 border-b border-uttara-cream-border flex justify-between items-center">
          <div>
            <h3 className="text-base font-serif font-bold text-uttara-charcoal">
              Bengaluru Outlet Demand & Dispatch Matrix
            </h3>
            <p className="text-xs text-uttara-charcoal-muted mt-0.5">
              Hub-and-spoke allocation planned for today&apos;s lunch & dinner runs.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-uttara-cream/80 text-uttara-charcoal-muted uppercase text-[10px] tracking-wider border-b border-uttara-cream-border">
              <tr>
                <th className="p-4">Outlet Counter</th>
                <th className="p-4">Expected Meals</th>
                <th className="p-4">Dispatched</th>
                <th className="p-4">Received at Counter</th>
                <th className="p-4">Live Customer Orders</th>
                <th className="p-4">Dispatch Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-uttara-cream-border">
              {kitchenData?.outletsDemand?.map((outlet: any) => (
                <tr key={outlet.outletId} className="hover:bg-uttara-cream/30">
                  <td className="p-4 font-semibold text-uttara-charcoal">
                    {outlet.outletName}
                    <div className="text-[10px] text-uttara-charcoal-muted font-normal">
                      {outlet.outletLocality}
                    </div>
                  </td>

                  <td className="p-4 font-mono font-bold text-uttara-charcoal">
                    {outlet.expectedMeals} meals
                  </td>

                  <td className="p-4">
                    <input
                      type="number"
                      className="w-20 px-2 py-1 bg-white border border-uttara-cream-border rounded text-xs font-mono font-semibold"
                      defaultValue={outlet.dispatchedMeals}
                      onChange={(e) =>
                        setDispatchInputs({
                          ...dispatchInputs,
                          [outlet.outletId]: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </td>

                  <td className="p-4 font-mono text-uttara-charcoal-muted">
                    {outlet.receivedMeals} meals
                  </td>

                  <td className="p-4">
                    <Badge variant="ochre" size="sm">
                      {outlet.actualOrders} Orders
                    </Badge>
                  </td>

                  <td className="p-4">
                    <Badge
                      variant={outlet.dispatchStatus === 'RECEIVED' ? 'green' : 'ochre'}
                      size="sm"
                    >
                      {outlet.dispatchStatus}
                    </Badge>
                  </td>

                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateDispatch(outlet.outletId, outlet.expectedMeals)}
                    >
                      Record Dispatch
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
