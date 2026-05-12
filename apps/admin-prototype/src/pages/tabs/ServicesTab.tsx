import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Settings2, Clock, ShoppingBag } from 'lucide-react';

/**
 * ServicesTab — Phase 2 placeholder.
 *
 * This tab will manage storefront products/services (price, variants, stock,
 * payment IDs, publish status, etc.) once the backend product schema is ready.
 * Kept here so the tab slot is reserved and the sidebar link works.
 */
export default function ServicesTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings2 className="h-6 w-6 text-[#0077B6]" /> Services Management
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          Manage storefront services, pricing, and product listings.
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0077B6]/10 border border-[#0077B6]/20">
            <ShoppingBag className="h-8 w-8 text-[#0077B6]/60" />
          </div>
          <CardTitle className="text-zinc-100 text-xl">Coming in Phase 2</CardTitle>
          <CardDescription className="text-zinc-500 max-w-md mx-auto mt-2">
            The Services/Storefront management tab is reserved for Phase 2. It will include product listings,
            pricing, variants, stock levels, payment IDs, categories, and publish controls — all
            connected to the live checkout and payment systems.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 text-zinc-600 text-sm py-4">
            <Clock className="h-4 w-4" />
            <span>Planned for Phase 2 development</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}