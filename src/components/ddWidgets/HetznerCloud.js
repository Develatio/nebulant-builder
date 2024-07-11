import { AddRouteToNetworkDD } from "@src/components/ddWidgets/hetznerCloud/AddRouteToNetwork";
import { AddServiceToLoadBalancerDD } from "@src/components/ddWidgets/hetznerCloud/AddServiceToLoadBalancer";
import { AddTargetToLoadBalancerDD } from "@src/components/ddWidgets/hetznerCloud/AddTargetToLoadBalancer";
import { ApplyFirewallToResourceDD } from "@src/components/ddWidgets/hetznerCloud/ApplyFirewallToResource";
import { AssignFloatingIPDD } from "@src/components/ddWidgets/hetznerCloud/AssignFloatingIP";
import { AssignPrimaryIPDD } from "@src/components/ddWidgets/hetznerCloud/AssignPrimaryIP";
import { AttachLoadBalancerToNetworkDD } from "@src/components/ddWidgets/hetznerCloud/AttachLoadBalancerToNetwork";
import { AttachServerToNetworkDD } from "@src/components/ddWidgets/hetznerCloud/AttachServerToNetwork";
import { AttachVolumeDD } from "@src/components/ddWidgets/hetznerCloud/AttachVolume";
import { CreateFirewallDD } from "@src/components/ddWidgets/hetznerCloud/CreateFirewall";
import { CreateFloatingIPDD } from "@src/components/ddWidgets/hetznerCloud/CreateFloatingIP";
import { CreateImageDD } from "@src/components/ddWidgets/hetznerCloud/CreateImage";
import { CreateLoadBalancerDD } from "@src/components/ddWidgets/hetznerCloud/CreateLoadBalancer";
import { CreateNetworkDD } from "@src/components/ddWidgets/hetznerCloud/CreateNetwork";
import { CreatePrimaryIPDD } from "@src/components/ddWidgets/hetznerCloud/CreatePrimaryIP";
import { CreateServerDD } from "@src/components/ddWidgets/hetznerCloud/CreateServer";
import { CreateSshKeyDD } from "@src/components/ddWidgets/hetznerCloud/CreateSshKey";
import { CreateSubnetDD } from "@src/components/ddWidgets/hetznerCloud/CreateSubnet";
import { CreateVolumeDD } from "@src/components/ddWidgets/hetznerCloud/CreateVolume";
import { DeleteFirewallDD } from "@src/components/ddWidgets/hetznerCloud/DeleteFirewall";
import { DeleteFloatingIPDD } from "@src/components/ddWidgets/hetznerCloud/DeleteFloatingIP";
import { DeleteImageDD } from "@src/components/ddWidgets/hetznerCloud/DeleteImage";
import { DeleteLoadBalancerDD } from "@src/components/ddWidgets/hetznerCloud/DeleteLoadBalancer";
import { DeleteNetworkDD } from "@src/components/ddWidgets/hetznerCloud/DeleteNetwork";
import { DeletePrimaryIPDD } from "@src/components/ddWidgets/hetznerCloud/DeletePrimaryIP";
import { DeleteServerDD } from "@src/components/ddWidgets/hetznerCloud/DeleteServer";
import { DeleteSshKeyDD } from "@src/components/ddWidgets/hetznerCloud/DeleteSshKey";
import { DeleteSubnetDD } from "@src/components/ddWidgets/hetznerCloud/DeleteSubnet";
import { DeleteVolumeDD } from "@src/components/ddWidgets/hetznerCloud/DeleteVolume";
import { DetachLoadBalancerFromNetworkDD } from "@src/components/ddWidgets/hetznerCloud/DetachLoadBalancerFromNetwork";
import { DetachServerFromNetworkDD } from "@src/components/ddWidgets/hetznerCloud/DetachServerFromNetwork";
import { DetachVolumeDD } from "@src/components/ddWidgets/hetznerCloud/DetachVolume";
import { FindFirewallDD } from "@src/components/ddWidgets/hetznerCloud/FindFirewall";
import { FindFloatingIPDD } from "@src/components/ddWidgets/hetznerCloud/FindFloatingIP";
import { FindFloatingIPsDD } from "@src/components/ddWidgets/hetznerCloud/FindFloatingIPs";
import { FindImageDD } from "@src/components/ddWidgets/hetznerCloud/FindImage";
import { FindImagesDD } from "@src/components/ddWidgets/hetznerCloud/FindImages";
import { FindLoadBalancerDD } from "@src/components/ddWidgets/hetznerCloud/FindLoadBalancer";
import { FindLoadBalancersDD } from "@src/components/ddWidgets/hetznerCloud/FindLoadBalancers";
import { FindNetworkDD } from "@src/components/ddWidgets/hetznerCloud/FindNetwork";
import { FindNetworksDD } from "@src/components/ddWidgets/hetznerCloud/FindNetworks";
import { FindPrimaryIPDD } from "@src/components/ddWidgets/hetznerCloud/FindPrimaryIP";
import { FindPrimaryIPsDD } from "@src/components/ddWidgets/hetznerCloud/FindPrimaryIPs";
import { FindServerDD } from "@src/components/ddWidgets/hetznerCloud/FindServer";
import { FindServersDD } from "@src/components/ddWidgets/hetznerCloud/FindServers";
import { FindSshKeyDD } from "@src/components/ddWidgets/hetznerCloud/FindSshKey";
import { FindSshKeysDD } from "@src/components/ddWidgets/hetznerCloud/FindSshKeys";
import { FindVolumeDD } from "@src/components/ddWidgets/hetznerCloud/FindVolume";
import { FindVolumesDD } from "@src/components/ddWidgets/hetznerCloud/FindVolumes";
import { RemoveFirewallFromResourceDD } from "@src/components/ddWidgets/hetznerCloud/RemoveFirewallFromResource";
import { RemoveRouteFromNetworkDD } from "@src/components/ddWidgets/hetznerCloud/RemoveRouteFromNetwork";
import { RemoveServiceFromLoadBalancerDD } from "@src/components/ddWidgets/hetznerCloud/RemoveServiceFromLoadBalancer";
import { RemoveTargetFromLoadBalancerDD } from "@src/components/ddWidgets/hetznerCloud/RemoveTargetFromLoadBalancer";
import { StartServerDD } from "@src/components/ddWidgets/hetznerCloud/StartServer";
import { StopServerDD } from "@src/components/ddWidgets/hetznerCloud/StopServer";
import { UnassignFloatingIPDD } from "@src/components/ddWidgets/hetznerCloud/UnassignFloatingIP";
import { UnassignPrimaryIPDD } from "@src/components/ddWidgets/hetznerCloud/UnassignPrimaryIP";

