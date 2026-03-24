import {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
} from "n8n-workflow";
import { PipelinesService } from "../services/PipelinesService";
import type { PipelineInput, PipelineStageInput } from "../types/pipeline.types";

export class Pipelines implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Warmr Pipelines",
    name: "warmrPipelines",
    group: ["transform"],
    version: 1,
    description: "Manage Warmr pipelines, stages, and stage contacts via the v1 API",
    defaults: { name: "Warmr Pipelines", color: "#e4d103" },
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
          { name: "List Pipelines", value: "listPipelines" },
          { name: "Create Pipeline", value: "createPipeline" },
          { name: "Update Pipeline", value: "updatePipeline" },
          { name: "Delete Pipeline", value: "deletePipeline" },
          { name: "List Stages", value: "listStages" },
          { name: "Create Stage", value: "createStage" },
          { name: "Update Stage", value: "updateStage" },
          { name: "Delete Stage", value: "deleteStage" },
          { name: "Add Contacts to Stage", value: "addContacts" },
          { name: "Remove Contact from Stage", value: "removeContact" },
        ],
        default: "listPipelines",
        description: "Operation to perform",
      },

      // --- Pipeline UUID ---
      {
        displayName: "Pipeline UUID",
        name: "pipelineUuid",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
          show: {
            operation: [
              "updatePipeline", "deletePipeline",
              "listStages", "createStage",
            ],
          },
        },
        description: "UUID of the pipeline",
      },

      // --- Pipeline fields ---
      {
        displayName: "Name",
        name: "name",
        type: "string",
        default: "",
        displayOptions: {
          show: { operation: ["createPipeline", "updatePipeline", "createStage", "updateStage"] },
        },
        description: "Pipeline or stage name",
      },
      {
        displayName: "Visibility",
        name: "visibility",
        type: "options",
        options: [
          { name: "Private", value: "private" },
          { name: "Team", value: "team" },
        ],
        default: "private",
        displayOptions: { show: { operation: ["createPipeline", "updatePipeline"] } },
        description: "Pipeline visibility",
      },
      {
        displayName: "Icon",
        name: "icon",
        type: "string",
        default: "",
        displayOptions: {
          show: { operation: ["createPipeline", "updatePipeline", "createStage", "updateStage"] },
        },
      },

      // --- Stage UUID ---
      {
        displayName: "Stage UUID",
        name: "stageUuid",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
          show: { operation: ["updateStage", "deleteStage", "addContacts", "removeContact"] },
        },
        description: "UUID of the pipeline stage",
      },

      // --- Stage order ---
      {
        displayName: "Order",
        name: "order",
        type: "number",
        default: 0,
        displayOptions: { show: { operation: ["createStage", "updateStage"] } },
        description: "Position of the stage in the pipeline",
      },

      // --- Stage contacts ---
      {
        displayName: "Contact UUIDs",
        name: "contactUuids",
        type: "string",
        default: "",
        required: true,
        displayOptions: { show: { operation: ["addContacts"] } },
        description: "Comma-separated contact UUIDs to add to the stage",
      },
      {
        displayName: "Contact UUID",
        name: "contactUuid",
        type: "string",
        default: "",
        required: true,
        displayOptions: { show: { operation: ["removeContact"] } },
        description: "UUID of the contact to remove from the stage",
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
        const result = await executePipelineOperation.call(
          this, i, operation, credentials.apiKey,
        );
        returnData.push({ json: result } as INodeExecutionData);
      } catch (error: any) {
        returnData.push({ json: { error: error.message } } as INodeExecutionData);
      }
    }

    return this.prepareOutputData(returnData);
  }
}

async function executePipelineOperation(
  this: IExecuteFunctions,
  i: number,
  operation: string,
  apiKey: string,
): Promise<any> {
  if (operation === "listPipelines") {
    const pipelines = await PipelinesService.listPipelines(apiKey);
    return { data: pipelines };
  }

  if (operation === "createPipeline") {
    return PipelinesService.createPipeline(buildPipelineInput.call(this, i), apiKey);
  }

  if (operation === "updatePipeline") {
    const uuid = this.getNodeParameter("pipelineUuid", i) as string;
    return PipelinesService.updatePipeline(uuid, buildPipelineInput.call(this, i), apiKey);
  }

  if (operation === "deletePipeline") {
    const uuid = this.getNodeParameter("pipelineUuid", i) as string;
    await PipelinesService.deletePipeline(uuid, apiKey);
    return { success: true, uuid };
  }

  if (operation === "listStages") {
    const uuid = this.getNodeParameter("pipelineUuid", i) as string;
    const stages = await PipelinesService.listStages(uuid, apiKey);
    return { data: stages };
  }

  if (operation === "createStage") {
    const uuid = this.getNodeParameter("pipelineUuid", i) as string;
    return PipelinesService.createStage(uuid, buildStageInput.call(this, i), apiKey);
  }

  if (operation === "updateStage") {
    const stageUuid = this.getNodeParameter("stageUuid", i) as string;
    return PipelinesService.updateStage(stageUuid, buildStageInput.call(this, i), apiKey);
  }

  if (operation === "deleteStage") {
    const stageUuid = this.getNodeParameter("stageUuid", i) as string;
    await PipelinesService.deleteStage(stageUuid, apiKey);
    return { success: true, stageUuid };
  }

  if (operation === "addContacts") {
    const stageUuid = this.getNodeParameter("stageUuid", i) as string;
    const raw = this.getNodeParameter("contactUuids", i) as string;
    const contactUuids = raw.split(",").map((s) => s.trim()).filter(Boolean);
    return PipelinesService.addContactsToStage(stageUuid, contactUuids, apiKey);
  }

  // removeContact
  const stageUuid = this.getNodeParameter("stageUuid", i) as string;
  const contactUuid = this.getNodeParameter("contactUuid", i) as string;
  await PipelinesService.removeContactFromStage(stageUuid, contactUuid, apiKey);
  return { success: true, stageUuid, contactUuid };
}

function buildPipelineInput(this: IExecuteFunctions, i: number): PipelineInput {
  const name = this.getNodeParameter("name", i, "") as string;
  const visibility = this.getNodeParameter("visibility", i, "private") as string;
  const icon = this.getNodeParameter("icon", i, "") as string;

  const data: Record<string, string> = {};
  if (name) data.name = name;
  if (visibility) data.visibility = visibility;
  if (icon) data.icon = icon;

  return data as unknown as PipelineInput;
}

function buildStageInput(this: IExecuteFunctions, i: number): PipelineStageInput {
  const name = this.getNodeParameter("name", i, "") as string;
  const icon = this.getNodeParameter("icon", i, "") as string;
  const order = this.getNodeParameter("order", i, 0) as number;

  const data: Record<string, any> = {};
  if (name) data.name = name;
  if (icon) data.icon = icon;
  if (order) data.order = order;

  return data as unknown as PipelineStageInput;
}

export default Pipelines;
