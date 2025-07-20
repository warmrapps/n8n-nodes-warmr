import { ICredentialType, INodeProperties } from "n8n-workflow";

export class WarmrApiCredentials implements ICredentialType {
  name = "warmrApi";
  displayName = "Warmr API";
  documentationUrl = "https://docs.warmr.app/";
  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      default: "",
      required: true,
      description: "Your Warmr API Key (Bearer token)",
    },
  ];
}

export default WarmrApiCredentials;
