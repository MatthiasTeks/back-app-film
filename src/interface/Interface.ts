export interface InterfaceProject {
    id_projet?: number;
    actor_name?: string;
    label?: string;
    sexe?: string;
    biography?: string;
    avis?: string;
    s3_image_main_key?: string;
    s3_image_2_key?: string;
    s3_image_3_key?: string;
    s3_image_4_key?: string;
    s3_image_horizontal_key?: string;
    type_projet?: string;
    option_projet?: string;
    s3_image_projet_key?: string;
    s3_video_projet_key?: string;
    date?: string;
}

export type PartialProject = {
    [P in keyof InterfaceProject]?: InterfaceProject[P];
};

export interface InterfaceNewsletter {
    id_newsletter?: number;
    mail: string;
    consent: number;
}

export interface InterfaceAdmin {
    email: string;
    password?: string;
    id?: number;
}