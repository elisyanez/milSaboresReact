import React from 'react';

export default function Blogs() {
  return (
    <main className="page-container">
      <h2 className="page-title">Blogs</h2>
      <div className="blogs-grid">

        {/* Caja 1 */}
        <div className="blog-card">
          <img
            src="\IMG\pan-sin-gluten.png"
            alt="Blog 1"
            className="blog-image"
          />
          <div className="blog-content">
            <h3>Datos Curioso Gastronomico</h3>
            <p>
             - En el antiguo Egipto, el pan era tan importante que se usaba como moneda.
            Los trabajadores y artesanos muchas veces recibían pan y cerveza como salario, y hasta existían registros de impuestos pagados con panes.
            </p>
            <p>
              - El merengue se inventó por accidente cuando un cocinero descubrió que batir claras con azúcar creaba una mezcla firme y brillante.
              Pero lo curioso es que durante mucho tiempo no existían batidoras, así que los reposteros podían tardar más de 20 minutos batiendo a mano para lograrlo.
            </p>
            <p>
              - El chocolate solía ser consumido como bebida por las civilizaciones mesoamericanas, como los mayas y aztecas.
            </p>
              
          </div>
        </div>

        {/* Caja 2 */}
        <div className="blog-card">
          <img
            src="\IMG\brownie-sin-gluten.png"
            alt="Blog 2"
            className="blog-image"
          />
          <div className="blog-content">
            <h3>Dato Curioso sobre Mil Sabores</h3>
            <p>
              Mil Sabores nació casi por accidente. 
              <p></p>
              <p>Un día estaba haciendo un queque normal, nada especial, y pensé: “¿Y si le agrego un par de cosas distintas?”. Mezclé un par de ingredientes sin pensarlo mucho… y cuando lo probamos en la casa, todos quedaron sorprendidos.</p>
              <p>Desde ahí empecé a probar combinaciones nuevas cada semana. Y siempre me decían lo mismo:
                “¡Nunca había probado un sabor así!”</p>

            <p>Ahí fue cuando entendí que mi gracia no era seguir recetas, sino crear sabores. 
              Y así, sin planearlo mucho, terminó naciendo Mil Sabores.</p>
            </p>
          </div>
        </div>

      </div>

    </main>
  );
}
