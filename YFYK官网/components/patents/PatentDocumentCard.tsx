import { Icon } from "@/components/ui/Icons";
import type { PatentCredential } from "@/lib/content/patents";

export function PatentDocumentCard({ credential }: { credential: PatentCredential }) {
  return (
    <article className="pat-doc-card">
      <span className="pat-doc-type">{credential.type}</span>
      <span className="pat-doc-icon" aria-hidden="true">
        <Icon name="badge" size={20} />
      </span>
      <h3>{credential.name}</h3>
      <dl className="pat-doc-meta">
        <div>
          <dt>登记/授权时间</dt>
          <dd>{credential.date}</dd>
        </div>
        {credential.number ? (
          <div>
            <dt>{credential.numberLabel ?? "编号"}</dt>
            <dd>{credential.number}</dd>
          </div>
        ) : null}
      </dl>
      <p>{credential.description}</p>
    </article>
  );
}