import NetworkIcon from "@src/assets/img/icons/hetznerCloud/network.svg?transform";
import VolumeIcon from "@src/assets/img/icons/hetznerCloud/volume.svg?transform";
import LoadBalancerIcon from "@src/assets/img/icons/hetznerCloud/load_balancer.svg?transform";
import FirewallIcon from "@src/assets/img/icons/hetznerCloud/firewall.svg?transform";
import FloatingIPIcon from "@src/assets/img/icons/hetznerCloud/floating_ip.svg?transform";
import PrimaryIPIcon from "@src/assets/img/icons/hetznerCloud/primary_ip.svg?transform";
import ImageIcon from "@src/assets/img/icons/hetznerCloud/image.svg?transform";
import ServerIcon from "@src/assets/img/icons/hetznerCloud/server.svg?transform";
import SshKeyIcon from "@src/assets/img/icons/hetznerCloud/ssh_key.svg?transform";
import SubnetIcon from "@src/assets/img/icons/hetznerCloud/subnet.svg?transform";

export const HetznerCloudIcons = {
  network: NetworkIcon,
  volume: VolumeIcon,
  load_balancer: LoadBalancerIcon,
  firewall: FirewallIcon,
  floating_ip: FloatingIPIcon,
  primary_ip: PrimaryIPIcon,
  image: ImageIcon,
  server: ServerIcon,
  ssh_key: SshKeyIcon,
  subnet: SubnetIcon,
};

