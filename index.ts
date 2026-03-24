import Contacts from "./nodes/Contacts.node";
import Lists from "./nodes/Lists.node";
import Companies from "./nodes/Companies.node";
import WarmrApi from "./credentials/WarmrApi.credentials";

export const nodeTypes = [Contacts, Lists, Companies];
export const credentialTypes = [WarmrApi];
