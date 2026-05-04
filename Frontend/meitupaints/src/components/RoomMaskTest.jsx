import React, { useMemo, useState } from "react";

export default function LivingMaskTest() {
  const [rgb, setRgb] = useState("rgb(244,236,207)"); // start light

  const ROOMS = useMemo(
    () => [
      {
        key: "living",
        label: "Living Room",
        img: "/living.webp",
        mask: "/living-mask.svg",
      },
      {
        key: "bedroom",
        label: "Bedroom",
        img: "/bedroom.webp",
        mask: "/bedroom-mask.svg",
      },
      {
        key: "kitchen",
        label: "Kitchen",
        img: "/kitchen.webp",
        mask: "/kitchen-mask.svg",
      },
    ],
    [],
  );

  const [activeRoom, setActiveRoom] = useState("living");

  const room = useMemo(
    () => ROOMS.find((r) => r.key === activeRoom) || ROOMS[0],
    [ROOMS, activeRoom],
  );

  const maskStyle = useMemo(
    () => ({
      WebkitMaskImage: `url("${room.mask}")`,
      maskImage: `url("${room.mask}")`,
    }),
    [room.mask],
  );

  const tintStyle = useMemo(
    () => ({
      ...maskStyle,
      backgroundColor: rgb,
    }),
    [maskStyle, rgb],
  );

  const shadowStyle = useMemo(
    () => ({
      ...maskStyle,
      // Use the original room photo as a luminance texture for shadows
      backgroundImage: `url("${room.img}")`,
      backgroundSize: "100% 100%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }),
    [maskStyle, room.img],
  );

  return (
    <div style={{ maxWidth: 980, margin: "110px auto", padding: 16 }}>
      <h2 style={{ fontWeight: 900, marginBottom: 10 }}>
        {room.label} Mask Test
      </h2>

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {ROOMS.map((r) => {
            const isOn = r.key === activeRoom;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => setActiveRoom(r.key)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,.12)",
                  background: isOn ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.9)",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
                aria-pressed={isOn}
              >
                {r.label}
              </button>
            );
          })}
        </div>
        <button type="button" onClick={() => setRgb("rgb(193,18,31)")}>
          Meitu Red
        </button>
        <button type="button" onClick={() => setRgb("rgb(244,236,207)")}>
          Light
        </button>
        <button type="button" onClick={() => setRgb("rgb(40,40,45)")}>
          Dark
        </button>

        <input
          value={rgb}
          onChange={(e) => setRgb(e.target.value)}
          placeholder="rgb(244,236,207)"
          style={{ minWidth: 220, padding: "8px 10px" }}
        />
      </div>

      {/* The image is the base, the masked tint layer sits on top */}
      <div className="roomRow">
        <div className="roomWrap">
          <img className="roomImg" src={room.img} alt={room.label} />

          {/* Masked tint overlay */}
          <div className="roomTint" style={tintStyle} aria-hidden="true" />
          <div
            className="roomShadeDepth"
            style={shadowStyle}
            aria-hidden="true"
          />

          {/* Optional: a subtle highlight to keep it premium */}
          <div className="roomSheen" aria-hidden="true" />
        </div>

        {/* Reference swatch */}
        <div
          className="refBox"
          aria-label="Selected shade reference"
          title={rgb}
        >
          <div className="refSwatch" style={{ backgroundColor: rgb }} />
          <div className="refMeta">
            <div className="refLabel">Reference</div>
            <div className="refValue">{rgb}</div>
          </div>
        </div>
      </div>

      <style>{`
        .roomRow{
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        /* On mobile, stack the reference below for better fit */
        @media (max-width: 680px){
          .roomRow{ flex-direction: column; }
        }

        .refBox{
          flex: 0 0 220px;
          border-radius: 18px;
          border: 1px solid rgba(0,0,0,.10);
          background: rgba(255,255,255,.65);
          box-shadow: 0 14px 34px rgba(0,0,0,.10);
          padding: 12px;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .refSwatch{
          width: 64px;
          height: 64px;
          border-radius: 14px;
          border: 1px solid rgba(0,0,0,.12);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.35);
          flex: 0 0 auto;
        }

        .refMeta{
          min-width: 0;
        }

        .refLabel{
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .02em;
          opacity: .78;
          margin-bottom: 4px;
        }

        .refValue{
          font-size: 12px;
          font-weight: 700;
          opacity: .9;
          word-break: break-word;
          line-height: 1.2;
        }

        .roomWrap{
          position: relative;
          width: 100%;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,.10);
          background: rgba(255,255,255,.7);
          box-shadow: 0 20px 55px rgba(0,0,0,.10);
          flex: 1 1 auto;
        }

        .roomImg{
          width: 100%;
          height: auto;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* This is the key: a full-size overlay layer, but only visible through the SVG mask */
        .roomTint{
          position:absolute;
          inset:0;
          pointer-events:none;

          /* Accurate shade preview: avoid blending with the photo (prevents pink shift) */
          mix-blend-mode: normal;
          opacity: 0.88;
          filter: none;

          /* Mask settings */
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
          -webkit-mask-size: 100% 100%;

          mask-repeat: no-repeat;
          mask-position: center;
          mask-size: 100% 100%;
        }

        .roomShadeDepth{
          position:absolute;
          inset:0;
          pointer-events:none;
          /* Shadow extractor: multiplies grayscale luminance of the original photo */
          mix-blend-mode: multiply;
          opacity: .65;
          filter: grayscale(1) contrast(1.18) brightness(.92);

          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
          -webkit-mask-size: 100% 100%;
          mask-repeat: no-repeat;
          mask-position: center;
          mask-size: 100% 100%;
        }

        /* Optional sheen for a more “premium” finish (no hardcoding) */
        .roomSheen{
          position:absolute;
          inset:0;
          pointer-events:none;
          background: linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0) 40%);
          mix-blend-mode: soft-light;
          opacity: .7;
        }
      `}</style>
    </div>
  );
}
