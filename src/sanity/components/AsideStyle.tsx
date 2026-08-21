import type { BlockStyleProps } from "sanity";

/**
 * Renders the "Aside" style inside the Studio so it looks like an aside while
 * you are writing it, rather than being indistinguishable from a paragraph.
 *
 * Sanity invokes a style's `component` in two different places: rendering the
 * block inside the editor, where `renderDefault` is supplied, and rendering the
 * entry in the style dropdown, where it is not. Calling `renderDefault`
 * unconditionally therefore crashes the moment the dropdown opens, so fall back
 * to `children` whenever it is absent.
 */
export function AsideStyle(props: BlockStyleProps) {
  const content =
    typeof props.renderDefault === "function"
      ? props.renderDefault(props)
      : props.children;

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
      {content}
    </div>
  );
}
