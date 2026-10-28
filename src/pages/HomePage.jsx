import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ContactSection from '../components/ContactSection';
import ThisWeek from '../components/ThisWeek';
import VillageMap from '../components/VillageMap';
import Team from '../components/Team';
import Testimonials from '../components/Testimonials';
import PastResidents from '../components/PastResidents';
import NewsletterForm from '../components/NewsletterForm';
import { faqItems, galleryItems, heroContent, longTableInfo, navItems, residencyContent, studioCards, visitInfo, workshopList, exhibitionList } from '../content/site';
import { downloadIcsFile } from '../utils/ics';
import { getEventStatus } from '../utils/eventStatus';

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function GalleryItem({ item, onOpen }) {
  const hasImage = Boolean(item.image && item.image.trim());

  return (
    <li className="gallery__item">
      <figure>
        <button className="artwork" type="button" onClick={(event) => onOpen(item, event.currentTarget)} aria-label={`Open ${item.title} by ${item.artist}`}>
          {hasImage ? (
            <img src={item.image} alt={`${item.title} by ${item.artist}`} loading="lazy" />
          ) : (
            <span className="gallery-placeholder" aria-hidden="true">
              <span>{item.title}</span>
            </span>
          )}
          <span className="artwork__zoom" aria-hidden="true">View work ↗</span>
        </button>
        <figcaption>
          <strong>{item.title}</strong>
          <span>{item.artist}</span>
        </figcaption>
      </figure>
    </li>
  );
}

