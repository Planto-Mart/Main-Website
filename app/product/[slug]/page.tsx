/* eslint-disable no-unused-vars */
import CompletePage from "@/components/productsPage/CompletePage";

export const runtime = 'edge';

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } =  params

  return <CompletePage slug={slug} />
}