import type { BlockStyleProps } from "sanity";

/**
 * Renders the "Aside" style inside the Studio editor so it looks like an aside
 * while you are writing it, rather than looking identical to a normal paragraph.
 */
export function AsideStyle(props: BlockStyleProps) {
  return (
    <div
      style={{
        borderLeft: "3px solid #3ee07f",
        background: "rgba(62, 224, 127, 0.06)",
        borderRadius: "0 6px 6px 0",
        padding: "10px 16px",
        margin: "4px 0",
      }}
    >
      {props.renderDefault(props)}
    </div>
  );
}
