import { Suspense } from "react"
import { CryptoDetail } from "@/components/crypto/crypto-detail"
import { Skeleton } from "@/components/ui/skeleton"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  // Pre-generate pages for common cryptocurrencies
  return [{ id: "bitcoin" }, { id: "ethereum" }, { id: "cardano" }]
}

export default function CryptoPage({ params }: { params: { id: string } }) {
  const id = params.id

  // Validate id param
  if (!id || typeof id !== "string") {
    return notFound()
  }

  // Format crypto name for display
  const formattedId = id.charAt(0).toUpperCase() + id.slice(1)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{formattedId} Details</h1>

      <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-lg" />}>
        <CryptoDetail id={id} />
      </Suspense>
    </div>
  )
}

