import { ConditionDD } from "@src/components/ddWidgets/executionControl/Condition";
import { DebugDD } from "@src/components/ddWidgets/executionControl/Debug";
import { HaltDD } from "@src/components/ddWidgets/executionControl/Halt";
import { JoinThreadsDD } from "@src/components/ddWidgets/executionControl/JoinThreads";
import { ManualControlDD } from "@src/components/ddWidgets/executionControl/ManualControl";
import { SleepDD } from "@src/components/ddWidgets/executionControl/Sleep";

import ConditionIcon from "@src/assets/img/icons/executionControl/condition.svg?transform";
import DebugIcon from "@src/assets/img/icons/executionControl/debug.svg?transform";
import HaltIcon from "@src/assets/img/icons/executionControl/halt.svg?transform";
import JoinThreadsIcon from "@src/assets/img/icons/executionControl/join-threads.svg?transform";
import ManualControlIcon from "@src/assets/img/icons/executionControl/manual-control.svg?transform";
import SleepIcon from "@src/assets/img/icons/executionControl/sleep.svg?transform";

export const ExecutionControlIcons = {
  condition: ConditionIcon,
  debug: DebugIcon,
  halt: HaltIcon,
  "join-threads": JoinThreadsIcon,
  "manual-control": ManualControlIcon,
  sleep: SleepIcon
};

export const ExecutionControl = [
  { type: "ddWidget", ddWidget: ConditionDD },
  { type: "ddWidget", ddWidget: DebugDD },
  { type: "ddWidget", ddWidget: HaltDD },
  { type: "ddWidget", ddWidget: JoinThreadsDD },
  { type: "ddWidget", ddWidget: ManualControlDD },
  { type: "ddWidget", ddWidget: SleepDD },
];
