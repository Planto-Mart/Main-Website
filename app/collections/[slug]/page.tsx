import CompletePage from "@/components/collections/CompletePage";

export const runtime = 'edge';

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } =  params

  return <CompletePage category={slug} />
}