import { useEffect, useRef } from 'react';
import Carousel from 'bootstrap/js/dist/carousel';

import '../../styles/components/organism/Testimonios.css';

import testimonio1 from '../../assets/testimonio-1.webp';
import testimonio2 from '../../assets/testimonio-2.webp';
import testimonio3 from '../../assets/testimonio-3.webp';

function Testimonios() {

  const carouselRef = useRef(null);

  useEffect(() => {

    // Bootstrap carousel SIN autoplay
    new Carousel(carouselRef.current, {
      interval: false,
      ride: false,
      pause: true,
      wrap: true,
      touch: true
    });

    const tabs = document.querySelectorAll('.tabs li');
    const indicators = document.querySelectorAll('.indicators li');

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        tabs.forEach(tab => tab.classList.remove('active'));
        tabs[index].classList.add('active');
      });
    });

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });

  }, []);

  return (
    <section className="testimonial">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 d-none d-lg-block">
            <ol className="carousel-indicators tabs">
              <li
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="0"
                className="active">
                <figure>
                  <img src={testimonio1} className="img-fluid" alt="testimonial"/>
                </figure>
              </li>
              <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1">
                <figure>
                  <img src={testimonio2} className="img-fluid" alt="testimonial"/>
                </figure>
              </li>
              <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2">
                <figure>
                  <img src={testimonio3} className="img-fluid" alt="testimonial"/>
                </figure>
              </li>
            </ol>
          </div>

          {/* Carousel */}
          <div className="col-lg-6 d-flex justify-content-center align-items-center">

            <div
              ref={carouselRef}
              id="carouselExampleIndicators"
              className="carousel slide">

              <h3>LO QUE DICEN NUESTROS CLIENTES</h3>
              <h1>TESTIMONIOS</h1>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="quote-wrapper">
                    <p>¡He probado muchos servicios de lista de espera pero RedNorte es algo de otro mundo! Su rapidez y facilidad es increible.</p>
                    <h3>Amanda Martinez</h3>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="quote-wrapper">
                    <p>Excelente servicio y soporte. Altamente recomendado para cualquiera que busque calidad.</p>
                    <h3>Antonia Leiva</h3>
                  </div>
                </div>

                <div className="carousel-item">
                  <div className="quote-wrapper">
                    <p>Profesional, rapido y recomendable. Una de las mejora experiencias que he tenido.</p>
                    <h3>Benjamin avila</h3>
                  </div>
                </div>
              </div>
              <ol className="carousel-indicators indicators">
                <li
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="0"
                  className="active"
                ></li>
                <li
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="1"
                ></li>
                <li
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="2"
                ></li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonios;