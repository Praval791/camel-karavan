import React, {useState} from 'react';
import {
    Button,
    Tooltip,
    Flex, FlexItem, Label, Badge, Spinner
} from '@patternfly/react-core';
import '../designer/karavan.css';
import {ExpandableRowContent, Tbody, Td, Tr} from "@patternfly/react-table";
import StopIcon from "@patternfly/react-icons/dist/js/icons/stop-icon";
import PlayIcon from "@patternfly/react-icons/dist/esm/icons/play-icon";
import {ContainerStatus} from "../api/ProjectModels";
import PauseIcon from "@patternfly/react-icons/dist/esm/icons/pause-icon";
import DeleteIcon from "@patternfly/react-icons/dist/js/icons/times-icon";
import {KaravanApi} from "../api/KaravanApi";

interface Props {
    index: number
    container: ContainerStatus
}

export function ContainerTableRow (props: Props) {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const container = props.container;
    const commands = container.commands;
    const ports = container.ports;
    const isRunning = container.state === 'running';
    const inTransit = container.inTransit;
    const color = container.state === 'running' ? "green" : "grey";
    return (
        <Tbody isExpanded={isExpanded}>
            <Tr key={container.containerName}>
                <Td expand={
                    container.containerName
                        ? {
                            rowIndex: props.index,
                            isExpanded: isExpanded,
                            onToggle: () => setIsExpanded(!isExpanded),
                            expandId: 'composable-expandable-example'
                        }
                        : undefined}
                    modifier={"fitContent"}>
                </Td>
                <Td style={{verticalAlign: "middle"}} modifier={"fitContent"}>
                    <Badge className="badge">{container.type}</Badge>
                </Td>
                <Td>
                    <Label color={color}>{container.containerName}</Label>
                </Td>
                <Td>{container.image}</Td>
                <Td>
                    {isRunning && container.cpuInfo && <Label color={color}>{container.cpuInfo}</Label>}
                </Td>
                <Td>
                    {isRunning && container.memoryInfo && <Label color={color}>{container.memoryInfo}</Label>}
                </Td>
                <Td>
                    {!inTransit && <Label color={color}>{container.state}</Label>}
                    {inTransit && <Spinner size="lg" aria-label="spinner"/>}
                </Td>
                <Td>
                    {container.type !== 'internal' &&
                        <Flex direction={{default: "row"}} flexWrap={{default: "nowrap"}}
                              spaceItems={{default: 'spaceItemsNone'}}>
                            <FlexItem>
                                <Tooltip content={"Start container"} position={"bottom"}>
                                    <Button variant={"plain"} icon={<PlayIcon/>} isDisabled={!commands.includes('run') || inTransit}
                                            onClick={e => {
                                                KaravanApi.manageContainer(container.env, container.type, container.containerName, 'run', res => {});
                                            }}></Button>
                                </Tooltip>
                            </FlexItem>
                            <FlexItem>
                                <Tooltip content={"Pause container"} position={"bottom"}>
                                    <Button variant={"plain"} icon={<PauseIcon/>} isDisabled={!commands.includes('pause') || inTransit}
                                            onClick={e => {
                                                KaravanApi.manageContainer(container.env, container.type, container.containerName, 'pause', res => {});
                                            }}></Button>
                                </Tooltip>
                            </FlexItem>
                            <FlexItem>
                                <Tooltip content={"Stop container"} position={"bottom"}>
                                    <Button variant={"plain"} icon={<StopIcon/>} isDisabled={!commands.includes('stop') || inTransit}
                                            onClick={e => {
                                                KaravanApi.manageContainer(container.env, container.type, container.containerName, 'stop', res => {});
                                            }}></Button>
                                </Tooltip>
                            </FlexItem>
                            <FlexItem>
                                <Tooltip content={"Delete container"} position={"bottom"}>
                                    <Button variant={"plain"} icon={<DeleteIcon/>} isDisabled={!commands.includes('delete') || inTransit}
                                            onClick={e => {
                                                KaravanApi.deleteContainer(container.env, container.type, container.containerName, res => {});
                                            }}></Button>
                                </Tooltip>
                            </FlexItem>
                        </Flex>}
                </Td>
            </Tr>
            {<Tr isExpanded={isExpanded}>
                <Td></Td>
                <Td colSpan={2}>Container ID</Td>
                <Td colSpan={2}>
                    <ExpandableRowContent>
                        <Flex direction={{default: "column"}} cellPadding={"0px"}>
                            {container.containerId}
                        </Flex>
                    </ExpandableRowContent>
                </Td>
            </Tr>}
            {ports !== undefined && ports.length > 0 && <Tr isExpanded={isExpanded}>
                <Td></Td>
                <Td colSpan={2}>Ports</Td>
                <Td colSpan={2}>
                    <ExpandableRowContent>
                        <Flex direction={{default: "row"}} cellPadding={"0px"}>
                            {ports.map((port, index) => <FlexItem key={index}>{port}</FlexItem>)}
                        </Flex>
                    </ExpandableRowContent>
                </Td>
            </Tr>}
        </Tbody>
    )
}