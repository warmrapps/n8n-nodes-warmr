import {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from "n8n-workflow";
import { FeedService } from "../services/FeedService";
import type {
  FeedQuery,
  GenerateCommentRequest,
  PostCommentRequest,
} from "../types/feed.types";

export class Feed implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Warmr Feed",
    name: "feed",
    group: ["transform"],
    version: 1,
    description: "Manage Warmr feed and comments",
    defaults: {
      name: "Warmr Feed",
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
          { name: "Get Feed", value: "getFeed" },
          { name: "Get Comments", value: "getComments" },
          { name: "Generate Comment", value: "generateComment" },
          { name: "Post Comment", value: "postComment" },
        ],
        default: "getFeed",
        description: "Operation to perform",
      },
      // Feed operation fields
      {
        displayName: "Page",
        name: "page",
        type: "number",
        default: 1,
        displayOptions: {
          show: { operation: ["getFeed"] },
        },
        description: "Page number for pagination",
      },
      {
        displayName: "Posted Since Days",
        name: "postedSinceDays",
        type: "number",
        default: 30,
        displayOptions: {
          show: { operation: ["getFeed"] },
        },
        description: "Get posts from the last N days",
      },
      {
        displayName: "List UUIDs",
        name: "listUuids",
        type: "string",
        default: "",
        displayOptions: {
          show: { operation: ["getFeed"] },
        },
        description: "Filter by list UUIDs (comma-separated)",
      },
      {
        displayName: "Search",
        name: "search",
        type: "string",
        default: "",
        displayOptions: {
          show: { operation: ["getFeed"] },
        },
        description: "Search query for feed posts",
      },
      {
        displayName: "Interest",
        name: "interest",
        type: "string",
        default: "",
        displayOptions: {
          show: { operation: ["getFeed"] },
        },
        description: "Filter by interest",
      },
      {
        displayName: "Commented",
        name: "commented",
        type: "boolean",
        default: false,
        displayOptions: {
          show: { operation: ["getFeed"] },
        },
        description: "Filter for commented posts",
      },
      {
        displayName: "Contact Commented Days",
        name: "contactCommentedDays",
        type: "number",
        default: 0,
        displayOptions: {
          show: { operation: ["getFeed"] },
        },
        description: "Filter posts where contact commented within N days",
      },
      {
        displayName: "Skipped",
        name: "skipped",
        type: "boolean",
        default: false,
        displayOptions: {
          show: { operation: ["getFeed"] },
        },
        description: "Filter for skipped posts",
      },
      {
        displayName: "Favorite Contacts",
        name: "favoriteContacts",
        type: "boolean",
        default: false,
        displayOptions: {
          show: { operation: ["getFeed"] },
        },
        description: "Filter for posts from favorite contacts",
      },
      // Comments operation fields
      {
        displayName: "Post UUID",
        name: "postUuid",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
          show: { operation: ["getComments", "generateComment", "postComment"] },
        },
        description: "UUID of the post",
      },
      // Generate comment fields
      {
        displayName: "Max Comments",
        name: "maxComments",
        type: "number",
        default: 1,
        displayOptions: {
          show: { operation: ["generateComment"] },
        },
        description: "Maximum number of comments to generate",
      },
      {
        displayName: "Initial Comment Text",
        name: "initialCommentText",
        type: "string",
        default: "",
        displayOptions: {
          show: { operation: ["generateComment"] },
        },
        description: "Initial text for the comment",
      },
      {
        displayName: "Instructions",
        name: "instructions",
        type: "string",
        default: "",
        displayOptions: {
          show: { operation: ["generateComment"] },
        },
        description: "Instructions for generating the comment",
      },
      {
        displayName: "Version",
        name: "version",
        type: "number",
        default: 1,
        displayOptions: {
          show: { operation: ["generateComment"] },
        },
        description: "API version",
      },
      // Post comment fields
      {
        displayName: "Comment",
        name: "comment",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
          show: { operation: ["postComment"] },
        },
        description: "Comment text to post",
      },
      {
        displayName: "Reaction",
        name: "reaction",
        type: "options",
        options: [
          { name: "Like", value: "like" },
          { name: "Support", value: "support" },
          { name: "Funny", value: "funny" },
          { name: "Love", value: "love" },
          { name: "Insightful", value: "insightful" },
          { name: "Celebrate", value: "celebrate" },
        ],
        default: "like",
        displayOptions: {
          show: { operation: ["postComment"] },
        },
        description: "Reaction to add with the comment",
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
        if (operation === "getFeed") {
          // Build feed query from parameters
          const feedQuery: FeedQuery = {};
          
          const page = this.getNodeParameter("page", i) as number;
          if (page) feedQuery.page = page;
          
          const postedSinceDays = this.getNodeParameter("postedSinceDays", i) as number;
          if (postedSinceDays) feedQuery.posted_since_days = postedSinceDays;
          
          const listUuids = this.getNodeParameter("listUuids", i) as string;
          if (listUuids) feedQuery.list_uuids = listUuids;
          
          const search = this.getNodeParameter("search", i) as string;
          if (search) feedQuery.search = search;
          
          const interest = this.getNodeParameter("interest", i) as string;
          if (interest) feedQuery.interest = interest;
          
          const commented = this.getNodeParameter("commented", i) as boolean;
          if (commented !== undefined) feedQuery.commented = commented;
          
          const contactCommentedDays = this.getNodeParameter("contactCommentedDays", i) as number;
          if (contactCommentedDays) feedQuery.contact_commented_days = contactCommentedDays;
          
          const skipped = this.getNodeParameter("skipped", i) as boolean;
          if (skipped !== undefined) feedQuery.skipped = skipped;
          
          const favoriteContacts = this.getNodeParameter("favoriteContacts", i) as boolean;
          if (favoriteContacts !== undefined) feedQuery.favorite_contacts = favoriteContacts;
          
          const feed = await FeedService.getFeed(feedQuery, credentials.apiKey);
          // Handle array response for feed
          if (Array.isArray(feed)) {
            returnData.push(...feed.map((item) => ({ json: item as IDataObject })));
          } else {
            returnData.push({ json: feed as IDataObject });
          }
        } else if (operation === "getComments") {
          const postUuid = this.getNodeParameter("postUuid", i) as string;
          if (!postUuid) throw new Error("Post UUID is required");
          
          const comments = await FeedService.getComments(postUuid, credentials.apiKey);
          returnData.push({ json: comments as IDataObject });
        } else if (operation === "generateComment") {
          const postUuid = this.getNodeParameter("postUuid", i) as string;
          if (!postUuid) throw new Error("Post UUID is required");
          
          const request: GenerateCommentRequest = {
            postUuid,
            maxComments: this.getNodeParameter("maxComments", i, 1) as number,
            version: this.getNodeParameter("version", i, 1) as number,
            initial_comment_text: this.getNodeParameter("initialCommentText", i, "") as string,
            instructions: this.getNodeParameter("instructions", i, "") as string,
          };
          
          const generatedComment = await FeedService.generateComment(request, credentials.apiKey);
          returnData.push({ json: generatedComment as IDataObject });
        } else if (operation === "postComment") {
          const postUuid = this.getNodeParameter("postUuid", i) as string;
          if (!postUuid) throw new Error("Post UUID is required");
          
          const comment = this.getNodeParameter("comment", i) as string;
          if (!comment) throw new Error("Comment text is required");
          
          const request: PostCommentRequest = {
            comment,
            reaction: this.getNodeParameter("reaction", i, "like") as any,
          };
          
          const postedComment = await FeedService.postComment(postUuid, request, credentials.apiKey);
          returnData.push({ json: postedComment as IDataObject });
        }
      } catch (error: any) {
        returnData.push({ json: { error: error.message } as IDataObject });
      }
    }
    return this.prepareOutputData(returnData);
  }
}

export default Feed;