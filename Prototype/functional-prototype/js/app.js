import {
  seedExperiences,
  getArtworkById,
  getSeedExperienceById,
} from "./data.js";

import { saveMyView, saveContribution } from "./storage.js";

// =========================================================
// Screens
// =========================================================

const SCREENS = {
  START: "start",

  CHOOSE_FRAGMENT: "choose-fragment",

  FIND_ARTWORK: "find-artwork",

  CLUE_2: "clue-2",

  CONFIRM_ARTWORK: "confirm-artwork",

  MY_VIEW: "my-view",

  THEIR_VIEW: "their-view",

  LOOK_AGAIN: "look-again",

  ARTIST_CONTEXT: "artist-context",

  PASS_CHOICE: "pass-choice",

  CONTRIBUTION_PHOTOS: "contribution-photos",

  CONTRIBUTION_DETAILS: "contribution-details",

  COMPLETION: "completion",
};

const FRAGMENTS_PER_PAGE = 3;

// =========================================================
// State
// =========================================================

const state = {
  currentScreen: SCREENS.START,

  selectedExperienceId: null,

  selectedArtworkId: null,

  fragmentPage: 0,

  clue2Shown: false,

  myViewSubmitted: false,

  comparisonReaction: "",

  noticedReaction: "",

  contribution: {
    fragmentFile: null,
    fragmentPreviewUrl: "",

    artworkFile: null,
    artworkPreviewUrl: "",

    location: "",
  },
};

// =========================================================
// Screen navigation
// =========================================================

function showScreen(screenName) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.hidden = screen.dataset.screen !== screenName;
  });

  state.currentScreen = screenName;

  window.scrollTo({
    top: 0,
    behavior: "auto",
  });
}

// =========================================================
// Current data
// =========================================================

function getCurrentExperience() {
  if (!state.selectedExperienceId) {
    return null;
  }

  return getSeedExperienceById(state.selectedExperienceId);
}

function getCurrentArtwork() {
  if (!state.selectedArtworkId) {
    return null;
  }

  return getArtworkById(state.selectedArtworkId);
}

// =========================================================
// Fragment pagination
// =========================================================

function getFragmentPageCount() {
  return Math.max(1, Math.ceil(seedExperiences.length / FRAGMENTS_PER_PAGE));
}

function renderFragmentList() {
  const fragmentList = document.querySelector("#fragment-list");

  if (!fragmentList) {
    return;
  }

  fragmentList.innerHTML = "";

  const pageCount = getFragmentPageCount();

  state.fragmentPage = Math.min(Math.max(state.fragmentPage, 0), pageCount - 1);

  const startIndex = state.fragmentPage * FRAGMENTS_PER_PAGE;

  const visibleExperiences = seedExperiences.slice(
    startIndex,
    startIndex + FRAGMENTS_PER_PAGE,
  );

  visibleExperiences.forEach((experience, index) => {
    const card = document.createElement("button");

    card.type = "button";

    card.className = "fragment-card";

    card.dataset.experienceId = experience.id;

    const image = document.createElement("img");

    image.className = "fragment-card__image";

    image.src = experience.fragmentImage;

    image.alt = `Artwork fragment ${startIndex + index + 1}`;

    const content = document.createElement("span");

    content.className = "fragment-card__content";

    const title = document.createElement("span");

    title.className = "fragment-card__title";

    title.textContent = "Choose this fragment";

    const meta = document.createElement("span");

    meta.className = "fragment-card__meta";

    meta.textContent = "Anonymous visitor";

    content.append(title, meta);

    card.append(image, content);

    card.classList.toggle(
      "is-selected",
      state.selectedExperienceId === experience.id,
    );

    card.addEventListener("click", () => {
      selectExperience(experience.id);
    });

    fragmentList.appendChild(card);
  });

  updateFragmentPagination();
}

function updateFragmentPagination() {
  const pageCount = getFragmentPageCount();

  const previousButton = document.querySelector(
    '[data-action="previous-fragments"]',
  );

  const nextButton = document.querySelector('[data-action="next-fragments"]');

  const pageIndicator = document.querySelector("[data-fragment-page]");

  if (previousButton) {
    previousButton.disabled = state.fragmentPage === 0;
  }

  if (nextButton) {
    nextButton.disabled = state.fragmentPage >= pageCount - 1;
  }

  if (pageIndicator) {
    pageIndicator.textContent = `${state.fragmentPage + 1} / ${pageCount}`;
  }
}

