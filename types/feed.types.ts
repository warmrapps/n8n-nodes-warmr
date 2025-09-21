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
	uuid?: string;
	comment: string;
	reaction?: 'like' | 'support' | 'funny' | 'love' | 'insightful' | 'celebrate';
	posted_at?: string;
	author?: string;
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