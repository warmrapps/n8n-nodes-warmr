import Contacts from "./nodes/Contacts.node";
import Lists from "./nodes/Lists.node";
import Companies from "./nodes/Companies.node";
import Tags from "./nodes/Tags.node";
import Pipelines from "./nodes/Pipelines.node";
import WarmrApi from "./credentials/WarmrApi.credentials";

export const nodeTypes = [Contacts, Lists, Companies, Tags, Pipelines];
export const credentialTypes = [WarmrApi];
