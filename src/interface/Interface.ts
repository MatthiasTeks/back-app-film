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
    id_admin?: number;
    mail: string;
    password: string;
}

export interface HomeActor {
    id_home_actor?: number;
    projet_id: number;
}

export interface HomeMedia {
    id_home_media?: number;
    s3_video_key: string;
}

export interface HomeNews {
    id_home_news?: number;
    name: string;
    resume: string;
    date: number;
    s3_image_key: string;
    isInsta: number;
    linkInsta?: string;
}

export interface HomePartner {
    id_home_partner: number;
    name: string;
    s3_image_key: string;
}