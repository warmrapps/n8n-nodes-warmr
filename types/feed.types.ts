export interface FeedQuery {
	page?: number;
	list_uuids?: string;
	commented?: boolean;
	contact_commented_days?: number;
	skipped?: boolean;
	posted_since_days?: number;
	search?: string;
	interest?: string;
	favorite_contacts?: boolean;
}

export interface FeedPost {
	uuid: string;
	content?: string;
	author?: string;
	posted_at?: string;
	[key: string]: any;
}

export interface Comment {
	id?: number;
	author?: {
		display_name: string;
		avatar_url: string;
	};
	content?: string;
	posted_at?: string;
	status?: string;
	reaction?: 'like' | 'support' | 'funny' | 'love' | 'insightful' | 'celebrate';
	social_post_uuid?: string;
}

export interface GenerateCommentRequest {
	postUuid: string;
	maxComments?: number;
	version?: number;
	initial_comment_text?: string;
	instructions?: string;
}

export interface PostCommentRequest {
	comment: string;
	reaction?: 'like' | 'support' | 'funny' | 'love' | 'insightful' | 'celebrate';
}