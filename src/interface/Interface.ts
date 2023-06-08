export interface Project {
    id_project?: number;
    name: string;
    label: string;
    type: string;
    journey: string;
    s3_minia_key: string;
    s3_video_key: string;
    date: string;
    place: string;
    credit: string;
    is_highlight: number
}

export type PartialProject = {
    [P in keyof Project]?: Project[P];
};

export interface Newsletter {
    id_newsletter?: number;
    mail: string;
    consent: number;
}

export interface User {
    id_user?: number;
    mail: string;
    password: string;
    is_admin: number;
}

export interface Background {
    id_background?: number;
    s3_video_key: string;
}

export interface Feed {
    id_feed?: number;
    name: string;
    resume: string;
    date: number;
    is_instagram: number;
    is_facebook: number;
    link_instagram?: string;
    link_facebook?: string;
    s3_image_key: string;
}

export interface Partner {
    id_partner?: number;
    name: string;
    s3_image_key: string;
}