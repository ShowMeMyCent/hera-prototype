import { ArrowRight, Flame, LineChart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function HomePage() {
  return (
    <PageContainer className="flex flex-col gap-10 py-10 sm:py-14">
      <div className="max-w-2xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-turquoise/25 bg-turquoise/10 px-3 py-1 text-xs font-bold tracking-wide text-turquoise-dark uppercase">
          <Flame className="h-3.5 w-3.5" />
          Industrial Energy Exchange Platform
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Pantau, pulihkan, dan pertukarkan energi panas industri Anda.
        </h1>
        <p className="mt-3 text-base text-text-secondary">
          HERA menghubungkan data sensor IoT dari sumber panas industri dengan
          ekosistem pabrik yang membutuhkan pasokan panas — meningkatkan
          efisiensi dan menekan emisi karbon kawasan industri berbasis hidrogen.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card className="flex flex-col gap-4 p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LineChart className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text">Analytics</h2>
            <p className="mt-1.5 text-sm text-text-secondary">
              Monitoring data sensor IoT dari sumber panas industri secara
              real-time dan analisis potensi pemulihan serta pemanfaatan energi
              panas.
            </p>
          </div>
          <Link to="/analytics" className="mt-auto">
            <Button variant="outline" className="w-full">
              Buka Analytics
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>

        <Card className="flex flex-col gap-4 p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-turquoise/10 text-turquoise-dark">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text">Marketplace</h2>
            <p className="mt-1.5 text-sm text-text-secondary">
              Mempertemukan perusahaan yang memiliki surplus panas (Supplier)
              dengan perusahaan yang membutuhkan panas (Receiver/Seeker) melalui
              pencocokan MCDA.
            </p>
          </div>
          <Link to="/marketplace" className="mt-auto">
            <Button variant="secondary" className="w-full">
              Buka Marketplace
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    </PageContainer>
  );
}