function selectExperience(experienceId) {
  const experience = getSeedExperienceById(experienceId);

  if (!experience) {
    return;
  }

  state.selectedExperienceId = experience.id;

  state.selectedArtworkId = experience.artworkId;

  state.clue2Shown = false;

  state.myViewSubmitted = false;

  state.comparisonReaction = "";

  state.noticedReaction = "";

  document.querySelectorAll(".fragment-card").forEach((card) => {
    card.classList.toggle(
      "is-selected",
      card.dataset.experienceId === experience.id,
    );
  });

  const continueButton = document.querySelector(
    '[data-action="continue-fragment"]',
  );

  if (continueButton) {
    continueButton.disabled = false;
  }
}

// =========================================================
// Render current experience
// =========================================================

function renderCurrentExperience() {
  const experience = getCurrentExperience();

  const artwork = getCurrentArtwork();

  if (!experience || !artwork) {
    return;
  }

  setText("[data-field='clue-1']", experience.clue1);

  setText("[data-field='clue-2']", experience.clue2);

  setText("[data-field='previous-view']", experience.previousView);

  setImage(
    "[data-field='fragment-image']",
    experience.fragmentImage,
    "Selected artwork fragment",
  );

  setImage(
    "[data-field='artwork-image']",
    artwork.fullImage,
    "Selected artwork",
  );

  setText("[data-field='artwork-title']", artwork.title);

  setText("[data-field='artwork-location']", formatArtworkLocation(artwork));

  setText("[data-field='artist-name']", artwork.artistContext.artist);

  setText("[data-field='artwork-culture']", artwork.artistContext.culture);

  setText("[data-field='artwork-date']", artwork.artistContext.date);

  setText("[data-field='artwork-origin']", artwork.artistContext.origin);

  setText("[data-field='artwork-medium']", artwork.artistContext.medium);

  setText(
    "[data-field='artwork-collection']",
    artwork.artistContext.collection,
  );

  const contextText =
    artwork.artistContext.text ||
    "Artist context is not available in this prototype.";

  setText("[data-field='artist-context']", contextText);
}

// =========================================================
// Generic render helpers
// =========================================================

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value || "";
  });
}

function setImage(selector, source, altText = "") {
  document.querySelectorAll(selector).forEach((image) => {
    if (!source) {
      image.hidden = true;

      image.removeAttribute("src");

      return;
    }

    image.src = source;

    image.alt = altText;

    image.hidden = false;
  });
}

function formatArtworkLocation(artwork) {
  return [artwork.display.location, artwork.display.room]
    .filter(Boolean)
    .join(" · ");
}

// =========================================================
// My View
// =========================================================

function handleMyViewSubmit(event) {
  event.preventDefault();

  const experience = getCurrentExperience();

  const artwork = getCurrentArtwork();

  if (!experience || !artwork) {
    return;
  }

  const formData = new FormData(event.currentTarget);

  const text = String(formData.get("myView") || "").trim();

  const extraText = String(formData.get("myViewExtra") || "").trim();

  if (!text) {
    return;
  }

  const saved = saveMyView({
    experienceId: experience.id,

    artworkId: artwork.id,

    text,
    extraText,
  });

  if (!saved) {
    return;
  }

  state.myViewSubmitted = true;

  renderCurrentExperience();

  showScreen(SCREENS.THEIR_VIEW);
}

// =========================================================
// Their View reactions
// =========================================================

function handleReactionButton(button) {
  const group = button.dataset.reactionGroup;

  const value = button.dataset.reactionValue;

  if (!group || !value) {
    return;
  }

  document
    .querySelectorAll(`[data-reaction-group="${group}"]`)
    .forEach((reactionButton) => {
      reactionButton.classList.remove("is-selected");

      reactionButton.setAttribute("aria-pressed", "false");
    });

  button.classList.add("is-selected");

  button.setAttribute("aria-pressed", "true");

  if (group === "comparison") {
    state.comparisonReaction = value;
  }

  if (group === "noticed") {
    state.noticedReaction = value;
  }
}

