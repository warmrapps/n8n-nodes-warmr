import {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
} from "n8n-workflow";
import { ContactsService } from "../services/ContactsService";
import type { ContactInput, ContactSearchQuery } from "../types/contact.types";

export class Contacts implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Warmr Contacts",
    name: "warmrContacts",
    group: ["transform"],
    version: 1,
    description: "Manage Warmr contacts via the v1 API",
    defaults: { name: "Warmr Contacts", color: "#e4d103" },
    icon: "file:icon.png",
    inputs: ["main"] as any,
    outputs: ["main"] as any,
    credentials: [{ name: "warmrApi", required: true }],
    properties: [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        options: [
          { name: "List Contacts", value: "listContacts" },
          { name: "Get Contact", value: "getContact" },
          { name: "Create Contact", value: "createContact" },
          { name: "Update Contact", value: "updateContact" },
          { name: "Delete Contact", value: "deleteContact" },
        ],
        default: "listContacts",
        description: "Operation to perform",
      },

      // --- List Contacts filters ---
      {
        displayName: "Page",
        name: "page",
        type: "number",
        default: 1,
        displayOptions: { show: { operation: ["listContacts"] } },
        description: "Page number (default: 1)",
      },
      {
        displayName: "Per Page",
        name: "perPage",
        type: "number",
        default: 50,
        displayOptions: { show: { operation: ["listContacts"] } },
        description: "Results per page (max 100)",
      },
      {
        displayName: "Search",
        name: "search",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["listContacts"] } },
        description: "Search by first name, last name, or email",
      },
      {
        displayName: "List UUID",
        name: "listUuid",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["listContacts"] } },
        description: "Filter by list UUID",
      },
      {
        displayName: "Archived",
        name: "archived",
        type: "boolean",
        default: false,
        displayOptions: { show: { operation: ["listContacts"] } },
        description: "Whether to filter archived contacts",
      },
      {
        displayName: "Is Favorite",
        name: "isFavorite",
        type: "boolean",
        default: false,
        displayOptions: { show: { operation: ["listContacts"] } },
        description: "Whether to filter favorite contacts only",
      },

      // --- Get / Update / Delete by UUID ---
      {
        displayName: "Contact UUID",
        name: "uuid",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
          show: { operation: ["getContact", "updateContact", "deleteContact"] },
        },
        description: "UUID of the contact",
      },

      // --- Create / Update fields ---
      {
        displayName: "First Name",
        name: "firstName",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["createContact", "updateContact"] } },
      },
      {
        displayName: "Last Name",
        name: "lastName",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["createContact", "updateContact"] } },
      },
      {
        displayName: "Email",
        name: "email",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["createContact", "updateContact"] } },
      },
      {
        displayName: "Phone",
        name: "phone",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["createContact", "updateContact"] } },
      },
      {
        displayName: "Website",
        name: "website",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["createContact", "updateContact"] } },
      },
      {
        displayName: "Headline",
        name: "headline",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["createContact", "updateContact"] } },
      },
      {
        displayName: "Location",
        name: "location",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["createContact", "updateContact"] } },
      },
      {
        displayName: "Country ISO",
        name: "countryIso",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["createContact", "updateContact"] } },
        description: "2-letter ISO country code",
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = (await this.getCredentials("warmrApi")) as { apiKey: string };

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter("operation", i) as string;

      try {
        if (operation === "listContacts") {
          const result = await handleListContacts.call(this, i, credentials.apiKey);
          returnData.push({ json: result } as INodeExecutionData);
        } else if (operation === "getContact") {
          const uuid = this.getNodeParameter("uuid", i) as string;
          const contact = await ContactsService.getContact(uuid, credentials.apiKey);
          returnData.push({ json: contact } as INodeExecutionData);
        } else if (operation === "createContact") {
          const data = buildContactInput.call(this, i);
          const contact = await ContactsService.createContact(data, credentials.apiKey);
          returnData.push({ json: contact } as INodeExecutionData);
        } else if (operation === "updateContact") {
          const uuid = this.getNodeParameter("uuid", i) as string;
          const data = buildContactInput.call(this, i);
          const contact = await ContactsService.updateContact(uuid, data, credentials.apiKey);
          returnData.push({ json: contact } as INodeExecutionData);
        } else if (operation === "deleteContact") {
          const uuid = this.getNodeParameter("uuid", i) as string;
          await ContactsService.deleteContact(uuid, credentials.apiKey);
          returnData.push({ json: { success: true, uuid } } as INodeExecutionData);
        }
      } catch (error: any) {
        returnData.push({ json: { error: error.message } } as INodeExecutionData);
      }
    }

    return this.prepareOutputData(returnData);
  }
}

async function handleListContacts(
  this: IExecuteFunctions,
  i: number,
  apiKey: string,
) {
  const query: ContactSearchQuery = {};
  const page = this.getNodeParameter("page", i) as number;
  const perPage = this.getNodeParameter("perPage", i) as number;
  const search = this.getNodeParameter("search", i) as string;
  const listUuid = this.getNodeParameter("listUuid", i) as string;
  const archived = this.getNodeParameter("archived", i) as boolean;
  const isFavorite = this.getNodeParameter("isFavorite", i) as boolean;

  if (page) query.page = page;
  if (perPage) query.per_page = perPage;
  if (search) query.search = search;
  if (listUuid) query.list_uuid = listUuid;
  if (archived) query.archived = archived;
  if (isFavorite) query.is_favorite = isFavorite;

  return ContactsService.getContacts(query, apiKey);
}

function buildContactInput(this: IExecuteFunctions, i: number): ContactInput {
  const fields = [
    "firstName", "lastName", "email", "phone",
    "website", "headline", "location", "countryIso",
  ] as const;

  const data: Record<string, string> = {};
  for (const field of fields) {
    const value = this.getNodeParameter(field, i, "") as string;
    if (value) data[field] = value;
  }

  return data as unknown as ContactInput;
}

export default Contacts;
