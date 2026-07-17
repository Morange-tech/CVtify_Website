import LetterTemplate1 from "../components/letter_templates/LetterTemplate1";
import LetterTemplate2 from "../components/letter_templates/LetterTemplate2";
import LetterTemplate3 from "../components/letter_templates/LetterTemplate3";
import LetterTemplate4 from "../components/letter_templates/LetterTemplate4";
import LetterTemplate5 from "../components/letter_templates/LetterTemplate5";

export const letterTemplateComponents = {
  1: LetterTemplate1,
  2: LetterTemplate2,
  3: LetterTemplate3,
  4: LetterTemplate4,
  5: LetterTemplate5,
};

// Fixed catalog of the 5 real letter designs, shared by the in-builder
// "Choisir un modele" picker and the public /motivation-letters gallery.
export const LETTER_TEMPLATE_LIST = [
  { id: 1, name: "Elegant Editorial" },
  { id: 2, name: "Corporate Header" },
  { id: 3, name: "Split-Column Editorial" },
  { id: 4, name: "Two-Tone Banner" },
  { id: 5, name: "Classic Formal Serif" },
];

// Representative placeholder content so thumbnails/previews aren't blank.
export const SAMPLE_LETTER_DATA = {
  senderInfo: {
    firstName: "Jane",
    lastName: "Doe",
    title: "Chef de Projet",
    email: "jane.doe@email.com",
    phone: "06 12 34 56 78",
    address: "12 rue de la Paix",
    city: "Paris",
    date: "1 janvier 2026",
  },
  recipientInfo: {
    firstName: "",
    lastName: "",
    contact: "Responsable Recrutement",
    company: "Entreprise SAS",
    position: "",
    address: "",
    city: "",
  },
  subject: "Candidature au poste propose",
  opening: "Madame, Monsieur,",
  body: "<p>Fort de mon experience professionnelle, je vous propose ma candidature pour ce poste. Mes competences et ma motivation seront des atouts pour votre equipe.</p>",
  closing: "",
  signature: { signature: "", signatureType: null },
};
