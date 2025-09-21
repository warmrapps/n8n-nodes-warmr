import { apiRequest } from '../utils/request';
import type { FeedQuery, GenerateCommentRequest, PostCommentRequest } from '../types/feed.types';

const BASE_URL = 'https://api.warmr.app';

export class FeedService {
	static async getFeed(query: FeedQuery = {}, apiKey: string): Promise<any> {
		const queryParams = new URLSearchParams();
		
		// Add query parameters if provided
		if (query.page !== undefined) queryParams.append('page', query.page.toString());
		if (query.list_uuids) queryParams.append('list_uuids', query.list_uuids);
		if (query.commented !== undefined) queryParams.append('commented', query.commented.toString());
		if (query.contact_commented_days !== undefined) queryParams.append('contact_commented_days', query.contact_commented_days.toString());
		if (query.skipped !== undefined) queryParams.append('skipped', query.skipped.toString());
		if (query.posted_since_days !== undefined) queryParams.append('posted_since_days', query.posted_since_days.toString());
		if (query.search) queryParams.append('search', query.search);
		if (query.interest) queryParams.append('interest', query.interest);
		if (query.favorite_contacts !== undefined) queryParams.append('favorite_contacts', query.favorite_contacts.toString());

		const queryString = queryParams.toString();
		const url = queryString ? `${BASE_URL}/feed?${queryString}` : `${BASE_URL}/feed`;

		const response = await apiRequest<any>(url, { method: 'GET' }, apiKey);
		
		// Handle response structure (based on the example provided)
		if (response && response.data) {
			return response.data;
		}
		return response;
	}

	static async getComments(postUuid: string, apiKey: string): Promise<any> {
		const response = await apiRequest<any>(
			`${BASE_URL}/feed/${postUuid}/comments`,
			{ method: 'GET' },
			apiKey
		);
		return response;
	}

	static async generateComment(request: GenerateCommentRequest, apiKey: string): Promise<any> {
		const { postUuid, maxComments = 1, ...body } = request;
		const queryParams = new URLSearchParams();
		queryParams.append('maxComments', maxComments.toString());
		
		const response = await apiRequest<any>(
			`${BASE_URL}/feed/writer/comment/generate?${queryParams.toString()}`,
			{
				method: 'POST',
				body: JSON.stringify({
					postUuid,
					maxComments,
					version: body.version || 1,
					initial_comment_text: body.initial_comment_text || '',
					instructions: body.instructions || ''
				})
			},
			apiKey
		);
		return response;
	}

	static async postComment(postUuid: string, request: PostCommentRequest, apiKey: string): Promise<any> {
		const response = await apiRequest<any>(
			`${BASE_URL}/feed/${postUuid}/comment`,
			{
				method: 'POST',
				body: JSON.stringify(request)
			},
			apiKey
		);
		return response;
	}
}