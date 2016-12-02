import { injectable, inject } from 'inversify';
import { ServiceIdentifiers } from '../../container/ServiceIdentifiers';

import * as format from 'string-template';

import { TNodeWithBlockStatement } from '../../types/node/TNodeWithBlockStatement';
import { TObfuscationEvent } from '../../types/event-emitters/TObfuscationEvent';

import { IOptions } from '../../interfaces/options/IOptions';
import { IStackTraceData } from '../../interfaces/stack-trace-analyzer/IStackTraceData';

import { ObfuscationEvents } from '../../enums/ObfuscationEvents';

import { initializable } from '../../decorators/Initializable';

import { DebugProtectionFunctionTemplate } from '../../templates/custom-nodes/debug-protection-nodes/debug-protection-function-node/DebugProtectionFunctionTemplate';

import { AbstractCustomNode } from '../AbstractCustomNode';
import { NodeAppender } from '../../node/NodeAppender';
import { Utils } from '../../Utils';

@injectable()
export class DebugProtectionFunctionNode extends AbstractCustomNode {
    /**
     * @type {TObfuscationEvent}
     */
    protected readonly appendEvent: TObfuscationEvent = ObfuscationEvents.BeforeObfuscation;

    /**
     * @type {string}
     */
    @initializable()
    private debugProtectionFunctionName: string;

    /**
     * @param options
     */
    constructor (
        @inject(ServiceIdentifiers.IOptions) options: IOptions
    ) {
        super(options);
    }

    /**
     * @param debugProtectionFunctionName
     */
    public initialize (debugProtectionFunctionName: string): void {
        this.debugProtectionFunctionName = debugProtectionFunctionName;
    }

    /**
     * @param blockScopeNode
     * @param stackTraceData
     */
    public appendNode (blockScopeNode: TNodeWithBlockStatement, stackTraceData: IStackTraceData[]): void {
        let programBodyLength: number = blockScopeNode.body.length,
            randomIndex: number = Utils.getRandomInteger(0, programBodyLength);

        NodeAppender.insertNodeAtIndex(blockScopeNode, this.getNode(), randomIndex);
    }

    /**
     * @returns {string}
     */
    public getCode (): string {
        return format(DebugProtectionFunctionTemplate(), {
            debugProtectionFunctionName: this.debugProtectionFunctionName
        });
    }
}
