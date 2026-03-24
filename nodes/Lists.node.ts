import {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
} from "n8n-workflow";
import { ListsService } from "../services/ListsService";
import type { ListInput, ListSearchQuery } from "../types/list.types";

export class Lists implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Warmr Lists",
    name: "warmrLists",
    group: ["transform"],
    version: 1,
    description: "Manage Warmr lists and list membership via the v1 API",
    defaults: { name: "Warmr Lists", color: "#e4d103" },
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
          { name: "List All Lists", value: "listLists" },
          { name: "Get List", value: "getList" },
          { name: "Create List", value: "createList" },
          { name: "Update List", value: "updateList" },
          { name: "Delete List", value: "deleteList" },
          { name: "Add Contacts to List", value: "addContacts" },
          { name: "Remove Contact from List", value: "removeContact" },
        ],
        default: "listLists",
        description: "Operation to perform",
      },

      // --- Pagination ---
      {
        displayName: "Page",
        name: "page",
        type: "number",
        default: 1,
        displayOptions: { show: { operation: ["listLists"] } },
      },
      {
        displayName: "Per Page",
        name: "perPage",
        type: "number",
        default: 50,
        displayOptions: { show: { operation: ["listLists"] } },
        description: "Results per page (max 100)",
      },

      // --- List UUID ---
      {
        displayName: "List UUID",
        name: "listUuid",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
          show: {
            operation: [
              "getList", "updateList", "deleteList",
              "addContacts", "removeContact",
            ],
          },
        },
        description: "UUID of the list",
      },

      // --- Create / Update fields ---
      {
        displayName: "Name",
        name: "name",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["createList", "updateList"] } },
        description: "List name (required for create, 1-255 chars)",
      },
      {
        displayName: "Description",
        name: "description",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["createList", "updateList"] } },
      },
      {
        displayName: "Icon",
        name: "icon",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["createList", "updateList"] } },
      },

      // --- Membership ---
      {
        displayName: "Contact UUIDs",
        name: "contactUuids",
        type: "string",
        default: "",
        required: true,
        displayOptions: { show: { operation: ["addContacts"] } },
        description: "Comma-separated contact UUIDs to add",
      },
      {
        displayName: "Contact UUID",
        name: "contactUuid",
        type: "string",
        default: "",
        required: true,
        displayOptions: { show: { operation: ["removeContact"] } },
        description: "UUID of the contact to remove from the list",
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
        if (operation === "listLists") {
          const query: ListSearchQuery = {};
          const page = this.getNodeParameter("page", i) as number;
          const perPage = this.getNodeParameter("perPage", i) as number;
          if (page) query.page = page;
          if (perPage) query.per_page = perPage;
          const result = await ListsService.getLists(query, credentials.apiKey);
          returnData.push({ json: result } as INodeExecutionData);
        } else if (operation === "getList") {
          const uuid = this.getNodeParameter("listUuid", i) as string;
          const list = await ListsService.getList(uuid, credentials.apiKey);
          returnData.push({ json: list } as INodeExecutionData);
        } else if (operation === "createList") {
          const data = buildListInput.call(this, i);
          const list = await ListsService.createList(data, credentials.apiKey);
          returnData.push({ json: list } as INodeExecutionData);
        } else if (operation === "updateList") {
          const uuid = this.getNodeParameter("listUuid", i) as string;
          const data = buildListInput.call(this, i);
          const list = await ListsService.updateList(uuid, data, credentials.apiKey);
          returnData.push({ json: list } as INodeExecutionData);
        } else if (operation === "deleteList") {
          const uuid = this.getNodeParameter("listUuid", i) as string;
          await ListsService.deleteList(uuid, credentials.apiKey);
          returnData.push({ json: { success: true, uuid } } as INodeExecutionData);
        } else if (operation === "addContacts") {
          const listUuid = this.getNodeParameter("listUuid", i) as string;
          const raw = this.getNodeParameter("contactUuids", i) as string;
          const contactUuids = raw.split(",").map((s) => s.trim()).filter(Boolean);
          const result = await ListsService.addContacts(listUuid, contactUuids, credentials.apiKey);
          returnData.push({ json: result } as INodeExecutionData);
        } else if (operation === "removeContact") {
          const listUuid = this.getNodeParameter("listUuid", i) as string;
          const contactUuid = this.getNodeParameter("contactUuid", i) as string;
          await ListsService.removeContact(listUuid, contactUuid, credentials.apiKey);
          returnData.push({ json: { success: true, listUuid, contactUuid } } as INodeExecutionData);
        }
      } catch (error: any) {
        returnData.push({ json: { error: error.message } } as INodeExecutionData);
      }
    }

    return this.prepareOutputData(returnData);
  }
}

function buildListInput(this: IExecuteFunctions, i: number): ListInput {
  const name = this.getNodeParameter("name", i, "") as string;
  const description = this.getNodeParameter("description", i, "") as string;
  const icon = this.getNodeParameter("icon", i, "") as string;

  const data: Record<string, string> = {};
  if (name) data.name = name;
  if (description) data.description = description;
  if (icon) data.icon = icon;

  return data as unknown as ListInput;
}

export default Lists;
