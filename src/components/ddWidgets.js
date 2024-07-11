import { ExecutionControl, ExecutionControlIcons } from "@src/components/ddWidgets/ExecutionControl";
import { Generic, GenericIcons } from "@src/components/ddWidgets/Generic";
import { HetznerCloud, HetznerCloudIcons } from "@src/components/ddWidgets/HetznerCloud";
import { AWS, AWSIcons } from "@src/components/ddWidgets/AWS";

export const icons = {
  executionControl: ExecutionControlIcons,
  generic: GenericIcons,
  hetznerCloud: HetznerCloudIcons,
  aws: AWSIcons,
};

export const providers = [
  {
    name: "executionControl",
    label: "Execution control",
    actions: ExecutionControl,
  },
  {
    name: "generic",
    label: "Generic",
    actions: Generic,
  },
  {
    name: "aws",
    label: "AWS",
    actions: AWS,
  },
  {
    name: "hetznerCloud",
    label: "Hetzner cloud",
    actions: HetznerCloud,
  },
  {
    name: "azure",
    label: "Azure",
    actions: [],
  },
  {
    name: "googleCloud",
    label: "Google cloud",
    actions: [],
  },
  {
    name: "ovhCloud",
    label: "OVH cloud",
    actions: [],
  },
  {
    name: "cloudflare",
    label: "Cloudflare",
    actions: [],
  },
];
