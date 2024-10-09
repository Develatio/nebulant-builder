import { AllocateAddressDD } from "@src/components/ddWidgets/aws/AllocateAddress";
import { AttachAddressDD } from "@src/components/ddWidgets/aws/AttachAddress";
import { AttachVolumeDD } from "@src/components/ddWidgets/aws/AttachVolume";
import { CreateInstanceDD } from "@src/components/ddWidgets/aws/CreateInstance";
import { CreateVolumeDD } from "@src/components/ddWidgets/aws/CreateVolume";
import { DeleteKeyPairDD } from "@src/components/ddWidgets/aws/DeleteKeyPair";
import { DeleteSecurityGroupDD } from "@src/components/ddWidgets/aws/DeleteSecurityGroup";
import { DeleteVolumeDD } from "@src/components/ddWidgets/aws/DeleteVolume";
import { DetachAddressDD } from "@src/components/ddWidgets/aws/DetachAddress";
import { DetachVolumeDD } from "@src/components/ddWidgets/aws/DetachVolume";
import { FindAddressDD } from "@src/components/ddWidgets/aws/FindAddress";
import { FindImageDD } from "@src/components/ddWidgets/aws/FindImage";
import { FindInstanceDD } from "@src/components/ddWidgets/aws/FindInstance";
import { FindInstancesDD } from "@src/components/ddWidgets/aws/FindInstances";
import { FindKeyPairDD } from "@src/components/ddWidgets/aws/FindKeyPair";
import { FindNetworkInterfaceDD } from "@src/components/ddWidgets/aws/FindNetworkInterface";
import { FindSecurityGroupDD } from "@src/components/ddWidgets/aws/FindSecurityGroup";
import { FindSubnetDD } from "@src/components/ddWidgets/aws/FindSubnet";
import { FindVPCDD } from "@src/components/ddWidgets/aws/FindVPC";
import { FindVolumeDD } from "@src/components/ddWidgets/aws/FindVolume";
import { ReleaseAddressDD } from "@src/components/ddWidgets/aws/ReleaseAddress";
import { SetRegionDD } from "@src/components/ddWidgets/aws/SetRegion";
import { StartInstanceDD } from "@src/components/ddWidgets/aws/StartInstance";
import { StopInstanceDD } from "@src/components/ddWidgets/aws/StopInstance";
import { TerminateInstanceDD } from "@src/components/ddWidgets/aws/TerminateInstance";

import SetRegionIcon from "@src/assets/img/icons/aws/region.svg?transform";
import ImageIcon from "@src/assets/img/icons/aws/ami.svg?transform";
import AddressIcon from "@src/assets/img/icons/aws/eip.svg?transform";
import VolumeIcon from "@src/assets/img/icons/aws/ebs.svg?transform";
import InstanceIcon from "@src/assets/img/icons/aws/ec2.svg?transform";
import SecurityGroupIcon from "@src/assets/img/icons/aws/security_group.svg?transform";
import KeyPairIcon from "@src/assets/img/icons/aws/key_pair.svg?transform";
import SubnetIcon from "@src/assets/img/icons/aws/subnet.svg?transform";
import VPCIcon from "@src/assets/img/icons/aws/vpc.svg?transform";
import NetworkInterfaceIcon from "@src/assets/img/icons/aws/iface.svg?transform";

export const AWSIcons = {
  "set-region": SetRegionIcon,
  ami: ImageIcon,
  eip: AddressIcon,
  ebs: VolumeIcon,
  ec2: InstanceIcon,
  security_group: SecurityGroupIcon,
  key_pair: KeyPairIcon,
  subnet: SubnetIcon,
  vpc: VPCIcon,
  iface: NetworkInterfaceIcon,
};

export const AWS = [
  { type: "ddWidget", ddWidget: SetRegionDD },

  {
    type: "ddGroup",
    name: "eip",
    label: "Elastic IP",
    icon: "eip",
    ddWidgets: [
      { type: "ddWidget", ddWidget: AllocateAddressDD },
      { type: "ddWidget", ddWidget: AttachAddressDD },
      { type: "ddWidget", ddWidget: DetachAddressDD },
      { type: "ddWidget", ddWidget: FindAddressDD },
      { type: "ddWidget", ddWidget: ReleaseAddressDD },
    ]
  },

  {
    type: "ddGroup",
    name: "ami",
    label: "Image",
    icon: "ami",
    ddWidgets: [
      { type: "ddWidget", ddWidget: FindImageDD },
    ]
  },

  {
    type: "ddGroup",
    name: "ec2",
    label: "Instance",
    icon: "ec2",
    ddWidgets: [
      { type: "ddWidget", ddWidget: CreateInstanceDD },
      { type: "ddWidget", ddWidget: FindInstanceDD },
      { type: "ddWidget", ddWidget: FindInstancesDD },
      { type: "ddWidget", ddWidget: StartInstanceDD },
      { type: "ddWidget", ddWidget: StopInstanceDD },
      { type: "ddWidget", ddWidget: TerminateInstanceDD },
    ]
  },

  {
    type: "ddGroup",
    name: "key_pair",
    label: "Key pair",
    icon: "key_pair",
    ddWidgets: [
      { type: "ddWidget", ddWidget: DeleteKeyPairDD },
      { type: "ddWidget", ddWidget: FindKeyPairDD },
    ]
  },

  {
    type: "ddGroup",
    name: "iface",
    label: "Network interface",
    icon: "iface",
    ddWidgets: [
      { type: "ddWidget", ddWidget: FindNetworkInterfaceDD },
    ]
  },

  {
    type: "ddGroup",
    name: "security_group",
    label: "Security group",
    icon: "security_group",
    ddWidgets: [
      { type: "ddWidget", ddWidget: DeleteSecurityGroupDD },
      { type: "ddWidget", ddWidget: FindSecurityGroupDD },
    ]
  },

  {
    type: "ddGroup",
    name: "subnet",
    label: "Subnet",
    icon: "subnet",
    ddWidgets: [
      { type: "ddWidget", ddWidget: FindSubnetDD },
    ]
  },

  {
    type: "ddGroup",
    name: "ebs",
    label: "Volume",
    icon: "ebs",
    ddWidgets: [
      { type: "ddWidget", ddWidget: AttachVolumeDD },
      { type: "ddWidget", ddWidget: CreateVolumeDD },
      { type: "ddWidget", ddWidget: DeleteVolumeDD },
      { type: "ddWidget", ddWidget: DetachVolumeDD },
      { type: "ddWidget", ddWidget: FindVolumeDD },
    ]
  },

  {
    type: "ddGroup",
    name: "vpc",
    label: "VPC",
    icon: "vpc",
    ddWidgets: [
      { type: "ddWidget", ddWidget: FindVPCDD },
    ]
  },
];
