import Breadcrumbs from "@/components/ui/Breadcrumbs";
export default function PageShell({ title, path, intro, introHtml, children }: { title: string; path: string; intro?: string; introHtml?: string; children: React.ReactNode }) {
  return (
    <div className="container-x">
      <Breadcrumbs items={[{ name: title, path }]} />
      <h1 className="text-4xl md:text-5xl font-semibold">{title}</h1>
      {introHtml
        ? <div className="mt-4 text-muted max-w-3xl text-lg leading-relaxed prose-intro" dangerouslySetInnerHTML={{ __html: introHtml }} />
        : intro && <p className="mt-3 text-muted max-w-2xl leading-relaxed">{intro}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}
