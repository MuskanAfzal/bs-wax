export const homepageDefaults = {
  heroHeading: 'A little buzz.\nA whole new feeling.',
  heroEyebrow: 'MOBILE INTERIOR DETAILING / HOUSTON, TX',
  heroButton: 'Find your fresh start',
  beforeImage: '/images/interior-before.png',
  afterImage: '/images/interior.jpg',
  comparisonTitle: 'The interior reset',
  comparisonNote: 'Illustrative comparison: AI-edited mess matched to a clean reference. Not a completed customer job.',
  experienceHeading: 'You know that\nnew-car feeling?',
  experienceIntro: 'Let’s get you a little closer to it. Slide into the difference a fresh interior can make.',
  experienceTitle: 'Same ride.\nDifferent energy.',
  experienceBody: 'Morning coffee runs. School pickups. Weekend escapes. Life leaves a little behind. A thoughtful detail gives you room to enjoy the drive again.',
  servicesHeading: 'A little care.\nOr the whole hive.',
  servicesIntro: 'Choose your starting point. We’ll confirm the right service and quote for your vehicle.',
  storyImage: '/images/drive.jpg',
  storyImageAlt: 'A parked sports car in warm afternoon light',
  storyHeading: 'You stay.\nWe swarm in.',
  storyBody: 'No waiting rooms. No rearranging your day around a car wash. Tell us where you are, and let’s bring a fresh feeling to your driveway.',
  faqHeading: 'Curious?\nBee our guest.',
  ctaHeading: 'Let’s get your\nfresh start buzzing.',
  ctaButton: 'Bring the hive to me',
  footerText: 'Small details.\nA whole new feeling.'
};
export const homepageImages = ['beforeImage', 'afterImage', 'storyImage'];
export function publishedImage(site, path) {
  return site.portfolio.some(p => p.before === path || p.after === path) || homepageImages.some(key => site.homepage?.[key] === path);
}
