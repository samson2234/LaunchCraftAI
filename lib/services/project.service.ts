import { projectRepository, CreateProjectData, UpdateProjectData } from "@/lib/repositories/project.repository";
import { featureGateService } from "@/lib/middleware/feature-gate";

export class ProjectService {
    async createProject(data: CreateProjectData) {
        // Check subscription limits using centralized feature gate
        const check = await featureGateService.canCreateProject(data.userId);

        if (!check.allowed) {
            throw new Error(check.reason || "Project limit reached");
        }

        return projectRepository.create(data);
    }

    async getProjectById(id: string, userId: string) {
        const project = await projectRepository.findById(id);

        if (!project) {
            throw new Error("Project not found");
        }

        // Verify ownership
        if (project.userId !== userId) {
            throw new Error("Unauthorized access to project");
        }

        return project;
    }

    async getUserProjects(userId: string) {
        return projectRepository.findByUserId(userId);
    }

    async updateProject(id: string, userId: string, data: UpdateProjectData) {
        // Verify ownership
        const project = await projectRepository.findById(id);
        if (!project) {
            throw new Error("Project not found");
        }

        if (project.userId !== userId) {
            throw new Error("Unauthorized access to project");
        }

        return projectRepository.update(id, data);
    }

    async deleteProject(id: string, userId: string) {
        // Verify ownership
        const project = await projectRepository.findById(id);
        if (!project) {
            throw new Error("Project not found");
        }

        if (project.userId !== userId) {
            throw new Error("Unauthorized access to project");
        }

        return projectRepository.delete(id);
    }

    async getPublicProjectData(id: string) {
        const project = await projectRepository.findById(id);

        if (!project) {
            throw new Error("Project not found");
        }

        // Return only what's needed for the public landing page
        return {
            id: project.id,
            name: project.name,
            description: project.description,
            landingPage: project.landingPage,
        };
    }
}

export const projectService = new ProjectService();
