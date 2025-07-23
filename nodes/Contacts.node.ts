import {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from "n8n-workflow";
import { ContactsService } from "../services/ContactsService";
import type {
  Contact,
  ContactSearchQuery,
} from "../types/contact.types";

export class Contacts implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Warmr Contacts",
    name: "contacts",
    group: ["transform"],
    version: 1,
    description: "Manage Warmr contacts",
    defaults: {
      name: "Warmr Contacts",
      color: "#e4d103",
    },
    icon: "file:icon.png",
    inputs: ["main"] as any,
    outputs: ["main"] as any,
    credentials: [
      {
        name: "warmrApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        options: [
          { name: "Get Contacts", value: "getContacts" },
          { name: "Create Contact", value: "createContact" },
          { name: "Update Contact", value: "updateContact" },
          { name: "Delete Contact", value: "deleteContact" },
        ],
        default: "getContacts",
        description: "Operation to perform",
      },
      // Add additional fields for each operation below
      {
        displayName: "List UUID",
        name: "listUuid",
        type: "string",
        default: "",
        displayOptions: {
          show: { operation: ["getContacts"] },
        },
        description: "Filter contacts by list UUID",
      },
      {
        displayName: "UUID",
        name: "uuid",
        type: "string",
        default: "",
        displayOptions: {
          show: { operation: ["getContacts"] },
        },
        description: "Filter by contact UUID",
      },
      {
        displayName: "Sort Key",
        name: "sortKey",
        type: "string",
        default: "",
        displayOptions: {
          show: { operation: ["getContacts"] },
        },
        description: "Field to sort by",
      },
      {
        displayName: "Sort Direction",
        name: "sortDirection",
        type: "options",
        options: [
          { name: "Ascending", value: "asc" },
          { name: "Descending", value: "desc" },
        ],
        default: "asc",
        displayOptions: {
          show: { operation: ["getContacts"] },
        },
        description: "Sort direction",
      },
      {
        displayName: "Filters (Advanced)",
        name: "filters",
        type: "string",
        default: "",
        displayOptions: {
          show: { operation: ["getContacts"] },
        },
        description: "Advanced filter string",
      },
      {
        displayName: "Contact Data",
        name: "contactData",
        type: "json",
        default: "{}",
        displayOptions: {
          show: { operation: ["createContact", "updateContact"] },
        },
        description: "Contact data as JSON",
      },
      {
        displayName: "Identifier",
        name: "identifier",
        type: "json",
        default: "{}",
        displayOptions: {
          show: { operation: ["updateContact", "deleteContact"] },
        },
        description: "Identifier (uuid, linkedin_id, or email) as JSON",
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];
    const credentials = (await this.getCredentials("warmrApi")) as {
      apiKey: string;
    };
    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter("operation", i) as string;
      try {
        if (operation === "getContacts") {
          const filters: ContactSearchQuery = {};
          
          // Build filters object from individual fields
          const listUuid = this.getNodeParameter("listUuid", i) as string;
          if (listUuid) filters.listUuid = listUuid;
          
          const pipelineStageUuid = this.getNodeParameter("pipelineStageUuid", i) as string;
          if (pipelineStageUuid) filters.pipelineStageUuid = pipelineStageUuid;
          
          const uuid = this.getNodeParameter("uuid", i) as string;
          if (uuid) filters.uuid = uuid;
          
          const entityUrn = this.getNodeParameter("entityUrn", i) as string;
          if (entityUrn) filters.entityUrn = entityUrn;
          
          const objectUrn = this.getNodeParameter("objectUrn", i) as string;
          if (objectUrn) filters.objectUrn = objectUrn;
          
          const archived = this.getNodeParameter("archived", i) as boolean;
          filters.archived = archived;
          
          const sortKey = this.getNodeParameter("sortKey", i) as string;
          if (sortKey) filters.sortKey = sortKey;
          
          const sortDirection = this.getNodeParameter("sortDirection", i) as "asc" | "desc";
          if (sortDirection) filters.sortDirection = sortDirection;
          
          const advancedFilters = this.getNodeParameter("filters", i, "") as string;
          if (advancedFilters) filters.filters = advancedFilters;
          
          const raw = this.getNodeParameter("raw", i) as boolean;
          filters.raw = raw;
          
          const contacts = await ContactsService.getContacts(
            filters,
            credentials.apiKey
          );
          
          // Debug: Check what we actually got back
          if (!Array.isArray(contacts)) {
            throw new Error(`Expected array but got: ${typeof contacts}. Value: ${JSON.stringify(contacts)}`);
          }
          
          returnData.push(...contacts.map((c) => ({ json: c as IDataObject })));
        } else if (operation === "createContact") {
          const data = JSON.parse(
            this.getNodeParameter("contactData", i) as unknown as string
          ) as { linkedin_id: string } & Partial<Contact>;
          if (!data.linkedin_id) throw new Error("linkedin_id is required");
          const contact = await ContactsService.createContact(
            data,
            credentials.apiKey
          );
          returnData.push({ json: contact as IDataObject });
        } else if (operation === "updateContact") {
          const identifier = JSON.parse(
            this.getNodeParameter("identifier", i) as unknown as string
          ) as unknown as {
            linkedin_id?: string;
            email?: string;
            uuid?: string;
          };
          const data = JSON.parse(
            this.getNodeParameter("contactData", i) as unknown as string
          ) as Partial<Contact>;
          const contact = await ContactsService.updateContact(
            identifier,
            data,
            credentials.apiKey
          );
          returnData.push({ json: contact as IDataObject });
        } else if (operation === "deleteContact") {
          const identifier = JSON.parse(
            this.getNodeParameter("identifier", i) as unknown as string
          ) as unknown as {
            linkedin_id?: string;
            email?: string;
            uuid?: string;
          };
          await ContactsService.deleteContact(identifier, credentials.apiKey);
          returnData.push({
            json: { success: true, ...identifier } as IDataObject,
          });
        }
      } catch (error: any) {
        returnData.push({ json: { error: error.message } as IDataObject });
      }
    }
    return this.prepareOutputData(returnData);
  }
}

export default Contacts;
