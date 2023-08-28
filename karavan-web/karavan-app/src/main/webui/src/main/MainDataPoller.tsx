import React, {useEffect, useState} from 'react';

import {KaravanApi} from "../api/KaravanApi";
import '../designer/karavan.css';
import {
    AppConfig,
    CamelStatus,
    ContainerStatus,
    DeploymentStatus,
    PipelineStatus,
    Project,
    ServiceStatus
} from "../api/ProjectModels";
import {useAppConfigStore, useProjectsStore, useProjectStore, useStatusesStore} from "../api/ProjectStore";
import {shallow} from "zustand/shallow";

export function MainDataPoller () {

    const [config, setLoading] = useAppConfigStore((s) =>
        [s.config, s.setLoading], shallow)
    const [projects, setProjects] = useProjectsStore((state) => [state.projects, state.setProjects], shallow)
    const [deployments, services, containers, camels, setDeployments, setServices, setContainers, setCamels, setPipelineStatuses]
        = useStatusesStore((s) => [s.deployments, s.services, s.containers, s.camels,
        s.setDeployments, s.setServices, s.setContainers, s.setCamels, s.setPipelineStatuses], shallow);

    const [project] = useProjectStore((state) => [state.project], shallow )

    useEffect(() => {
        const interval = setInterval(() => getData(), 1300)
        return () => {
            clearInterval(interval);
        };
    }, [project]);

    function getData() {
        setLoading(true);
        KaravanApi.getConfiguration((config: AppConfig) => {
            if (project.projectId === undefined) {
                KaravanApi.getProjects((projects: Project[]) => {
                    setProjects(projects);
                });
            }
            KaravanApi.getAllDeploymentStatuses((statuses: DeploymentStatus[]) => {
                setDeployments(statuses);
            });
            KaravanApi.getAllServiceStatuses((statuses: ServiceStatus[]) => {
                setServices(statuses);
            });
            KaravanApi.getAllContainerStatuses((statuses: ContainerStatus[]) => {
                setContainers(statuses);
            });
            KaravanApi.getAllCamelStatuses(config.environment, (statuses: CamelStatus[]) => {
                setCamels(statuses);
            });
            KaravanApi.getPipelineStatuses(config.environment, (status: PipelineStatus[]) => {
                setPipelineStatuses(status);
            });
            setLoading(false);
        });
    }

    return (<></>)
}