export const HetznerCloud = [
  {
    type: "ddGroup",
    name: "network",
    label: "Network",
    icon: "network",
    ddWidgets: [
      { type: "ddWidget", ddWidget: AddRouteToNetworkDD },
      { type: "ddWidget", ddWidget: CreateNetworkDD },
      { type: "ddWidget", ddWidget: DeleteNetworkDD },
      { type: "ddWidget", ddWidget: FindNetworkDD },
      { type: "ddWidget", ddWidget: FindNetworksDD },
      { type: "ddWidget", ddWidget: RemoveRouteFromNetworkDD },
    ]
  },

  {
    type: "ddGroup",
    name: "volume",
    label: "Volume",
    icon: "volume",
    ddWidgets: [
      { type: "ddWidget", ddWidget: AttachVolumeDD },
      { type: "ddWidget", ddWidget: CreateVolumeDD },
      { type: "ddWidget", ddWidget: DeleteVolumeDD },
      { type: "ddWidget", ddWidget: DetachVolumeDD },
      { type: "ddWidget", ddWidget: FindVolumeDD },
      { type: "ddWidget", ddWidget: FindVolumesDD },
    ]
  },

  {
    type: "ddGroup",
    name: "load_balancer",
    label: "Load balancer",
    icon: "load_balancer",
    ddWidgets: [
      { type: "ddWidget", ddWidget: AddServiceToLoadBalancerDD },
      { type: "ddWidget", ddWidget: AddTargetToLoadBalancerDD },
      { type: "ddWidget", ddWidget: AttachLoadBalancerToNetworkDD },
      { type: "ddWidget", ddWidget: CreateLoadBalancerDD },
      { type: "ddWidget", ddWidget: DeleteLoadBalancerDD },
      { type: "ddWidget", ddWidget: DetachLoadBalancerFromNetworkDD },
      { type: "ddWidget", ddWidget: FindLoadBalancerDD },
      { type: "ddWidget", ddWidget: FindLoadBalancersDD },
      { type: "ddWidget", ddWidget: RemoveServiceFromLoadBalancerDD },
      { type: "ddWidget", ddWidget: RemoveTargetFromLoadBalancerDD },
    ]
  },

  {
    type: "ddGroup",
    name: "firewall",
    label: "Firewall",
    icon: "firewall",
    ddWidgets: [
      { type: "ddWidget", ddWidget: ApplyFirewallToResourceDD },
      { type: "ddWidget", ddWidget: CreateFirewallDD },
      { type: "ddWidget", ddWidget: DeleteFirewallDD },
      { type: "ddWidget", ddWidget: FindFirewallDD },
      { type: "ddWidget", ddWidget: RemoveFirewallFromResourceDD },
    ]
  },

  {
    type: "ddGroup",
    name: "floating_ip",
    label: "Floating IP",
    icon: "floating_ip",
    ddWidgets: [
      { type: "ddWidget", ddWidget: AssignFloatingIPDD },
      { type: "ddWidget", ddWidget: CreateFloatingIPDD },
      { type: "ddWidget", ddWidget: DeleteFloatingIPDD },
      { type: "ddWidget", ddWidget: FindFloatingIPDD },
      { type: "ddWidget", ddWidget: FindFloatingIPsDD },
      { type: "ddWidget", ddWidget: UnassignFloatingIPDD },
    ]
  },

  {
    type: "ddGroup",
    name: "primary_ip",
    label: "Primary IP",
    icon: "primary_ip",
    ddWidgets: [
      { type: "ddWidget", ddWidget: AssignPrimaryIPDD },
      { type: "ddWidget", ddWidget: CreatePrimaryIPDD },
      { type: "ddWidget", ddWidget: DeletePrimaryIPDD },
      { type: "ddWidget", ddWidget: FindPrimaryIPDD },
      { type: "ddWidget", ddWidget: FindPrimaryIPsDD },
      { type: "ddWidget", ddWidget: UnassignPrimaryIPDD },
    ]
  },

  {
    type: "ddGroup",
    name: "image",
    label: "Image",
    icon: "image",
    ddWidgets: [
      { type: "ddWidget", ddWidget: CreateImageDD },
      { type: "ddWidget", ddWidget: DeleteImageDD },
      { type: "ddWidget", ddWidget: FindImageDD },
      { type: "ddWidget", ddWidget: FindImagesDD },
    ]
  },

  {
    type: "ddGroup",
    name: "server",
    label: "Server",
    icon: "server",
    ddWidgets: [
      { type: "ddWidget", ddWidget: AttachServerToNetworkDD },
      { type: "ddWidget", ddWidget: CreateServerDD },
      { type: "ddWidget", ddWidget: DeleteServerDD },
      { type: "ddWidget", ddWidget: DetachServerFromNetworkDD },
      { type: "ddWidget", ddWidget: FindServerDD },
      { type: "ddWidget", ddWidget: FindServersDD },
      { type: "ddWidget", ddWidget: StartServerDD },
      { type: "ddWidget", ddWidget: StopServerDD },
    ]
  },

  {
    type: "ddGroup",
    name: "ssh_key",
    label: "SSH key",
    icon: "ssh_key",
    ddWidgets: [
      { type: "ddWidget", ddWidget: CreateSshKeyDD },
      { type: "ddWidget", ddWidget: DeleteSshKeyDD },
      { type: "ddWidget", ddWidget: FindSshKeyDD },
      { type: "ddWidget", ddWidget: FindSshKeysDD },
    ]
  },

  {
    type: "ddGroup",
    name: "subnet",
    label: "Subnet",
    icon: "subnet",
    ddWidgets: [
      { type: "ddWidget", ddWidget: CreateSubnetDD },
      { type: "ddWidget", ddWidget: DeleteSubnetDD },
    ]
  },
];
