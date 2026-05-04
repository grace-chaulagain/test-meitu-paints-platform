import {
  formatMoney,
  formatPack,
  getTierLabel,
  getTierPrice,
} from "./pricing.js";

function ProductImagePlaceholder({ category }) {
  return (
    <div
      style={{
        height: 170,
        borderRadius: 18,
        background:
          "linear-gradient(135deg, rgba(245,245,247,1) 0%, rgba(232,232,236,1) 100%)",
        border: "1px solid rgba(0,0,0,.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        color: "rgba(0,0,0,.48)",
        fontWeight: 800,
        letterSpacing: ".04em",
        textTransform: "uppercase",
        fontSize: 12,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: "rgba(255,255,255,.72)",
          border: "1px solid rgba(0,0,0,.06)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.9)",
        }}
      />
      <div>{category?.replaceAll("_", " ") || "Product"}</div>
    </div>
  );
}

function QtyControl({ value, onChange }) {
  const qty = Number(value || 0);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        border: "1px solid rgba(0,0,0,.10)",
        background: "rgba(255,255,255,.92)",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(0, qty - 1))}
        style={{
          width: 38,
          height: 38,
          border: "none",
          background: "transparent",
          fontSize: 18,
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        −
      </button>

      <input
        type="number"
        min="0"
        step="1"
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
          )
        }
        style={{
          width: 56,
          height: 38,
          border: "none",
          outline: "none",
          textAlign: "center",
          fontWeight: 900,
          background: "transparent",
        }}
      />

      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        style={{
          width: 38,
          height: 38,
          border: "none",
          background: "transparent",
          fontSize: 18,
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        +
      </button>
    </div>
  );
}

function VariantChip({ product, quantity, onQtyChange }) {
  const qty = Number(quantity || 0);
  const { tier, unitPrice } = getTierPrice(
    product?.pricing?.tiers || [],
    qty || 1,
    product?.pricing,
    product?.pack,
  );

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,.08)",
        background: "rgba(255,255,255,.88)",
        display: "grid",
        gap: 10,
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 10 }}
      >
        <div>
          <div style={{ fontWeight: 950 }}>{formatPack(product.pack)}</div>
          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              color: "rgba(0,0,0,.52)",
              fontWeight: 700,
            }}
          >
            {product.sku}
          </div>
        </div>

        <div
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(0,0,0,.05)",
            border: "1px solid rgba(0,0,0,.06)",
            fontSize: 12,
            fontWeight: 800,
            color: "rgba(0,0,0,.72)",
            whiteSpace: "nowrap",
            height: "fit-content",
          }}
        >
          {getTierLabel(tier, product.pricing)}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(0,0,0,.52)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: ".04em",
            }}
          >
            Unit Rate
          </div>
          <div style={{ marginTop: 2, fontWeight: 950 }}>
            {formatMoney(unitPrice, product.currency)}
          </div>
        </div>

        <QtyControl
          value={quantity}
          onChange={(next) => onQtyChange(product.sku, next)}
        />
      </div>
    </div>
  );
}

function ProductCard({ group, quantities, onQtyChange }) {
  return (
    <div
      style={{
        borderRadius: 24,
        border: "1px solid rgba(0,0,0,.08)",
        background: "rgba(255,255,255,.84)",
        boxShadow: "0 20px 50px rgba(0,0,0,.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: 16 }}>
        <ProductImagePlaceholder category={group.category} />

        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "inline-flex",
              padding: "6px 10px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 900,
              background: "rgba(208, 0, 0, .08)",
              color: "#b42318",
              letterSpacing: ".05em",
              textTransform: "uppercase",
            }}
          >
            {group.category?.replaceAll("_", " ")}
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 20,
              fontWeight: 950,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {group.name}
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 13,
              color: "rgba(0,0,0,.56)",
              fontWeight: 700,
            }}
          >
            {group.code}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "0 16px 16px",
          display: "grid",
          gap: 10,
        }}
      >
        {group.items
          .slice()
          .sort(
            (a, b) => Number(b?.pack?.size || 0) - Number(a?.pack?.size || 0),
          )
          .map((product) => (
            <VariantChip
              key={product.sku}
              product={product}
              quantity={quantities[product.sku] || ""}
              onQtyChange={onQtyChange}
            />
          ))}
      </div>
    </div>
  );
}

export default function ProductsPanel({
  groupedProducts,
  quantities,
  onQtyChange,
}) {
  return (
    <div
      style={{
        borderRadius: 28,
        border: "1px solid rgba(0,0,0,.08)",
        background: "rgba(255,255,255,.74)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: "0 30px 80px rgba(0,0,0,.08)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 20,
          borderBottom: "1px solid rgba(0,0,0,.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 950,
              letterSpacing: "-0.02em",
            }}
          >
            Products
          </div>
          <div
            style={{
              marginTop: 6,
              color: "rgba(0,0,0,.58)",
              fontWeight: 700,
            }}
          >
            Browse the Meitu catalog and add pack sizes directly from the grid.
          </div>
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 900,
            color: "rgba(0,0,0,.50)",
            textTransform: "uppercase",
            letterSpacing: ".08em",
          }}
        >
          {groupedProducts.length} product families
        </div>
      </div>

      {groupedProducts.length === 0 ? (
        <div style={{ padding: 24, color: "rgba(0,0,0,.58)", fontWeight: 800 }}>
          No products found.
        </div>
      ) : (
        <div
          style={{
            padding: 20,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 18,
          }}
        >
          {groupedProducts.map((group) => (
            <ProductCard
              key={group.code}
              group={group}
              quantities={quantities}
              onQtyChange={onQtyChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
