import { FileNode } from "../../libs/FileSystem";
import SOFTWARE_REGISTRY from "./software";
import USER_REGISTRY from "./user";

const HLM_SYSTEM = { name: "SYSTEM", content: "" };
const HLM_SAM = { name: "SAM", content: "" };
const HLM_SECURITY = { name: "SECURITY", content: "" };
const HLM_SOFTWARE = {
  name: "SOFTWARE",
  content: JSON.stringify(SOFTWARE_REGISTRY),
};

// to do: mvoe it somewher else
const HKCU = { name: "USER", content: JSON.stringify(USER_REGISTRY) };

const DEFAULT_REGISTRY = [
  HLM_SYSTEM,
  HLM_SAM,
  HLM_SECURITY,
  HLM_SOFTWARE,

  HKCU,
] as FileNode[];

export default DEFAULT_REGISTRY;
