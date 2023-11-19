CONFIG.VauxsChatEnhancements = {};

// ==== Run on Startup ====
import "./lib/getSpeakerOverride.js";
import "./lib/settings.js";

import ArchiveApplication from "./view/Archive/ArchiveApp.js";
import NewArchiveApplication from "./view/Archive/CreateNewArchive/NewArchive.js";
import ChatArchiver from "./lib/chatArchiver.js";
CONFIG.VauxsChatEnhancements.ArchiveApplication = ArchiveApplication;
CONFIG.VauxsChatEnhancements.NewArchiveApplication = NewArchiveApplication;
CONFIG.VauxsChatEnhancements.ChatArchiver = ChatArchiver;

import "./view/ChatControls/Wrapper.js";

