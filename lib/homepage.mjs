export const homepageDefaults = {
  bookingEyebrow: 'MOBILE INTERIOR DETAILING', bookingHeading: 'Request an interior\ndetail.',
  logoImage: '',
  heroHeading: 'Mobile Interior\nDetailing.',
  heroEyebrow: 'FULLY MOBILE — WE COME TO YOU',
  heroButton: 'View availability & book',
  beforeImage: '/images/interior-before.png',
  afterImage: '/images/interior.jpg',
  comparisonTitle: 'The interior reset',
  comparisonNote: 'Illustrative comparison: AI-edited mess matched to a clean reference. Not a completed customer job.',
  experienceHeading: 'Give your car\na spa day.',
  experienceIntro: 'Interior detailing at your location, with packages tailored to your vehicle’s size and condition.',
  experienceTitle: 'Premium care.\nAt your doorstep.',
  experienceBody: 'Choose maintenance care, a deeper reset or a full interior detail. Packages begin at $95, with extra treatments available for pet hair, stains and odors.',
  servicesHeading: 'Three simple\noptions.',
  servicesIntro: 'Choose your reset. Final pricing varies by vehicle size and condition.',
  storyImage: '/images/drive.jpg',
  storyImageAlt: 'A parked sports car in warm afternoon light',
  storyHeading: 'Pick a time.\nWe handle the rest.',
  storyBody: 'Check available times in Koalendar, choose your service and tell us about your interior. Pricing is confirmed based on vehicle size and condition; photos may be requested.',
  faqHeading: 'Questions\nbefore booking?',
  ctaHeading: 'Ready for\nyour spa day?',
  ctaButton: 'View availability & book',
  footerText: 'Mobile interior detailing.\nWe come to you.',
  navExperience: 'Interior care', navBuilder: 'Build my estimate', navServices: 'Packages', navAddons: 'Add-ons', navBooking: 'Book now',
  heroSecondary: 'See before & after', heroVisualLabel: 'MOBILE INTERIOR DETAILING / 001', heroTagline: 'Premium interior care.', heroTaglineDetail: 'Fully mobile — we come to you.', heroRevealLabel: 'SLIDE TO COMPARE', heroBottom: 'INTERIOR PACKAGES FROM $95', heroScroll: 'CHOOSE YOUR RESET',
  tickerLead: 'MOBILE INTERIOR', tickerAccent: 'DETAILING.', tickerTail: 'WE COME TO YOU.',
  experienceEyebrow: '01 / MOBILE INTERIOR CARE', experienceKicker: 'GIVE YOUR CAR A SPA DAY', benefitOneTitle: 'Packages for your interior', benefitOneBody: 'Maintenance, deep cleaning or full interior care.', benefitTwoTitle: 'Fully mobile service', benefitTwoBody: 'Interior detailing brought directly to you.', experienceButton: 'Build your estimate',
  servicesEyebrow: '03 / CHOOSE YOUR RESET', serviceButton: 'Request this package', servicesNote: 'No payment to request. Final scope, price and availability confirmed before booking.',
  addonsEyebrow: 'MAKE IT YOURS', addonsHeading: 'Add-ons &\nextra care.', addonsIntro: 'Add these when your interior needs a little more attention. Final pricing depends on condition and labor needed.', addonsNote: 'Severely soiled interior? A quote is required. Mention your preferred add-ons in your booking notes.',
  storyPhotoCaption: 'FULLY MOBILE — WE COME TO YOU', storyEyebrow: 'AVAILABILITY & BOOKING', storyStepOneTitle: 'Choose your time', storyStepOneBody: 'Check available appointment times in Koalendar.', storyStepTwoTitle: 'Share your vehicle details', storyStepTwoBody: 'Choose a service and tell us what your interior needs.', storyStepThreeTitle: 'Confirm final details', storyStepThreeBody: 'Pricing depends on vehicle size and condition. Photos may be requested.', storyButton: 'Send a detail request',
  portfolioEyebrow: 'REAL B’S WAX RESULTS', portfolioHeading: 'Swipe through\nthe difference.', portfolioIntro: 'Actual before-and-after interiors completed by B’s Wax.',
  faqEyebrow: 'BEFORE YOUR APPOINTMENT', faqIntro: 'Have a question before booking?', faqButton: 'Message B’s Wax on Instagram', ctaEyebrow: 'PREMIUM INTERIOR CARE, BROUGHT TO YOU.',
  footerInstagramLabel: '@bwax.autospa', footerBookingLabel: 'View availability & book', footerSmsLabel: 'Text B’s Wax', footerSignature: 'FULLY MOBILE INTERIOR DETAILING.', mobileBooking: 'View availability & book',
  builderHeading: 'Choose your package.\nBuild your receipt.', builderIntro: 'Select your vehicle, package and extra care. See an itemized estimate, download it, or carry it into your booking request.', builderEyebrow: '02 / BUILD YOUR ESTIMATE',
  builderVehicleHeading: 'Choose your vehicle', builderVehicleHint: 'Final pricing depends on size and condition.', builderConditionHeading: 'How is your interior?', builderConditionHint: 'Severely soiled interiors require a custom quote.', builderPackageHeading: 'Choose your interior package', builderPackageHint: 'Starting prices from B’s Wax’s service menu.', builderAddonsHeading: 'Add extra care', builderAddonsHint: 'Optional. Select only the treatments you need.', builderReceiptTitle: 'B’S WAX / ITEMIZED ESTIMATE', builderRequest: 'Request this detail', builderDownload: 'Download my estimate',
  orbitText: 'MOBILE INTERIOR DETAILING. WE COME TO YOU. ', builderQuantity: 'Quantity', builderNoExtras: 'No extra treatments are currently listed.', builderLive: 'UPDATING WITH YOU', builderDetailLabel: 'YOUR INTERIOR DETAIL', builderNoSelection: 'No add-ons selected', builderInclusions: 'Package inclusions', builderPreparation: 'Before we arrive', builderTotalLabel: 'ESTIMATED TOTAL', builderDisclaimer: 'Package prices start at the listed amount. Ranges cover selected add-ons; the final price may be higher based on vehicle size, condition and labor. No tax or unlisted fees calculated.', builderFootnote: 'Estimate only. No payment taken. Your itemized choices carry into booking.'

};
export const homepageImages = ['beforeImage', 'afterImage', 'storyImage', 'logoImage'];
export function publishedImage(site, path) {
  return site.portfolio.some(p => p.before === path || p.after === path) || homepageImages.some(key => site.homepage?.[key] === path);
}
