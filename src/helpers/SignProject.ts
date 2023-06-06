import {Project} from "../interface/Interface";
import {signUrl} from "../services/SignUrl";

export const SignProject = async (project: Project) => {
    const {
        id_project,
        name,
        label,
        gender,
        type_projet,
        s3_image_main_key,
        s3_image_2_key,
        s3_image_3_key,
        s3_image_horizontal_key,
        s3_video_projet_key,
        date,
        is_highlight
    } = project;

    const main_image = await signUrl(s3_image_main_key);
    const image2 = await signUrl(s3_image_2_key);
    const image3 = await signUrl(s3_image_3_key);
    const horizontal_image = await signUrl(s3_image_horizontal_key);
    const video = await signUrl(s3_video_projet_key);

    return {
        id_project,
        name,
        label,
        gender,
        type_projet,
        main_image,
        image2,
        image3,
        horizontal_image,
        video,
        date,
        is_highlight
    }
}
