import React, {useState} from 'react';
import {
    Button,
    Tooltip,
    Flex, FlexItem, Label, Spinner, TooltipPosition
} from '@patternfly/react-core';
import '../designer/karavan.css';
import {ExpandableRowContent, Tbody, Td, Tr} from "@patternfly/react-table";
import StopIcon from "@patternfly/react-icons/dist/js/icons/stop-icon";
import PlayIcon from "@patternfly/react-icons/dist/esm/icons/play-icon";
import {DevService} from "../api/ServiceModels";
import {ContainerStatus} from "../api/ProjectModels";
import PauseIcon from "@patternfly/react-icons/dist/esm/icons/pause-icon";
import DeleteIcon from "@patternfly/react-icons/dist/js/icons/times-icon";
import {useAppConfigStore, useLogStore} from "../api/ProjectStore";
import {shallow} from "zustand/shallow";
import {KaravanApi} from "../api/KaravanApi";
import UpIcon from "@patternfly/react-icons/dist/esm/icons/check-circle-icon";
import DownIcon from "@patternfly/react-icons/dist/esm/icons/error-circle-o-icon";

interface Props {
    index: number
    service: DevService
    container?: ContainerStatus
}

export function ServicesTableRow (props: Props) {

    const [config] = useAppConfigStore((state) => [state.config], shallow)
    const [isExpanded, setIsExpanded] = useState<boolean>(false);


    function getButtons() {
        const container = props.container;
        const commands = container?.commands || ['run'];
        const inTransit = container?.inTransit;
        return (
            <Td noPadding className="project-action-buttons">
                <Flex direction={{default: "row"}} flexWrap={{default: "nowrap"}}
                      spaceItems={{default: 'spaceItemsNone'}}>
                    <FlexItem>
                        <Tooltip content={"Start container"} position={"bottom"}>
                            <Button variant={"plain"} icon={<PlayIcon/>} isDisabled={!commands.includes('run') || inTransit}
                                    onClick={e => {
                                        KaravanApi.manageContainer(config.environment, 'devservice', service.container_name, 'run', res => {});
                                    }}></Button>
                        </Tooltip>
                    </FlexItem>
                    <FlexItem>
                        <Tooltip content={"Pause container"} position={"bottom"}>
                            <Button variant={"plain"} icon={<PauseIcon/>} isDisabled={!commands.includes('pause') || inTransit}
                                    onClick={e => {
                                        // KaravanApi.manageContainer(container.env, container.containerName, 'pause', res => {});
                                    }}></Button>
                        </Tooltip>
                    </FlexItem>
                    <FlexItem>
                        <Tooltip content={"Stop container"} position={"bottom"}>
                            <Button variant={"plain"} icon={<StopIcon/>} isDisabled={!commands.includes('stop') || inTransit}
                                    onClick={e => {
                                        KaravanApi.manageContainer(config.environment, 'devservice', service.container_name, 'stop', res => {});
                                    }}></Button>
                        </Tooltip>
                    </FlexItem>
                    <FlexItem>
                        <Tooltip content={"Delete container"} position={"bottom"}>
                            <Button variant={"plain"} icon={<DeleteIcon/>} isDisabled={!commands.includes('delete') || inTransit}
                                    onClick={e => {
                                        KaravanApi.deleteContainer(config.environment, 'devservice', service.container_name, res => {});
                                    }}></Button>
                        </Tooltip>
                    </FlexItem>
                </Flex>
            </Td>
        )
    }

    const service = props.service;
    const healthcheck = service.healthcheck;
    const env = service.environment;
    const keys = Object.keys(env);
    const container = props.container;
    const isRunning = container?.state === 'running';
    const inTransit = container?.inTransit;
    const color = isRunning ? "green" : "grey";
    const icon = isRunning ? <UpIcon/> : <DownIcon/>;
    return (
        <Tbody isExpanded={isExpanded}>
            <Tr key={service.container_name}>
                <Td expand={
                    service.container_name
                        ? {
                            rowIndex: props.index,
                            isExpanded: isExpanded,
                            onToggle: () => setIsExpanded(!isExpanded),
                            expandId: 'composable-expandable-example'
                        }
                        : undefined}
                    modifier={"fitContent"}>
                </Td>
                <Td>
                    {container && <Label icon={icon} color={color}>
                        <Tooltip content={"Show log"} position={TooltipPosition.bottom}>
                            <Button className='labeled-button' variant="link" isDisabled={!isRunning}
                                    onClick={e => {
                                        useLogStore.setState({showLog: true, type: 'container', podName: container.containerName});
                                    }}>
                                {service.container_name}
                            </Button>
                        </Tooltip>
                    </Label>}
                    {!container && <Label color={color}>{service.container_name}</Label>}
                </Td>
                <Td>{service.container_name}</Td>
                <Td>{service.image}</Td>
                <Td>
                    <Flex direction={{default: "row"}}>
                        {service.ports.map(port => <FlexItem key={port}>{port}</FlexItem>)}
                    </Flex>
                </Td>
                <Td>
                    {!inTransit && container?.state && <Label color={color}>{container?.state}</Label>}
                    {inTransit && <Spinner size="lg" aria-label="spinner"/>}
                </Td>
                {getButtons()}
            </Tr>
            {keys.length > 0 && <Tr isExpanded={isExpanded}>
                <Td></Td>
                <Td colSpan={2}>Environment Variables</Td>
                <Td colSpan={2}>
                    <ExpandableRowContent>
                        <Flex direction={{default: "column"}} cellPadding={"0px"}>
                        {keys.map(key => <FlexItem key={key}>{key + ": " + env[key]}</FlexItem>)}
                        </Flex>
                    </ExpandableRowContent>
                </Td>
            </Tr>}
            {healthcheck && <Tr isExpanded={isExpanded}>
                <Td></Td>
                <Td colSpan={2}>Healthcheck</Td>
                <Td colSpan={2}>
                    <ExpandableRowContent>
                        <Flex direction={{default: "column"}} cellPadding={"0px"}>
                            <FlexItem>{"test: " + healthcheck.test.join(" ")}</FlexItem>
                            <FlexItem>{"interval " + healthcheck.interval}</FlexItem>
                            <FlexItem>{"timeout: " + healthcheck.timeout}</FlexItem>
                            <FlexItem>{"retries: " + healthcheck.retries}</FlexItem>
                        </Flex>
                    </ExpandableRowContent>
                </Td>
            </Tr>}
        </Tbody>
    )
}