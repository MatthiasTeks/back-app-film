export interface Project {
    id_project?: number;
    name: string;
    label: string;
    gender: string;
    type_projet: string;
    s3_image_main_key: string;
    s3_image_2_key: string;
    s3_image_3_key: string;
    s3_image_horizontal_key: string;
    s3_video_projet_key: string;
    date: string;
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

export interface Admin {
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
    is_link: number;
    link?: string;
    s3_image_key: string;
}

export interface Partner {
    id_partner: number;
    name: string;
    s3_image_key: string;
}