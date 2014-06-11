/**
 * Copyright: E2E Technologies Ltd
 */
"use strict";

var path = require('path');
var bpmn = require('../../../lib/public.js');

exports.testSendingWrongEventInCollaboration = function(test) {
    bpmn.clearCache();

    var fileName = path.join(__dirname, "../../resources/projects/collaboration/collaboration.bpmn");
    bpmn.createStandaloneCollaboratingProcesses(fileName, function(err, collaboratingProcesses){
        var secondProcess = collaboratingProcesses[0];
        try {
            secondProcess.triggerEvent("Wrong Event!");
        } catch (e) {
            var message = e.message;
            test.equal(message, "The process 'My First Process' does not know the event 'Wrong Event!'", "testSendingWrongEventInCollaboration");
            test.done();
        }
    });


};

exports.testCreateVolatileCollaborationOfBPMNProcesses = function(test) {
    bpmn.clearCache();

    var fileName = path.join(__dirname, "../../resources/projects/collaboration/collaboration.bpmn");

    bpmn.createStandaloneCollaboratingProcesses(fileName, function(err, collaboratingProcesses){
        var firstProcess = collaboratingProcesses[0];
        var secondProcess = collaboratingProcesses[1];
        secondProcess.triggerEvent("Start Event 2");

        var firstProcessDefinition = firstProcess.getProcessDefinition();
        var endEvent1 = firstProcessDefinition.getFlowObjectByName("End Event 1");
        var outgoingMessageFlows = firstProcessDefinition.getOutgoingMessageFlows(endEvent1);
        test.deepEqual(outgoingMessageFlows,
            [
                {
                    "bpmnId": "_26",
                    "name": "MY_MESSAGE",
                    "type": "messageFlow",
                    "sourceRef": "_6",
                    "targetRef": "_22",
                    "targetProcessDefinitionId": "PROCESS_2",
                    "sourceProcessDefinitionId": "PROCESS_1"
                }
            ],
            "testCreateVolatileCollaborationOfBPMNProcesses: outgoingMessageFlows of endEvent1");

        var secondProcessDefinition = secondProcess.getProcessDefinition();
        var intermediateCatchEvent = secondProcessDefinition.getFlowObjectByName("Catch MY_MESSAGE");
        var incomingMessageFlows = secondProcessDefinition.getIncomingMessageFlows(intermediateCatchEvent);
        test.deepEqual(incomingMessageFlows,
            [
                {
                    "bpmnId": "_26",
                    "name": "MY_MESSAGE",
                    "type": "messageFlow",
                    "sourceRef": "_6",
                    "targetRef": "_22",
                    "targetProcessDefinitionId": "PROCESS_2",
                    "sourceProcessDefinitionId": "PROCESS_1"
                }
            ],
            "testCreateVolatileCollaborationOfBPMNProcesses: incomingMessageFlows of intermediateCatchEvent");

        process.nextTick(function() {
            var firstHistory = firstProcess.getHistory();
            test.deepEqual(firstHistory,
                {
                    "historyEntries": [
                        {
                            "name": "Start Event 1",
                            "type": "startEvent",
                            "begin": "_dummy_ts_",
                            "end": "_dummy_ts_"
                        },
                        {
                            "name": "Task 1",
                            "type": "serviceTask",
                            "begin": "_dummy_ts_",
                            "end": "_dummy_ts_"
                        },
                        {
                            "name": "End Event 1",
                            "type": "endEvent",
                            "begin": "_dummy_ts_",
                            "end": "_dummy_ts_"
                        }
                    ],
                    "createdAt": "_dummy_ts_",
                    "finishedAt": "_dummy_ts_"
                },
                "testCreateVolatileCollaborationOfBPMNProcesses: history of process 1"
            );
            var secondHistory = secondProcess.getHistory();
            test.deepEqual(secondHistory,
                {
                    "historyEntries": [
                        {
                            "name": "Start Event 2",
                            "type": "startEvent",
                            "begin": "_dummy_ts_",
                            "end": "_dummy_ts_"
                        },
                        {
                            "name": "Task 2",
                            "type": "serviceTask",
                            "begin": "_dummy_ts_",
                            "end": "_dummy_ts_"
                        },
                        {
                            "name": "Catch MY_MESSAGE",
                            "type": "intermediateCatchEvent",
                            "begin": "_dummy_ts_",
                            "end": "_dummy_ts_"
                        },
                        {
                            "name": "End Event 2",
                            "type": "endEvent",
                            "begin": "_dummy_ts_",
                            "end": "_dummy_ts_"
                        }
                    ],
                    "createdAt": "_dummy_ts_",
                    "finishedAt": "_dummy_ts_"
                },
                "testCreateVolatileCollaborationOfBPMNProcesses: history of process 2"
            );
            test.done();
        });
    });


};
