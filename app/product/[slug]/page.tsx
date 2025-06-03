/* eslint-disable no-unused-vars */
import CompletePage from "@/components/productsPage/CompletePage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <CompletePage slug={(await params).slug} />
}