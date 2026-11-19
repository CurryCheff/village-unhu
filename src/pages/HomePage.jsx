import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ContactSection from '../components/ContactSection';
import ThisWeek from '../components/ThisWeek';
import VillageMap from '../components/VillageMap';
import Team from '../components/Team';
import Testimonials from '../components/Testimonials';
import PastResidents from '../components/PastResidents';
import NewsletterForm from '../components/NewsletterForm';
import WhatsAppChooser from '../components/WhatsAppChooser';
import WhatsAppFab from '../components/WhatsAppFab';
import useInView from '../hooks/useInView';
import ImageWithSkeleton from '../components/skeleton/ImageWithSkeleton';
import { contactInfo, defaultWhatsAppContactId, faqItems, galleryItems, heroContent, longTableInfo, navItems, residencyContent, site, studioCards, visitInfo, whatsappContacts, workshopList, exhibitionList, whatsappMessages } from '../content/site';
import { buildWhatsAppLink } from '../utils/whatsapp';

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
            <ImageWithSkeleton
              src={item.image}
              alt={`${item.title} by ${item.artist}`}
              aspectRatio="4 / 5"
              className="gallery-item-media"
              imgClassName="gallery-item-media__image"
            />
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
  const contactSectionRef = useRef(null);
  const contactVisible = useInView(contactSectionRef, { threshold: 0.35 });
  const phoneNumbers = contactInfo.phones.map((number) => ({
    number,
    href: number.replace(/[\s().-]/g, ''),
  }));
  const whatsappHref = buildWhatsAppLink(contactInfo.whatsapp);
  const showWhatsAppFab = Boolean(whatsappHref) && !contactVisible;

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
            {[...site.announcements, ...site.announcements].map((item, index) => (
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
            <a className="btn btn--primary" href={`#${site.applyOrBook.id}`}>{heroContent.primaryCta}</a>
            <a className="btn btn--ghost" href="#exhibitions">{heroContent.secondaryCta}</a>
          </div>
          <a className="hero__scroll" href="#studios"><span>Explore the village</span><span aria-hidden="true">↓</span></a>
        </section>

        <section id={site.applyOrBook.id} className="section apply-or-book" aria-labelledby={site.applyOrBook.titleId}>
          <header className="section__head">
            <h2 id={site.applyOrBook.titleId} className="display">{site.applyOrBook.title}</h2>
          </header>
          <ul className="cards cards--3">
            {site.applyOrBook.choices.map((choice) => {
              const whatsappHref = buildWhatsAppLink(contactInfo.whatsapp, choice.message);
              const formHref = `/?topic=${encodeURIComponent(choice.topic)}#contact`;

              return (
                <li className="card" key={choice.id}>
                  <h3 className="card__title">{choice.label}</h3>
                  <div className="card__links">
                    {whatsappHref && (
                      <a className="card__link" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                        {site.applyOrBook.whatsappLabel}
                      </a>
                    )}
                    <Link className="card__link card__link--secondary" to={formHref}>
                      {site.applyOrBook.formLabel}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <ThisWeek />

        <div className="pull-quote-band">
          <p>{site.pullQuote}</p>
        </div>

        {site.features.studios && <section id="studios" className="section" aria-labelledby="studios-title">
          <header className="section__head">
            <p className="label">01 — Studios</p>
            <h2 id="studios-title" className="display">{site.studios.title}</h2>
            <p className="section__lede">{site.studios.intro}</p>
          </header>
          <ul className="cards cards--3">
            {studioCards.map((studio) => {
              const studioMessage = whatsappMessages.find((item) => item.id === studio.whatsappMessageId)?.message || '';
              const studioLink = buildWhatsAppLink(contactInfo.whatsapp, studioMessage);

              return (
                <li key={studio.id} className="card">
                  <h3 className="card__title">{studio.title}</h3>
                  {studio.summary && <p>{studio.summary}</p>}
                  <div className="card__links">
                    <Link className="card__link" to={`/?topic=${studio.topic}#contact`}>
                      {studio.cta} <span aria-hidden="true">→</span>
                    </Link>
                    {studioLink && (
                      <a className="card__link card__link--secondary" href={studioLink} target="_blank" rel="noopener noreferrer" aria-label={`Message us on WhatsApp about ${studio.title}, opens in a new tab`}>
                        Ask on WhatsApp
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>}

        {site.features.residency && <section id="residency" className="section section--tint" aria-labelledby="residency-title">
          <div className="split">
            <header className="section__head">
              <p className="label">02 — Residency</p>
              <h2 id="residency-title" className="display">{residencyContent.title}</h2>
              <p className="section__lede">{residencyContent.description}</p>
              <div className="card__links">
                <Link className="btn btn--primary" to="/apply">Explore the residency</Link>
                {buildWhatsAppLink(contactInfo.whatsapp, whatsappMessages.find((item) => item.id === 'residency')?.message || '') && (
                  <a
                    className="btn btn--ghost btn--small"
                    href={buildWhatsAppLink(contactInfo.whatsapp, whatsappMessages.find((item) => item.id === 'residency')?.message || '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Message us on WhatsApp about residency, opens in a new tab"
                  >
                    Ask on WhatsApp
                  </a>
                )}
              </div>
            </header>
            <dl className="facts">
              {residencyContent.details.map((detail) => (
                <div key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
              {residencyContent.funding.enabled && (
                <div>
                  <dt>Funding</dt>
                  <dd>{residencyContent.funding.value}</dd>
                </div>
              )}
            </dl>
          </div>
        </section>}

        {site.features.exhibitions && <section id="exhibitions" className="section" aria-labelledby="exhibitions-title">
          <header className="section__head">
            <p className="label">03 — Exhibitions</p>
            <h2 id="exhibitions-title" className="display">{site.exhibitions.title}</h2>
            <p className="section__lede">{site.exhibitions.openingLine}</p>
          </header>
          {exhibitionList.length > 0 && (
            <ol className="shows">
              {exhibitionList.map((show) => (
                <li key={show.id} className="show">
                  <time className="show__date" dateTime={show.date}>{formatDate(show.date)}</time>
                  <div>
                    <h3 className="show__title">{show.title}</h3>
                    <p>{show.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>}

        {site.features.workshops && <section id="workshops" className="section section--tint" aria-labelledby="workshops-title">
          <header className="section__head">
            <p className="label">04 — Workshops</p>
            <h2 id="workshops-title" className="display">{site.workshops.title}</h2>
          </header>
          <ul className="cards cards--3">
            {workshopList.map((workshop) => {
              const workshopMessage = whatsappMessages.find((item) => item.id === 'workshops')?.message || '';
              const workshopLink = buildWhatsAppLink(contactInfo.whatsapp, workshopMessage);

              return (
                <li key={workshop.id} className="card">
                  <h3 className="card__title">{workshop.title}</h3>
                  {workshop.summary && <p>{workshop.summary}</p>}
                  <div className="card__links">
                    <Link to={`/?topic=${encodeURIComponent(workshop.topic)}#contact`} className="card__link">{site.workshops.contactLabel} <span aria-hidden="true">→</span></Link>
                    {workshopLink && (
                      <a className="card__link card__link--secondary" href={workshopLink} target="_blank" rel="noopener noreferrer" aria-label={`Message us on WhatsApp about ${workshop.title}, opens in a new tab`}>
                        {site.workshops.whatsappLabel}
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>}

        {site.features.gallery && <section id="gallery" className="section" aria-labelledby="gallery-title">
          <header className="section__head">
            <p className="label">05 — Gallery</p>
            <h2 id="gallery-title" className="display">{site.gallery.title}</h2>
          </header>
          <ul className="gallery-categories" aria-label="Gallery categories">
            {site.gallery.categories.map((category) => <li key={category}>{category}</li>)}
          </ul>
          {galleryItems.length > 0 && (
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
          )}
        </section>}

        {site.features.about && <section id="about" className="section section--tint" aria-labelledby="about-title">
          <div className="split split--about">
            <header className="section__head">
              <p className="label">06 — About</p>
              <h2 id="about-title" className="display">{site.about.title}</h2>
            </header>
            <div className="prose">
              <p>{site.about.unhu}</p>
              <h3>{site.about.projectHistoryLabel}</h3>
              {site.about.facts.map((fact) => <p key={fact}>{fact}</p>)}
              {site.about.founders.confirmed && site.about.founders.names.length > 0 && (
                <p>{site.about.founders.names.join(' and ')}</p>
              )}
              <h3>{site.about.exchangesLabel}</h3>
              <p>Exchanges with artists from {site.about.exchanges.join(', ')}.</p>
              <h3>{site.about.artFairsLabel}</h3>
              <ul>
                {site.about.artFairs.map((fair) => (
                  <li key={fair.name}>
                    {fair.name}{fair.since ? ` (since ${fair.since})` : ` (${fair.year})`}
                  </li>
                ))}
              </ul>
              <h3>{site.about.schoolProgrammesLabel}</h3>
              <p>{site.about.schoolProgrammes}</p>
            </div>
          </div>
          {site.features.villageMap && <VillageMap />}
          {site.features.faq && faqItems.some((faq) => faq.answer.trim()) && <div className="faq">
            <p className="label">{site.about.faqLabel}</p>
            {faqItems.filter((faq) => faq.answer.trim()).map((faq) => (
              <details key={faq.question} className="faq__item">
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>}
        </section>}

        {site.features.futureProjects && site.futureProjects.items.length > 0 && (
          <section className="section" aria-labelledby={site.futureProjects.titleId}>
            <h2 id={site.futureProjects.titleId} className="display">{site.futureProjects.title}</h2>
            <ul>{site.futureProjects.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        )}

        {site.features.longTable && <section className="section">
          <div className="long-table-callout">
            <div>
              <p className="label">The long table</p>
              <h3>{longTableInfo.title}</h3>
            </div>
            <p>{longTableInfo.description}</p>
            <div className="long-table-meta">
              <Link to={longTableInfo.href} className="btn btn--primary">{longTableInfo.cta}</Link>
            </div>
          </div>
        </section>}

        <section id="visit" className="section section--tint" aria-labelledby="visit-title">
          <header className="section__head">
            <p className="label">Visit</p>
            <h2 id="visit-title" className="display">Plan your visit.</h2>
          </header>
          <div className="visit-grid">
            {visitInfo.locations.map((location) => (
              <div className="visit-card" key={location.name}>
                <h3>{location.name}</h3>
                <address>{location.address}</address>
                {location.name === 'Mutare' && site.mutareFeatures.mountains.enabled && site.mutareFeatures.mountains.text && (
                  <p>{site.mutareFeatures.mountains.text}</p>
                )}
                {location.name === 'Mutare' && site.mutareFeatures.coffeeShop.enabled && site.mutareFeatures.coffeeShop.text && (
                  <p>{site.mutareFeatures.coffeeShop.text}</p>
                )}
                <h4>Opening hours</h4>
                {visitInfo.hours.map((entry) => (
                  <p key={entry.days}><strong>{entry.days}:</strong> {entry.hours}</p>
                ))}
              </div>
            ))}
            <div className="visit-card">
              <h3>Contact</h3>
              {phoneNumbers.map(({ number, href }) => <p key={number}><a href={`tel:${href}`}>{number}</a></p>)}
              <p><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p>
            </div>
          </div>
        </section>

        {(site.features.team || site.features.testimonials || site.features.pastResidents) && <section className="section">
          <Team />
          <Testimonials />
          <PastResidents />
        </section>}

        <section id="contact" ref={contactSectionRef} className="section contact" aria-labelledby="contact-title">
          <header className="section__head">
            <p className="label">07 — Contact</p>
            <h2 id="contact-title" className="display">Come say hello.</h2>
            <p className="section__lede">Studio enquiries, residency questions, press or a plain old hello.</p>
          </header>
          <div className="contact-meta-block">
            {phoneNumbers.map(({ number, href }) => <p key={number}><a href={`tel:${href}`}>{number}</a></p>)}
            <p><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p>
          </div>
          {whatsappHref && (
            <WhatsAppChooser
              contacts={whatsappContacts}
              defaultContactId={defaultWhatsAppContactId}
              messages={whatsappMessages}
            />
          )}
          <ContactSection />
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__top">
          <Link className="brand brand--wordmark brand--footer" to="/" aria-label="Village Unhu — home">
            <img src="/assets/village-unhu-wordmark.png" alt="Village Unhu" width="999" height="230" />
          </Link>
          <address>
            {visitInfo.locations.map((location) => (
              <React.Fragment key={location.name}>
                <strong>{location.name}:</strong> {location.address}<br />
              </React.Fragment>
            ))}
            {phoneNumbers.map(({ number, href }) => (
              <React.Fragment key={number}><a href={`tel:${href}`}>{number}</a><br /></React.Fragment>
            ))}
            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
          </address>
          <div className="footer-newsletter">
            {site.features.newsletter && <NewsletterForm />}
          </div>
          <ul className="social" aria-label="Social links">
            {contactInfo.socials.filter((social) => social.confirmed).map((social) => (
              <li key={social.label}><a href={social.href} target="_blank" rel="noopener noreferrer">{social.label}</a></li>
            ))}
            {whatsappHref ? <li><a href={whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a></li> : null}
          </ul>
        </div>
        <p className="site-footer__small">© {new Date().getFullYear()} Village Unhu. All rights reserved.</p>
      </footer>

      {showWhatsAppFab && (
        <WhatsAppFab
          contacts={whatsappContacts}
          defaultContactId={defaultWhatsAppContactId}
          messages={whatsappMessages}
        />
      )}

      {activeArt && (
        <div className="art-dialog" role="dialog" aria-modal="true" aria-label={`${activeArt.title} by ${activeArt.artist}`}>
          <button className="art-dialog__close" type="button" aria-label="Close artwork viewer" onClick={closeArtwork}>×</button>
          {activeArt.image ? (
            <ImageWithSkeleton
              src={activeArt.image}
              alt={`${activeArt.title} by ${activeArt.artist}`}
              aspectRatio="4 / 5"
              className="art-dialog__media"
              imgClassName="art-dialog__image"
            />
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