// =========================================================
// Photo previews
// =========================================================

function handlePhotoSelection(type, input) {
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  if (type === "fragment") {
    revokePreviewUrl(state.contribution.fragmentPreviewUrl);

    state.contribution.fragmentFile = file;

    state.contribution.fragmentPreviewUrl = URL.createObjectURL(file);

    updateUploadPreview("fragment");
  }

  if (type === "artwork") {
    revokePreviewUrl(state.contribution.artworkPreviewUrl);

    state.contribution.artworkFile = file;

    state.contribution.artworkPreviewUrl = URL.createObjectURL(file);

    updateUploadPreview("artwork");
  }
}

function updateUploadPreview(type) {
  const isFragment = type === "fragment";

  const image = document.querySelector(
    isFragment ? "#fragment-upload-preview" : "#artwork-upload-preview",
  );

  const placeholder = document.querySelector(
    `[data-upload-placeholder="${type}"]`,
  );

  const previewUrl = isFragment
    ? state.contribution.fragmentPreviewUrl
    : state.contribution.artworkPreviewUrl;

  if (!image || !placeholder) {
    return;
  }

  if (previewUrl) {
    image.src = previewUrl;

    image.hidden = false;

    placeholder.hidden = true;
  } else {
    image.hidden = true;

    image.removeAttribute("src");

    placeholder.hidden = false;
  }
}

function revokePreviewUrl(url) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

// =========================================================
// Contribution
// =========================================================

function goToContributionDetails() {
  const locationInput = document.querySelector("#contribution-location");

  state.contribution.location = locationInput?.value.trim() || "";

  showScreen(SCREENS.CONTRIBUTION_DETAILS);
}

function handleContributionSubmit(event) {
  event.preventDefault();

  const experience = getCurrentExperience();

  const artwork = getCurrentArtwork();

  if (!experience || !artwork) {
    return;
  }

  const formData = new FormData(event.currentTarget);

  const clue1 = String(formData.get("clue1") || "").trim();

  const clue2 = String(formData.get("clue2") || "").trim();

  const view = String(formData.get("view") || "").trim();

  const anonymous = formData.get("anonymous") === "on";

  if (!clue1 || !view) {
    return;
  }

  const saved = saveContribution({
    sourceExperienceId: experience.id,

    sourceArtworkId: artwork.id,

    fragmentImageName: state.contribution.fragmentFile?.name || "",

    fullArtworkImageName: state.contribution.artworkFile?.name || "",

    location: state.contribution.location,

    clue1,
    clue2,
    view,
    anonymous,
  });

  if (!saved) {
    return;
  }

  setCompletionMessage("Your eyes have been passed on for a future visitor.");

  showScreen(SCREENS.COMPLETION);
}

function setCompletionMessage(message) {
  const element = document.querySelector("[data-completion-message]");

  if (element) {
    element.textContent = message;
  }
}

// =========================================================
// Actions
// =========================================================

