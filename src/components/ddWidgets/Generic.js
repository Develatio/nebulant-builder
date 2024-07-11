import { DefineEnvVarsDD } from "@src/components/ddWidgets/generic/DefineEnvVars";
import { DefineVariablesDD } from "@src/components/ddWidgets/generic/DefineVariables";
import { DownloadFilesDD } from "@src/components/ddWidgets/generic/DownloadFiles";
import { HttpRequestDD } from "@src/components/ddWidgets/generic/HttpRequest";
import { LogDD } from "@src/components/ddWidgets/generic/Log";
import { NoOpDD } from "@src/components/ddWidgets/generic/NoOp";
import { ReadFileDD } from "@src/components/ddWidgets/generic/ReadFile";
import { RunCommandDD } from "@src/components/ddWidgets/generic/RunCommand";
import { SendEmailDD } from "@src/components/ddWidgets/generic/SendEmail";
import { StickyNoteDD } from "@src/components/ddWidgets/generic/StickyNote";
import { UploadFilesDD } from "@src/components/ddWidgets/generic/UploadFiles";
import { WriteFileDD } from "@src/components/ddWidgets/generic/WriteFile";

import DefineEnvVarsIcon from "@src/assets/img/icons/generic/define-env-vars.svg?transform";
import DefineVariablesIcon from "@src/assets/img/icons/generic/define-variables.svg?transform";
import DownloadFilesIcon from "@src/assets/img/icons/generic/download_files.svg?transform";
import SendEmailIcon from "@src/assets/img/icons/generic/email.svg?transform";
import HttpRequestIcon from "@src/assets/img/icons/generic/http-request.svg?transform";
import LogIcon from "@src/assets/img/icons/generic/log.svg?transform";
import NoOpIcon from "@src/assets/img/icons/generic/no-op.svg?transform";
import ReadFileIcon from "@src/assets/img/icons/generic/read.svg?transform";
import RunCommandIcon from "@src/assets/img/icons/generic/run-script.svg?transform";
import StickyNoteIcon from "@src/assets/img/icons/generic/sticky_note.svg?transform";
import UploadFilesIcon from "@src/assets/img/icons/generic/upload_files.svg?transform";
import WriteFileIcon from "@src/assets/img/icons/generic/write.svg?transform";

export const GenericIcons = {
  "define-env-vars": DefineEnvVarsIcon,
  "define-variables": DefineVariablesIcon,
  "download_files": DownloadFilesIcon,
  "email": SendEmailIcon,
  "http-request": HttpRequestIcon,
  "log": LogIcon,
  "no-op": NoOpIcon,
  "read": ReadFileIcon,
  "run-script": RunCommandIcon,
  "sticky_note": StickyNoteIcon,
  "upload_files": UploadFilesIcon,
  "write": WriteFileIcon,
};

export const Generic = [
  { type: "ddWidget", ddWidget: DefineEnvVarsDD },
  { type: "ddWidget", ddWidget: DefineVariablesDD },
  { type: "ddWidget", ddWidget: DownloadFilesDD },
  { type: "ddWidget", ddWidget: HttpRequestDD },
  { type: "ddWidget", ddWidget: LogDD },
  { type: "ddWidget", ddWidget: NoOpDD },
  { type: "ddWidget", ddWidget: ReadFileDD },
  { type: "ddWidget", ddWidget: RunCommandDD },
  { type: "ddWidget", ddWidget: SendEmailDD },
  { type: "ddWidget", ddWidget: StickyNoteDD },
  { type: "ddWidget", ddWidget: UploadFilesDD },
  { type: "ddWidget", ddWidget: WriteFileDD },
];
