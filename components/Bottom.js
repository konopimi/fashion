export default function Bottom() {
  return (
    <>
      <div
        style={{
          width: "100%",
          padding: 5,
          position: "sticky",
          top: "var(--topbar-height, 0px)",
          zIndex: 99,
          background: "rgba(127,127,127,0.72)",
          backdropFilter: "blur(7px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          textShadow: "0 1px 4px rgba(0,0,0,0.45)",
        }}
      >
        ASHERALEPH
      </div>
      <div className="image-container">
        <img src="https://co.silviatcherassi.com/cdn/shop/files/ST_d8f2e597-969e-4663-a915-a59d6f3d51c1.png?v=1759248174&width=1500" />
        <img src="https://co.silviatcherassi.com/cdn/shop/files/Sofia_Tennis_Bag.jpg?v=1775766367&width=1500" />
      </div>
      <div
        className="bottomBS"
        style={{ display: "flex", gap: 60, marginTop: 100, padding: 20 }}
      >
        <div>
          <h4>Relaciones con clientes</h4> <div>Contacto</div>{" "}
          <div>Atelier</div> <div>Colecciones</div>
        </div>{" "}
        <div>
          <h4>Legal</h4>
          <div>Términos Y Condiciones</div> <div>Compras En Línea</div>{" "}
          <div>Política de Privacidad</div>{" "}
          <div>Términos Y Condiciones De Uso</div>{" "}
          <div>Declaración de Accesibilidad</div>{" "}
          <div>Opciones de Accessibilidad</div>
        </div>
        <div>
          <h4>Únete a la conversación</h4> <div>Facebook</div>
          <div>Instagram</div> <div>Pinterest</div> <div>Tiktok</div>
        </div>
      </div>
    </>
  );
}
