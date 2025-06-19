/* eslint-disable no-unused-vars */
import CompletePage from "@/components/productsPage/CompletePage";

export const runtime = process.env.HOSTPLATFORM === 'pages' ? 'edge' : undefined;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <CompletePage slug={(await params).slug} />
}