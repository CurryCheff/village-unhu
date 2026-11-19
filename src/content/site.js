export const site = {
  features: {
    studios: true,
    residency: true,
    exhibitions: true,
    workshops: false,
    gallery: false,
    about: true,
    villageMap: false,
    faq: false,
    longTable: true,
    accessibility: false,
    newsletter: true,
    team: false,
    testimonials: false,
    pastResidents: false,
    thisWeek: false,
  },
  pendingContent: {
    studioFee: false,
    residencyFunding: false,
    exhibitionOpeningTime: false,
    workshopDaysTimesAndFees: false,
    longTableDateTimeAndCost: false,
    faqAnswers: false,
    galleryArtworkDetails: false,
    founderPermission: false,
    instagramHandle: false,
    accessibilityDetails: false,
    mountainsDescription: false,
    coffeeShopDescription: false,
    whatsappContacts: false,
  },
  nav: [
    { label: 'Studios', href: '#studios' },
    { label: 'Residency', href: '#residency' },
    { label: 'Exhibitions', href: '#exhibitions' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact', cta: true },
  ],
  hero: {
    eyebrow: 'Contemporary art village',
    title: 'Art that grows from shared ground.',
    subtitle: 'Village Unhu is an artist-led project space in Zimbabwe, registered since 2009.',
    primaryCta: 'Apply for residency',
    secondaryCta: "See what's on",
  },
  announcements: [
    'Studio tours at the end of every residency',
    'Exhibition openings every Thursday',
    'Residency applications open all year round',
  ],
  pullQuote:
    'Unhu is the Shona idea of becoming fully human through others — a village built on generosity, care and making together.',
  studios: {
    title: 'Studios',
    intro: 'Village Unhu started as a studio space.',
    cards: [
      {
        id: 'open-studios',
        title: 'Studio space',
        summary: 'Village Unhu started as a studio space.',
        cta: 'Get in touch',
        topic: 'Studios',
      },
    ],
  },
  residency: {
    title: 'Residency at Mutare',
    description:
      'The residency takes place at the Mutare space. It runs from two weeks to six months, with five intakes a year and applications open all year round.',
    details: [
      { label: 'Location', value: 'Mutare' },
      { label: 'Length', value: 'Two weeks to six months' },
      { label: 'Intakes', value: 'Five a year' },
      { label: 'Applications', value: 'Open all year round' },
      { label: 'Includes', value: 'Studio and accommodation' },
      { label: 'Open to', value: 'Fine art, sound and performance artists' },
    ],
    funding: { enabled: false, value: '' },
    applyLabel: 'Apply for residency',
  },
  exhibitions: {
    title: 'Exhibitions',
    openingLine: 'Exhibition openings every Thursday.',
    items: [],
  },
  workshops: [],
  gallery: {
    categories: ['Paintings', 'Drawings', 'Graphics', 'Multimedia', 'Photographs', 'Sculpture'],
    items: [],
  },
  about: {
    title: 'Unhu: being human, together.',
    unhu:
      'Unhu is the Shona idea of becoming fully human through others — a village built on generosity, care and making together.',
    facts: [
      'Village Unhu is an artist-led project space in Zimbabwe, registered since 2009.',
      'It started as a studio space.',
    ],
    founders: { confirmed: false, names: [] },
    exchanges: ['UK', 'Glasgow', 'Turkey', 'France', 'South Africa', 'Namibia', 'Mauritius', 'Switzerland'],
    artFairs: [
      { name: 'FNB Joburg Art Fair', since: '2015' },
      { name: 'Investec Cape Town Art Fair', since: '2017' },
      { name: '1:54 London', year: '2016' },
      { name: 'Armory Show', year: '2016' },
      { name: 'RMB Latitude Online', year: '2024' },
    ],
    schoolProgrammes:
      'Artists give art lessons and mini art camps in schools, and schools visit the space.',
  },
  faq: [],
  locations: [
    { name: 'Harare', address: '1 Rowland Square, Milton Park' },
    { name: 'Mutare', address: '999 Mount Wolseley / Drifters, Mutare Road' },
  ],
  hours: [
    { days: 'Monday', hours: 'By appointment only' },
    { days: 'Tuesday to Friday', hours: '9am to 5pm' },
    { days: 'Saturday', hours: '9am to 12:00' },
    { days: 'Sunday', hours: 'Closed' },
    { days: 'Public holidays', hours: 'Closed' },
  ],
  contact: {
    email: 'villageunhu@gmail.com',
    phones: ['+263 774 630 656', '+263 772 751 455'],
    // Temporary WhatsApp default until the owner confirms the contacts.
    whatsappDefaultNumber: '263772751455',
    socials: [
      {
        label: 'Facebook',
        href: 'https://www.facebook.com/villageunhu.villageunhu',
        confirmed: true,
      },
      { label: 'Instagram', href: '', confirmed: false },
    ],
  },
  contactTopics: ['Studios', 'Residency', 'Exhibitions', 'Something else'],
  defaultContactTopic: 'Studios',
  whatsappMessages: [
    {
      id: 'studios',
      label: 'Studio space',
      message: 'Hi Village Unhu, I would like to ask about the studio space.',
    },
    {
      id: 'residency',
      label: 'Residency',
      message: 'Hi Village Unhu, I would like to ask about the residency.',
    },
    {
      id: 'exhibitions',
      label: 'Exhibitions',
      message: 'Hi Village Unhu, I would like to ask about exhibitions.',
    },
    {
      id: 'general',
      label: 'General enquiry',
      message: 'Hi Village Unhu, I would like to get in touch.',
    },
  ],
  longTable: {
    title: 'The long table',
    description: 'The long table is a monthly gathering.',
    cta: 'Get in touch',
    href: '/?topic=Something%20else#contact',
  },
  thisWeek: {
    labels: ['Artwork of the week', 'Artist of the month', 'Artists in residency'],
    items: [],
  },
  futureProjects: { enabled: false, items: [] },
};

export const navItems = site.nav;
export const heroContent = site.hero;
export const studioCards = site.studios.cards;
export const residencyContent = site.residency;
export const exhibitionList = site.exhibitions.items;
export const workshopList = site.workshops;
export const galleryItems = site.gallery.items;
export const faqItems = site.faq;
export const visitInfo = { locations: site.locations, hours: site.hours };
export const teamMembers = [];
export const testimonialList = [];
export const supportOptions = [];
export const artistList = [];
export const longTableInfo = site.longTable;
export const contactInfo = {
  ...site.contact,
  whatsapp: site.contact.whatsappDefaultNumber,
};
export const whatsappMessages = site.whatsappMessages;

export default site;
