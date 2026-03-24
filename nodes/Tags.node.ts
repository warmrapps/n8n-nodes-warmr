import {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
} from "n8n-workflow";
import { TagsService } from "../services/TagsService";
import type { TagInput } from "../types/tag.types";

export class Tags implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Warmr Tags",
    name: "warmrTags",
    group: ["transform"],
    version: 1,
    description: "Manage Warmr tags and contact tag assignments via the v1 API",
    defaults: { name: "Warmr Tags", color: "#e4d103" },
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
          { name: "List Tags", value: "listTags" },
          { name: "Create Tag", value: "createTag" },
          { name: "Update Tag", value: "updateTag" },
          { name: "Delete Tag", value: "deleteTag" },
          { name: "Get Contact Tags", value: "getContactTags" },
          { name: "Set Contact Tags", value: "setContactTags" },
        ],
        default: "listTags",
        description: "Operation to perform",
      },

      // --- Tag ID (integer) ---
      {
        displayName: "Tag ID",
        name: "tagId",
        type: "number",
        default: 0,
        required: true,
        displayOptions: { show: { operation: ["updateTag", "deleteTag"] } },
        description: "Numeric ID of the tag",
      },

      // --- Create / Update fields ---
      {
        displayName: "Name",
        name: "name",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["createTag", "updateTag"] } },
        description: "Tag name (1-255 chars)",
      },
      {
        displayName: "Color",
        name: "color",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["createTag", "updateTag"] } },
        description: "Hex color (#rrggbb). Auto-generated if omitted on create.",
      },

      // --- Contact tag operations ---
      {
        displayName: "Contact UUID",
        name: "contactUuid",
        type: "string",
        default: "",
        required: true,
        displayOptions: { show: { operation: ["getContactTags", "setContactTags"] } },
        description: "UUID of the contact",
      },
      {
        displayName: "Tag IDs",
        name: "tagIds",
        type: "string",
        default: "",
        required: true,
        displayOptions: { show: { operation: ["setContactTags"] } },
        description: "Comma-separated tag IDs to assign (replaces all existing tags)",
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
        if (operation === "listTags") {
          const tags = await TagsService.listTags(credentials.apiKey);
          returnData.push({ json: { data: tags } } as INodeExecutionData);
        } else if (operation === "createTag") {
          const data = buildTagInput.call(this, i);
          const tag = await TagsService.createTag(data, credentials.apiKey);
          returnData.push({ json: tag } as INodeExecutionData);
        } else if (operation === "updateTag") {
          const id = this.getNodeParameter("tagId", i) as number;
          const data = buildTagInput.call(this, i);
          const tag = await TagsService.updateTag(id, data, credentials.apiKey);
          returnData.push({ json: tag } as INodeExecutionData);
        } else if (operation === "deleteTag") {
          const id = this.getNodeParameter("tagId", i) as number;
          await TagsService.deleteTag(id, credentials.apiKey);
          returnData.push({ json: { success: true, id } } as INodeExecutionData);
        } else if (operation === "getContactTags") {
          const contactUuid = this.getNodeParameter("contactUuid", i) as string;
          const tags = await TagsService.getContactTags(contactUuid, credentials.apiKey);
          returnData.push({ json: { data: tags } } as INodeExecutionData);
        } else if (operation === "setContactTags") {
          const contactUuid = this.getNodeParameter("contactUuid", i) as string;
          const raw = this.getNodeParameter("tagIds", i) as string;
          const tagIds = raw.split(",").map((s) => Number(s.trim())).filter(Boolean);
          await TagsService.replaceContactTags(contactUuid, tagIds, credentials.apiKey);
          returnData.push({ json: { success: true, contactUuid, tagIds } } as INodeExecutionData);
        }
      } catch (error: any) {
        returnData.push({ json: { error: error.message } } as INodeExecutionData);
      }
    }

    return this.prepareOutputData(returnData);
  }
}

function buildTagInput(this: IExecuteFunctions, i: number): TagInput {
  const name = this.getNodeParameter("name", i, "") as string;
  const color = this.getNodeParameter("color", i, "") as string;

  const data: Record<string, string> = {};
  if (name) data.name = name;
  if (color) data.color = color;

  return data as unknown as TagInput;
}

export default Tags;
