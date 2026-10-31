import { TrendingDown } from "lucide-react";
import { formatIdr } from "../../lib/utils";

interface CostComparisonProps {
  marketplacePrice: number;
  boilerPrice: number;
}

export function CostComparison({
  marketplacePrice,
  boilerPrice,
}: CostComparisonProps) {
  const savingsPct = ((boilerPrice - marketplacePrice) / boilerPrice) * 100;

  return (
    <div>
      <p className="mb-3 text-xs font-semibold tracking-wide text-text-secondary uppercase">
        Analisis Perbandingan Biaya
      </p>

      <div className="flex flex-col gap-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-semibold text-text">
              Harga Marketplace HERA
            </span>
            <span className="font-bold text-text">
              Rp {formatIdr(marketplacePrice)} / MWh
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/6">
            <div
              className="h-full rounded-full bg-turquoise"
              style={{ width: `${(marketplacePrice / boilerPrice) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-semibold text-text">
              Biaya Boiler Sendiri (Batubara)
            </span>
            <span className="font-bold text-text">
              Rp {formatIdr(boilerPrice)} / MWh
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/6">
            <div
              className="h-full rounded-full bg-text-secondary/40"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-green/10 px-4 py-3">
        <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-green-dark" />
        <p className="text-sm font-semibold text-green-dark">
          Pabrik Anda menghemat hingga {savingsPct.toFixed(1)}% pengeluaran
          energi dengan kesepakatan ini.
        </p>
      </div>
    </div>
  );
}
