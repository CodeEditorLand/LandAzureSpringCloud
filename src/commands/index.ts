// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommandCallback, IActionContext, IParsedError, parseError, registerCommandWithTreeNodeUnwrapping } from '@microsoft/vscode-azext-utils';
import { instrumentOperation } from 'vscode-extension-telemetry-wrapper';
import { ResourceItemBase } from "../tree/SpringAppsBranchDataProvider";
import { showError } from '../utils';
import { AppCommands } from "./AppCommands";
import { ServiceCommands } from "./ServiceCommands";

export function registerCommands(): void {
    registerCommandWithTelemetryWrapper('azureSpringApps.common.refresh', refreshNode);
    registerCommandWithTelemetryWrapper('azureSpringApps.common.toggleVisibility', AppCommands.toggleVisibility);
    registerCommandWithTelemetryWrapper('azureSpringApps.apps.createInPortal', ServiceCommands.createServiceInPortal);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.create', ServiceCommands.createApp);
    registerCommandWithTelemetryWrapper('azureSpringApps.apps.delete', ServiceCommands.deleteService);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.openPublicEndpoint', AppCommands.openPublicEndpoint);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.openTestEndpoint', AppCommands.openTestEndpoint);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.assignEndpoint', AppCommands.assignEndpoint);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.unassignEndpoint', AppCommands.unassignEndpoint);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.start', AppCommands.startApp);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.stop', AppCommands.stopApp);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.restart', AppCommands.restartApp);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.delete', AppCommands.deleteApp);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.deploy', AppCommands.deploy);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.scale', AppCommands.scale);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.enableRemoteDebugging', AppCommands.enableRemoteDebugging);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.disableRemoteDebugging', AppCommands.disableRemoteDebugging);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.instance.startRemoteDebugging', AppCommands.startRemoteDebugging);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.instance.startStreamingLog', AppCommands.startStreamingLogs);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.instance.stopStreamingLog', AppCommands.stopStreamingLogs);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.settings.add', AppCommands.addSetting);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.settings.edit', AppCommands.editSettings);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.setting.edit', AppCommands.editSetting);
    registerCommandWithTelemetryWrapper('azureSpringApps.app.setting.delete', AppCommands.deleteSetting);
}

function registerCommandWithTelemetryWrapper(commandId: string, callback: CommandCallback): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const callbackWithTroubleshooting: CommandCallback = (context: IActionContext, ...args: []) => instrumentOperation(commandId, async () => {
        try {
            await callback(context, ...args);
        } catch (error) {
            const e: IParsedError = parseError(error);
            if (!e.isUserCancelledError) {
                // tslint:disable-next-line: no-unsafe-any
                showError(commandId, error);
            }
            throw error;
        }
    })();
    registerCommandWithTreeNodeUnwrapping(commandId, callbackWithTroubleshooting);
}

async function refreshNode(_context: IActionContext, node: ResourceItemBase): Promise<void> {
    await node.refresh();
}
