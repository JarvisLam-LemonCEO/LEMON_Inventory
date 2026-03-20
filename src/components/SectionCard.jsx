export default function SectionCard({ title, right, children }) {
  return (
    <section className="card">
      <div className="card-head">
        <h2>{title}</h2>
        {right ? <div>{right}</div> : null}
      </div>
      {children}
    </section>
  );
}