import {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
} from "n8n-workflow";
import { CompaniesService } from "../services/CompaniesService";
import type { CompanySearchQuery } from "../types/company.types";

export class Companies implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Warmr Companies",
    name: "warmrCompanies",
    group: ["transform"],
    version: 1,
    description: "Browse Warmr companies via the v1 API",
    defaults: { name: "Warmr Companies", color: "#e4d103" },
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
          { name: "List Companies", value: "listCompanies" },
          { name: "Get Company", value: "getCompany" },
        ],
        default: "listCompanies",
        description: "Operation to perform",
      },

      // --- List Companies filters ---
      {
        displayName: "Page",
        name: "page",
        type: "number",
        default: 1,
        displayOptions: { show: { operation: ["listCompanies"] } },
      },
      {
        displayName: "Per Page",
        name: "perPage",
        type: "number",
        default: 50,
        displayOptions: { show: { operation: ["listCompanies"] } },
        description: "Results per page (max 100)",
      },
      {
        displayName: "Search",
        name: "search",
        type: "string",
        default: "",
        displayOptions: { show: { operation: ["listCompanies"] } },
        description: "Search by company name",
      },

      // --- Get Company ---
      {
        displayName: "Company UUID",
        name: "uuid",
        type: "string",
        default: "",
        required: true,
        displayOptions: { show: { operation: ["getCompany"] } },
        description: "UUID of the company",
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
        if (operation === "listCompanies") {
          const query: CompanySearchQuery = {};
          const page = this.getNodeParameter("page", i) as number;
          const perPage = this.getNodeParameter("perPage", i) as number;
          const search = this.getNodeParameter("search", i) as string;
          if (page) query.page = page;
          if (perPage) query.per_page = perPage;
          if (search) query.search = search;
          const result = await CompaniesService.getCompanies(query, credentials.apiKey);
          returnData.push({ json: result } as INodeExecutionData);
        } else if (operation === "getCompany") {
          const uuid = this.getNodeParameter("uuid", i) as string;
          const company = await CompaniesService.getCompany(uuid, credentials.apiKey);
          returnData.push({ json: company } as INodeExecutionData);
        }
      } catch (error: any) {
        returnData.push({ json: { error: error.message } } as INodeExecutionData);
      }
    }

    return this.prepareOutputData(returnData);
  }
}

export default Companies;
