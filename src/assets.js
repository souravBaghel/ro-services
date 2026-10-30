import heroMain from "./assets/hero-main.png";
import about from "./assets/about.png";
import serviceInstall from "./assets/service-cleaning.jpg";
import serviceFilters from "./assets/service-filters.jpg";
import serviceCleaning from "./assets/deep-clening.jpg";
import serviceRepair from "./assets/service-install.png";
import teamOne from "./assets/team-one.svg";
import teamTwo from "./assets/team-two.svg";
import teamThree from "./assets/team-three.svg";
import phone from "./assets/phone.svg";
import truck from "./assets/truck.svg";
import thumbsUp from "./assets/thumbs-up.svg";

const icon = (drawing) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#146b58" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${drawing}</svg>`)}`;

const checkIcon = `data:image/svg+xml,${encodeURIComponent('<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.33299 2.5L3.75012 7.083L1.66699 4.99982" stroke-width="2" stroke-linecap="round" stroke="#0D5C4C"/></svg>')}`;


export const assets = {
  heroBg: heroMain,
  heroMain,
  about,
  whatsapp: icon('<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M9 8.5c.4 2.7 2 4.3 4.7 5"/>'),
  service: [serviceInstall, serviceFilters, serviceCleaning, serviceRepair],
  team: [teamOne, teamTwo, teamThree],
  icons: {
    check: checkIcon,
    responseFrame: icon('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    wrench: icon('<path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4L14 12l-2-2Z"/>'),
    bolt: icon('<path d="m13 2-3 9h6l-5 11 1-9H6l7-11Z"/>'),
    brush: icon('<path d="m14 4 6 6M4 20l8.5-8.5M11 5l8 8-4 4-8-8Z"/><path d="M4 20c2.5 0 4-1.5 4-4"/>'),
    sparkles: icon('<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>'),
    phone,
    truck,
    thumbsUp,
   
  },
};
