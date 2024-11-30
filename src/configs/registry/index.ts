import { FileNode } from "../../libs/fileSystem";
import SOFTWARE_REGISTRY from "./software";

const HLM_SYSTEM = { name: "SYSTEM", content: "" };
const HLM_SAM = { name: "SAM", content: "" };
const HLM_SECURITY = { name: "SECURITY", content: "" };
const HLM_SOFTWARE = {
  name: "SOFTWARE",
  content: JSON.stringify(SOFTWARE_REGISTRY),
};

const DEFAULT_REGISTRY = [
  HLM_SYSTEM,
  HLM_SAM,
  HLM_SECURITY,
  HLM_SOFTWARE,
] as FileNode[];

export default DEFAULT_REGISTRY;
