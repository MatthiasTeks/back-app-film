import { Project } from "../interface/Interface";
import { signUrl } from "../services/SignUrl";

export const SignProject = async (project: Project) => {

    project.s3_image_key = await signUrl(project.s3_image_key);
    project.s3_video_key = await signUrl(project.s3_video_key);

    return project;
}