function handleAction(action) {
  switch (action) {
    case "start":
      state.fragmentPage = 0;

      renderFragmentList();

      showScreen(SCREENS.CHOOSE_FRAGMENT);

      break;

    case "previous-fragments":
      if (state.fragmentPage > 0) {
        state.fragmentPage -= 1;

        renderFragmentList();
      }

      break;

    case "next-fragments":
      if (state.fragmentPage < getFragmentPageCount() - 1) {
        state.fragmentPage += 1;

        renderFragmentList();
      }

      break;

    case "continue-fragment":
      if (!state.selectedExperienceId) {
        return;
      }

      renderCurrentExperience();

      showScreen(SCREENS.FIND_ARTWORK);

      break;

    case "show-clue-2":
      state.clue2Shown = true;

      renderCurrentExperience();

      showScreen(SCREENS.CLUE_2);

      break;

    case "found-artwork":
      renderCurrentExperience();

      showScreen(SCREENS.CONFIRM_ARTWORK);

      break;

    case "not-this-artwork":
      showScreen(state.clue2Shown ? SCREENS.CLUE_2 : SCREENS.FIND_ARTWORK);

      break;

    case "confirm-artwork":
      showScreen(SCREENS.MY_VIEW);

      break;

    case "back-to-my-view":
      showScreen(SCREENS.MY_VIEW);

      break;

    case "continue-to-look-again":
      if (!state.myViewSubmitted) {
        return;
      }

      renderCurrentExperience();

      showScreen(SCREENS.LOOK_AGAIN);

      break;

    case "looked-again":
      showScreen(SCREENS.PASS_CHOICE);

      break;

    case "artist-context":
      renderCurrentExperience();

      showScreen(SCREENS.ARTIST_CONTEXT);

      break;

    case "skip-context":
      showScreen(SCREENS.PASS_CHOICE);

      break;

    case "continue-to-pass-choice":
      showScreen(SCREENS.PASS_CHOICE);

      break;

    case "start-contribution":
      showScreen(SCREENS.CONTRIBUTION_PHOTOS);

      break;

    case "skip-contribution":
      setCompletionMessage(
        "Your visit is complete. You chose not to leave a contribution this time.",
      );

      showScreen(SCREENS.COMPLETION);

      break;

    case "contribution-next":
      goToContributionDetails();

      break;

    case "restart":
      resetExperience();

      break;

    default:
      console.warn("Unknown action:", action);
  }
}

// =========================================================
// Reset
// =========================================================

function resetExperience() {
  revokePreviewUrl(state.contribution.fragmentPreviewUrl);

  revokePreviewUrl(state.contribution.artworkPreviewUrl);

  state.currentScreen = SCREENS.START;

  state.selectedExperienceId = null;

  state.selectedArtworkId = null;

  state.fragmentPage = 0;

  state.clue2Shown = false;

  state.myViewSubmitted = false;

  state.comparisonReaction = "";

  state.noticedReaction = "";

  state.contribution = {
    fragmentFile: null,
    fragmentPreviewUrl: "",

    artworkFile: null,
    artworkPreviewUrl: "",

    location: "",
  };

  document.querySelector("#my-view-form")?.reset();

  document.querySelector("#contribution-form")?.reset();

  const locationInput = document.querySelector("#contribution-location");

  if (locationInput) {
    locationInput.value = "";
  }

  const fragmentInput = document.querySelector("#fragment-upload");

  const artworkInput = document.querySelector("#artwork-upload");

  if (fragmentInput) {
    fragmentInput.value = "";
  }

  if (artworkInput) {
    artworkInput.value = "";
  }

  updateUploadPreview("fragment");

  updateUploadPreview("artwork");

  document.querySelectorAll(".reaction-button").forEach((button) => {
    button.classList.remove("is-selected");

    button.setAttribute("aria-pressed", "false");
  });

  const continueButton = document.querySelector(
    '[data-action="continue-fragment"]',
  );

  if (continueButton) {
    continueButton.disabled = true;
  }

  setCompletionMessage("Your visit is complete.");

  renderFragmentList();

  showScreen(SCREENS.START);
}

// =========================================================
// Events
// =========================================================

function setupEventListeners() {
  document.addEventListener("click", (event) => {
    const reactionButton = event.target.closest("[data-reaction-group]");

    if (reactionButton) {
      handleReactionButton(reactionButton);

      return;
    }

    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) {
      return;
    }

    handleAction(actionButton.dataset.action);
  });

  document
    .querySelector("#my-view-form")
    ?.addEventListener("submit", handleMyViewSubmit);

  document
    .querySelector("#contribution-form")
    ?.addEventListener("submit", handleContributionSubmit);

  document
    .querySelector("#fragment-upload")
    ?.addEventListener("change", (event) => {
      handlePhotoSelection("fragment", event.currentTarget);
    });

  document
    .querySelector("#artwork-upload")
    ?.addEventListener("change", (event) => {
      handlePhotoSelection("artwork", event.currentTarget);
    });
}

// =========================================================
// Initialise
// =========================================================

function init() {
  renderFragmentList();

  setupEventListeners();

  showScreen(SCREENS.START);
}

init();