export default function HomePage() {
  const location = useLocation();
  const [activeArt, setActiveArt] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const galleryRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (location.hash === '#contact') {
      const timer = window.setTimeout(() => {
        const contactNode = document.getElementById('contact');
        if (contactNode) contactNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 10);
      return () => window.clearTimeout(timer);
    }
  }, [location.hash]);

  const scrollGallery = (direction) => {
    if (!galleryRef.current) return;
    galleryRef.current.scrollBy({
      left: direction * galleryRef.current.clientWidth * 0.82,
      behavior: 'smooth',
    });
  };

  const handleGalleryKey = (event) => {
    if (!galleryRef.current) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollGallery(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollGallery(-1);
    }
  };

  const openArtwork = (item, trigger) => {
    triggerRef.current = trigger;
    setActiveArt(item);
  };

  const closeArtwork = () => {
    setActiveArt(null);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!activeArt) return;
      if (event.key === 'Escape') closeArtwork();
      if (event.key === 'ArrowRight') {
        const nextIndex = (galleryItems.findIndex((item) => item.id === activeArt.id) + 1) % galleryItems.length;
        setActiveArt(galleryItems[nextIndex]);
      }
      if (event.key === 'ArrowLeft') {
        const nextIndex = (galleryItems.findIndex((item) => item.id === activeArt.id) - 1 + galleryItems.length) % galleryItems.length;
        setActiveArt(galleryItems[nextIndex]);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeArt]);

  useEffect(() => {
    if (activeArt) {
      const closeButton = document.querySelector('.art-dialog__close');
      closeButton?.focus();
    }
  }, [activeArt]);

  return (
    <>
      <div className="marquee" role="region" aria-label="Announcements">
        <div className="marquee__viewport">
          <ul className="marquee__track">
            {['Residency applications open until [TODO: deadline]', 'Exhibition opening night — first Friday of December', 'Saturday clay workshops now booking', 'Studio tours every second Sunday', 'Residency applications open until [TODO: deadline]', 'Exhibition opening night — first Friday of December', 'Saturday clay workshops now booking', 'Studio tours every second Sunday'].map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <header className="site-header">
        <Link className="brand brand--wordmark" to="/" aria-label="Village Unhu — home">
          <img src="/assets/village-unhu-wordmark.png" alt="Village Unhu" width="999" height="230" />
        </Link>
        <button className="nav-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen((value) => !value)}>
          Menu
        </button>
        <nav id="site-nav" className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label="Primary navigation">
          <ul>
            {navItems.map((item) => (
              <li key={item.label}>
                {item.cta ? (
                  <Link className="site-nav__cta" to={item.href.startsWith('#') ? `/${item.href}` : item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>
                ) : (
                  <Link to={item.href.startsWith('#') ? `/${item.href}` : item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main">
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="hero__blob hero__blob--green" />
          <div className="hero__blob hero__blob--purple" />
          <p className="label">{heroContent.eyebrow}</p>
          <h1 id="hero-title" className="display hero__title">{heroContent.title}</h1>
          <p className="hero__sub">{heroContent.subtitle}</p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/apply">{heroContent.primaryCta}</Link>
            <a className="btn btn--ghost" href="#exhibitions">{heroContent.secondaryCta}</a>
          </div>
          <div className="hero__note">
            <span className="hero__note-mark" aria-hidden="true">✺</span>
            <span>
              <strong>{heroContent.note.title}</strong>
              <br />
              {heroContent.note.detail}
            </span>
          </div>
          <a className="hero__scroll" href="#studios"><span>Explore the village</span><span aria-hidden="true">↓</span></a>
        </section>

        <ThisWeek />

        <div className="pull-quote-band">
          <p>Unhu is the Shona idea of becoming fully human through others — a village built on generosity, care and making together.</p>
        </div>

        <section id="studios" className="section" aria-labelledby="studios-title">
          <header className="section__head">
            <p className="label">01 — Studios</p>
            <h2 id="studios-title" className="display">Rooms of one’s own, doors left open.</h2>
            <p className="section__lede">Affordable studios for painters, sculptors, printmakers and everyone between. Shared kilns, a wood shop and a long table for lunch.</p>
          </header>
          <ul className="cards cards--3">
            {studioCards.map((studio, index) => (
              <li key={studio.id} className={`card ${index === 1 ? 'card--green' : index === 2 ? 'card--purple' : ''}`}>
                <h3 className="card__title">{studio.title}</h3>
                <p>{studio.summary}</p>
                <p className="card__price">{studio.price}</p>
                <Link className="card__link" to={studio.topic === 'About' ? '/#about' : studio.topic === 'Workshops' ? '/#workshops' : `/?topic=${studio.topic}#contact`}>
                  {studio.cta} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="residency" className="section section--tint" aria-labelledby="residency-title">
          <div className="split">
            <header className="section__head">
              <p className="label">02 — Residency</p>
              <h2 id="residency-title" className="display">{residencyContent.title}</h2>
              <p className="section__lede">{residencyContent.decription}</p>
              <Link className="btn btn--primary" to="/apply">Explore the residency</Link>
            </header>
            <dl className="facts">
              {residencyContent.details.map((detail) => (
                <div key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
              <div>
                <dt>Stipend</dt>
                <dd>{residencyContent.stipend}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="exhibitions" className="section" aria-labelledby="exhibitions-title">
          <header className="section__head">
            <p className="label">03 — Exhibitions</p>
            <h2 id="exhibitions-title" className="display">On the walls, and off them.</h2>
          </header>
          <ol className="shows">
            {exhibitionList.map((show) => {
              const status = getEventStatus(show.date);
              const statusLabel = status === 'opening-soon' ? 'Opening soon' : status === 'past' ? 'Past' : 'Upcoming';
              const tagClass = status === 'opening-soon' ? 'tag tag--green' : 'tag';

              return (
                <li key={show.id} className="show">
                  <time className="show__date" dateTime={show.date}>{formatDate(show.date)}</time>
                  <div>
                    <h3 className="show__title">{show.title}</h3>
                    <p>{show.description}</p>
                  </div>
                  <div className="event-actions">
                    <span className={tagClass}>{statusLabel}</span>
                    <button
                      className="btn btn--ghost btn--small"
                      type="button"
                      onClick={() => window.location.href = `mailto:hello@villageunhu.example?subject=${encodeURIComponent(show.title + ' RSVP')}`}
                    >
                      RSVP
                    </button>
                    <button
                      className="btn btn--ghost btn--small"
                      type="button"
                      onClick={() => downloadIcsFile({
                        title: show.title,
                        start: show.date,
                        end: new Date(new Date(show.date).getTime() + 2 * 60 * 60 * 1000).toISOString(),
                        description: show.description,
                        location: show.venue,
                      })}
                    >
                      Add to calendar
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section id="workshops" className="section section--tint" aria-labelledby="workshops-title">
          <header className="section__head">
            <p className="label">04 — Workshops</p>
            <h2 id="workshops-title" className="display">Make something with your hands.</h2>
            <p className="section__lede">Beginner-friendly sessions led by resident artists. Materials included, mess encouraged.</p>
          </header>
          <ul className="cards cards--4">
            {workshopList.map((workshop) => (
              <li key={workshop.id} className="card">
                <span className="card__meta">{workshop.schedule}</span>
                <h3 className="card__title">{workshop.title}</h3>
                <p>{workshop.summary}</p>
                <p className="card__price">{workshop.price}</p>
                <div className="event-actions event-actions--stacked">
                  <Link to="/?topic=Workshops#contact" className="card__link">RSVP <span aria-hidden="true">→</span></Link>
                  <button className="btn btn--ghost btn--small" type="button" onClick={() => downloadIcsFile({ title: workshop.title, start: workshop.date, end: new Date(new Date(workshop.date).getTime() + 90 * 60 * 1000).toISOString(), description: workshop.summary, location: workshop.location })}>Add to calendar</button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="gallery" className="section" aria-labelledby="gallery-title">
          <header className="section__head">
            <p className="label">05 — Gallery</p>
            <h2 id="gallery-title" className="display">From the studios, this season.</h2>
          </header>
          <div className="gallery-carousel" aria-label="Artwork carousel">
            <div className="gallery-carousel__controls">
              <p>Drag to browse, or use the arrows.</p>
              <div>
                <button className="gallery-carousel__button" type="button" onClick={() => scrollGallery(-1)} aria-label="Previous artworks">←</button>
                <button className="gallery-carousel__button" type="button" onClick={() => scrollGallery(1)} aria-label="Next artworks">→</button>
              </div>
            </div>
            <ul ref={galleryRef} className="gallery" onKeyDown={handleGalleryKey} tabIndex={0}>
              {galleryItems.map((item) => (
                <GalleryItem key={item.id} item={item} onOpen={openArtwork} />
              ))}
            </ul>
          </div>
        </section>

        <section id="about" className="section section--tint" aria-labelledby="about-title">
          <div className="split split--about">
            <header className="section__head">
              <p className="label">06 — About</p>
              <h2 id="about-title" className="display">Unhu: being human, together.</h2>
            </header>
            <div className="prose">
              <p><em>Unhu</em> is a Shona word for the quality of being fully human through others. It’s the idea we build the village around.</p>
              <p>We started as a few shared studios and a stubborn belief that art is better when it’s made in company. Today we’re a growing community of makers, teachers and neighbours who open our doors, our tools and our table.</p>
            </div>
          </div>
          <VillageMap />
          <div className="faq">
            <p className="label">Good to know</p>
            {faqItems.map((faq) => (
              <details key={faq.question} className="faq__item">
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="long-table-callout">
            <div>
              <p className="label">The long table</p>
              <h3>{longTableInfo.title}</h3>
            </div>
            <p>{longTableInfo.description}</p>
            <div className="long-table-meta">
              <span>Next date: {longTableInfo.nextDate}</span>
              <Link to="/?topic=Exhibitions#contact" className="btn btn--primary">{longTableInfo.cta}</Link>
            </div>
          </div>
        </section>

        <section id="visit" className="section section--tint" aria-labelledby="visit-title">
          <header className="section__head">
            <p className="label">Visit</p>
            <h2 id="visit-title" className="display">Plan your visit.</h2>
          </header>
          <div className="visit-grid">
            <div className="visit-card">
              <h3>Opening hours</h3>
              <p>{visitInfo.hours}</p>
            </div>
            <div className="visit-card">
              <h3>Address</h3>
              <p>{visitInfo.address}</p>
            </div>
            <div className="visit-card">
              <h3>How to get here</h3>
              <p>{visitInfo.transport}</p>
            </div>
            <div className="visit-card">
              <h3>Accessibility</h3>
              <p>{visitInfo.accessibility}</p>
            </div>
          </div>
          <div className="visit-map-block">
            <div className="visit-map-block__map" aria-label="Map placeholder">
              <span>[TODO: replace with real map]</span>
            </div>
            <div className="visit-map-block__copy">
              <p className="label">Visitor info</p>
              <p>{visitInfo.bookingNote}</p>
            </div>
          </div>
        </section>

        <section className="section">
          <Team />
          <Testimonials />
          <PastResidents />
        </section>

        <section id="contact" className="section contact" aria-labelledby="contact-title">
          <header className="section__head">
            <p className="label">07 — Contact</p>
            <h2 id="contact-title" className="display">Come say hello.</h2>
            <p className="section__lede">Studio enquiries, residency questions, press or a plain old hello.</p>
          </header>
          <ContactSection />
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__top">
          <Link className="brand brand--wordmark brand--footer" to="/" aria-label="Village Unhu — home">
            <img src="/assets/village-unhu-wordmark.png" alt="Village Unhu" width="999" height="230" />
          </Link>
          <address>
            {visitInfo.address}
            <br />
            <a href={`mailto:${heroContent.note ? 'hello@villageunhu.example' : 'hello@villageunhu.example'}`}>hello@villageunhu.example</a>
          </address>
          <div className="footer-newsletter">
            <NewsletterForm />
          </div>
          <ul className="social" aria-label="Social links">
            <li><a href="[TODO: instagram url]">Instagram</a></li>
            <li><a href="[TODO: facebook url]">Facebook</a></li>
            <li><a href="[TODO: newsletter url]">Newsletter</a></li>
          </ul>
        </div>
        <p className="site-footer__small">© {new Date().getFullYear()} Village Unhu. All rights reserved.</p>
      </footer>

      {activeArt && (
        <div className="art-dialog" role="dialog" aria-modal="true" aria-label={`${activeArt.title} by ${activeArt.artist}`}>
          <button className="art-dialog__close" type="button" aria-label="Close artwork viewer" onClick={closeArtwork}>×</button>
          {activeArt.image ? (
            <img className="art-dialog__image" src={activeArt.image} alt={`${activeArt.title} by ${activeArt.artist}`} />
          ) : (
            <div className="gallery-placeholder gallery-placeholder--large" aria-label={`${activeArt.title} placeholder`}>
              <span>{activeArt.title}</span>
            </div>
          )}
          <p className="art-dialog__caption">{activeArt.title} — {activeArt.artist}</p>
        </div>
      )}
    </>
  );
}
