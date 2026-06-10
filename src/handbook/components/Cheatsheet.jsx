export function Cheatsheet({ items }) {
  return <ul className="hb-cheat">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
}
