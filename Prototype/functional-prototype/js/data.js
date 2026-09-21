// =========================================================
// BORROWED EYES
// Seed Data
// =========================================================

export const artworks = [
  {
    id: "artwork-001",

    title: "Six-fold screen with scenes from Genji Monogatari (Tale of Genji)",

    fullImage: "assets/images/artworks/card1ans.jpg",

    display: {
      location: "Card display area",
      room: "",
    },

    artistContext: {
      artist: "Unknown",
      culture: "Japan",
      date: "18th century",
      origin: "Japan",

      medium:
        "Gold leaf, ink and tempera on paper, mounted on a wooden six-fold screen",

      text: "This six-fold screen illustrates scenes from The Tale of Genji, one of Japan’s most famous classical literary works. Folding screens, or byōbu, were both decorative artworks and practical objects used to divide interior spaces. Their wide format allowed several scenes, figures and architectural details to be viewed as one continuous visual story.",

      collection:
        "QAGOMA Asian Art Collection · Gift of James Fairfax AC, 2018.",
    },
  },

  {
    id: "artwork-002",

    title: "The sitting",

    fullImage: "assets/images/artworks/card2ans.jpg",

    display: {
      location: "Card display area",
      room: "",
    },

    artistContext: {
      artist: "Girolamo Nerli",

      culture: "Sydney, Australia",

      date: "1889",

      origin: "Sydney, Australia",

      medium: "Oil on canvas",

      text: "Nerli presents an elegantly dressed woman inside his Sydney studio. The painting includes Japanese screens, fans, decorative fabrics and other objects that reflect the late nineteenth-century Australian interest in Japanese and “Oriental” design. The work is therefore not only a portrait of the woman, but also a portrait of the artist’s studio and the cultural tastes of the period.",

      collection: "QAGOMA Australian Art Collection.",
    },
  },

  {
    id: "artwork-003",

    title: "Madonna and Child encircled by flowers and fruit",

    fullImage: "assets/images/artworks/card3ans.jpg",

    display: {
      location: "Card display area",
      room: "",
    },

    artistContext: {
      artist:
        "Attributed to Andries Daniels · Madonna and Child by the studio of Frans Francken the Younger",

      culture: "Antwerp",

      date: "c.1615",

      origin: "Antwerp",

      medium: "Oil on oak panel",

      text: "This painting combines a religious image of the Madonna and Child with an elaborate garland of flowers and fruit. In seventeenth-century Antwerp, paintings were sometimes created collaboratively, with different artists specialising in figures, flowers or still-life details. This work brings these different specialities together in one image.",

      collection: "QAGOMA International Art Collection.",
    },
  },

  {
    id: "artwork-004",

    title: "Hamilton Reach, Brisbane",

    fullImage: "assets/images/artworks/card4ans.jpg",

    display: {
      location: "Card display area",
      room: "",
    },

    artistContext: {
      artist: "Isaac Walter Jenner",

      culture: "Brisbane, Australia",

      date: "1885",

      origin: "Brisbane, Australia",

      medium: "Oil on wood panel",

      text: "Jenner painted boats travelling along the Brisbane River towards Newstead, including sailing, steam and rowing vessels. The warm afternoon light creates a calm and peaceful atmosphere, presenting the river away from the busier wharves and city centre. The painting was completed only two years after Jenner arrived in Brisbane.",

      collection: "QAGOMA Australian Art Collection.",
    },
  },

  {
    id: "artwork-005",

    title: "Morumbeeja Pitoa (Floods and moonlight)",

    fullImage: "assets/images/artworks/card5ans.png",

    display: {
      location: "Card display area",
      room: "",
    },

    artistContext: {
      artist: "Lin Onus",

      culture: "Australia",

      date: "1993",

      origin: "Australia",

      medium: "Oil on canvas",

      text: "This painting shows Barmah Forest, the artist’s ancestral country, flooded under moonlight. The reflected trees and clouds create a quiet, dream-like landscape, while the fish below the water are decorated with rarrk, a traditional cross-hatching technique that Onus learned in Arnhem Land. By combining Western realist landscape painting with Aboriginal visual traditions, Onus reminds viewers that this landscape is Aboriginal land.",

      collection:
        "Queensland Art Gallery | Gallery of Modern Art Collection · Purchased 1995 with funds from the Queensland Art Gallery Foundation.",
    },
  },

  {
    id: "artwork-006",

    title: "Four-fold lacquer screen",

    fullImage: "assets/images/artworks/card6ans.jpg",

    display: {
      location: "Card display area",
      room: "",
    },

    artistContext: {
      artist: "Unknown",

      culture: "East Asia",

      date: "20th century",

      origin: "East Asia",

      medium: "Timber with lacquer decoration",

      text: "This folding screen combines furniture and decorative art. Its dark lacquered surface is decorated with brightly coloured and gold motifs, including plants, animals and architectural scenes. Folding screens were used to divide interior spaces while also providing a large decorative surface, allowing several small scenes to be viewed together as one object.",

      collection: "QAGOMA Asian Art Collection.",
    },
  },
];

// =========================================================
// Seed Experiences
// =========================================================

export const seedExperiences = [
  {
    id: "experience-001",
    artworkId: "artwork-001",

    fragmentImage: "assets/images/fragments/card1.jpg",

    clue1: "Look for a scene that feels like a quiet indoor moment.",

    clue2: "Look closely at the objects near a seated person.",

    previousView: "Simple, rustic, and exotic eerie",

    anonymousLabel: "Anonymous visitor",
  },

  {
    id: "experience-002",
    artworkId: "artwork-002",

    fragmentImage: "assets/images/fragments/card2.jpg",

    clue1: "Beautiful woman",

    clue2: "Look at her shoulder",

    previousView: "Mysterious and magnificent is really enjoying the moment",

    anonymousLabel: "Anonymous visitor",
  },

  {
    id: "experience-003",
    artworkId: "artwork-003",

    fragmentImage: "assets/images/fragments/card3.jpg",

    clue1: "A small white figure appears above the main scene.",

    clue2: "Look above the people, among flowers and fruit.",

    previousView: "So free that it is deeply alluring",

    anonymousLabel: "Anonymous visitor",
  },

  {
    id: "experience-004",
    artworkId: "artwork-004",

    fragmentImage: "assets/images/fragments/card4.jpg",

    clue1: "Look above the people, among flowers and fruit.",

    clue2:
      "This is a large landscape painting. Take a look at the lower left corner of it.",

    previousView: "peaceful and lonely",

    anonymousLabel: "Anonymous visitor",
  },

  {
    id: "experience-005",
    artworkId: "artwork-005",

    fragmentImage: "assets/images/fragments/card5.jpg",

    clue1: "Black and White",

    clue2: "The only animal in the whole printing",

    previousView: "Abstract and",

    anonymousLabel: "Anonymous visitor",
  },

  {
    id: "experience-006",
    artworkId: "artwork-006",

    fragmentImage: "assets/images/fragments/card6.jpg",

    clue1: "A beautiful land",

    clue2: "people with blue shirt",

    previousView: "The dog",

    anonymousLabel: "Anonymous visitor",
  },
];

// =========================================================
// Helpers
// =========================================================

export function getArtworkById(artworkId) {
  return artworks.find((artwork) => artwork.id === artworkId) ?? null;
}

export function getSeedExperienceById(experienceId) {
  return (
    seedExperiences.find((experience) => experience.id === experienceId) ?? null
  );
}
