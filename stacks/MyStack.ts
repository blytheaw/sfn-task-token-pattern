import {
  StackContext,
  Function as sstFunction,
} from "@serverless-stack/resources";
import { Duration } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import {
  IntegrationPattern,
  JsonPath,
  Parallel,
  Pass,
  StateMachine,
  TaskInput,
} from "aws-cdk-lib/aws-stepfunctions";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";

export function MyStack({ stack, app }: StackContext) {
  const taskTable = new Table(stack, "tasks", {
    partitionKey: {
      name: "jobId",
      type: AttributeType.STRING,
    },
  });

  stack.setDefaultFunctionProps({
    environment: {
      taskTable: taskTable.tableName,
    },
    permissions: [taskTable],
  });

  const encodeFunction = new sstFunction(stack, "encode", {
    handler: "functions/encode.handler",
    timeout: "1 minute",
  });

  const encode1 = new LambdaInvoke(stack, "Video Encoding Job", {
    lambdaFunction: encodeFunction,
    integrationPattern: IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    timeout: Duration.minutes(5),
    payload: TaskInput.fromObject({
      taskToken: JsonPath.taskToken,
      input: {
        jobId: "job1",
      },
    }),
  });

  const encode2 = new LambdaInvoke(stack, "Audio Encoding Job", {
    lambdaFunction: encodeFunction,
    integrationPattern: IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    timeout: Duration.minutes(5),
    payload: TaskInput.fromObject({
      taskToken: JsonPath.taskToken,
      input: {
        jobId: "job2",
      },
    }),
  });

  const parallel = new Parallel(stack, "Submit Encoding Jobs")
    .branch(encode1)
    .branch(encode2);

  const encodeComplete = new sstFunction(stack, "encode-complete", {
    handler: "functions/encode-complete.handler",
    permissions: ["states:SendTaskSuccess", "states:SendTaskFailure"],
  });

  new Rule(stack, "encode-complete-rule", {
    enabled: true,
    description: "MediaConvert Completed event rule",
    eventPattern: {
      source: ["aws.mediaconvert"],
      detail: {
        status: ["COMPLETE"],
        userMetadata: {
          jobId: [{ exists: true }],
        },
      },
    },
    targets: [new LambdaFunction(encodeComplete)],
  });

  new Rule(stack, "encode-error-rule", {
    enabled: true,
    description: "MediaConvert Error event rule",
    eventPattern: {
      source: ["aws.mediaconvert"],
      detail: {
        status: ["ERROR"],
        userMetadata: {
          jobId: [{ exists: true }],
        },
      },
    },
    targets: [new LambdaFunction(encodeComplete)],
  });

  const definition = parallel.next(
    new Pass(stack, "Post-processing with all the task outputs")
  );

  const statemachine = new StateMachine(stack, "statemachine", {
    definition: definition,
  });
}
