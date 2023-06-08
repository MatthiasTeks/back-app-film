import { Project } from "../interface/Interface";
import { signUrl } from "../services/SignUrl";

export const SignProject = async (project: Project) => {
    const {
        id_project,
        name,
        label,
        type,
        journey,
        s3_minia_key,
        s3_video_key,
        date,
        place,
        credit,
        is_highlight
    } = project;

    const minia = await signUrl(s3_minia_key);
    const video = await signUrl(s3_video_key);

    return {
        id_project,
        name,
        label,
        type,
        journey,
        minia,
        video,
        date,
        place,
        credit,
        is_highlight
    }
}
