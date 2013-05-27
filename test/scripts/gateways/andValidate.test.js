/**
 * AUTHOR: mrassinger
 * COPYRIGHT: E2E Technologies Ltd.
 */

var BPMNProcessDefinition = require('../../../lib/bpmn/processDefinition.js').BPMNProcessDefinition;
var BPMNTask = require("../../../lib/bpmn/tasks.js").BPMNTask;
var BPMNStartEvent = require("../../../lib/bpmn/startEvents.js").BPMNStartEvent;
var BPMNEndEvent = require("../../../lib/bpmn/endEvents.js").BPMNEndEvent;
var BPMNSequenceFlow = require("../../../lib/bpmn/sequenceFlows.js").BPMNSequenceFlow;
var BPMNParallelGateway = require("../../../lib/bpmn/gateways.js").BPMNParallelGateway;
var errorQueueModule = require("../../../lib/errors.js");

exports.testParallelGatewayValidate_OK = function(test) {
    var processDefinition = new BPMNProcessDefinition("PROCESS_1", "myProcessWithParallelGateway");
    processDefinition.addFlowObject(new BPMNStartEvent("_2", "Start Event", "startEvent"));
    processDefinition.addFlowObject(new BPMNParallelGateway("_3", "Parallel Gateway", "parallelGateway"));
    processDefinition.addFlowObject(new BPMNTask("_5", "Task A", "task"));
    processDefinition.addFlowObject(new BPMNTask("_6", "Task B", "task"));
    processDefinition.addFlowObject(new BPMNEndEvent("_9", "End Event", "endEvent"));
    processDefinition.addSequenceFlow(new BPMNSequenceFlow("_4", null, "sequenceFlow", "_2", "_3"));
    processDefinition.addSequenceFlow(new BPMNSequenceFlow("_7", null, "sequenceFlow", "_3", "_5"));
    processDefinition.addSequenceFlow(new BPMNSequenceFlow("_8", null, "sequenceFlow", "_3", "_6"));
    processDefinition.addSequenceFlow(new BPMNSequenceFlow("_10", null, "sequenceFlow", "_5", "_9"));
    processDefinition.addSequenceFlow(new BPMNSequenceFlow("_11", null, "sequenceFlow", "_6", "_9"));

    var errorQueue = errorQueueModule.createErrorQueue();
    processDefinition.validate(errorQueue);

    var errors = errorQueue.getErrors();
    test.deepEqual(errors,
        [],
        "testParallelGatewayValidate_OK");
    test.done();
};

exports.testParallelGatewayValidate_GW1 = function(test) {
    var processDefinition = new BPMNProcessDefinition("PROCESS_1", "myProcessWithParallelGateway");
    processDefinition.addFlowObject(new BPMNStartEvent("_2", "Start Event", "startEvent"));
    processDefinition.addFlowObject(new BPMNParallelGateway("_3", "Parallel Gateway", "parallelGateway"));
    processDefinition.addFlowObject(new BPMNTask("_5", "Task A", "task"));
    processDefinition.addFlowObject(new BPMNEndEvent("_9", "End Event", "endEvent"));
    processDefinition.addSequenceFlow(new BPMNSequenceFlow("_4", null, "sequenceFlow", "_2", "_3"));
    processDefinition.addSequenceFlow(new BPMNSequenceFlow("_7", null, "sequenceFlow", "_3", "_5"));
    processDefinition.addSequenceFlow(new BPMNSequenceFlow("_10", null, "sequenceFlow", "_5", "_9"));

    var errorQueue = errorQueueModule.createErrorQueue();
    processDefinition.validate(errorQueue);

    var errors = errorQueue.getErrors();
    test.deepEqual(errors,
        [
            {
                "code": "GW1",
                "description": "The parallelGateway 'Parallel Gateway' must have more than one incoming or outgoing flow to work as gateway."
            }
        ],
        "testParallelGatewayValidate_GW1");
    test.done();
};