interface Props {
  text: string;
  translation: string;
  x: number;
  y: number;
}

export default function TranslatePopup({ text, translation, x, y }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        background: "white",
        borderRadius: "10px",
        padding: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        maxWidth: "260px",
        zIndex: 999,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{text}</div>
      <div style={{ color: "#444" }}>{translation}</div>
    </div>
  );
}
