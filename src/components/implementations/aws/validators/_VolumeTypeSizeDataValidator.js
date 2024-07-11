import { object, string, array, number } from "yup";

export const VolumeTypeSizeDataValidator = object({
  Iops: number().label("IOPS").when(["VolumeType", "Size"], ([VolumeType, Size], schema) => {
    let max;
    const [vt] = VolumeType || [];

    switch (vt) {
      case "gp3":
        // IOPS is the size multiplied by 500, but in any case it must be bigger
        // than 3000 and smaller than 16000
        max = Math.max(3000, Math.min(Size * 500, 16000));
        return schema.min(3000).max(max).default(3000);

      case "io1":
        // IOPS is the size multiplied by 50, but in any case it must be bigger
        // than 100 and smaller than 64000
        max = Math.max(100, Math.min(Size * 50, 64000));
        return schema.min(100).max(max).default(100).required();

      case "io2":
        // IOPS is the size multiplied by 1000, but in any case it must be bigger
        // than 100 and smaller than 256000
        max = Math.max(100, Math.min(Size * 1000, 256000));
        return schema.min(100).max(max).default(100).required();

      default:
        return;
    }
  }),
  Size: number().required().label("Size").when("VolumeType", ([VolumeType], schema) => {
    const [vt] = VolumeType || [];
    switch (vt) {
      case "standard":
        return schema.min(1).max(1024).default(10);

      case "gp2":
      case "gp3":
        return schema.min(1).max(16384).default(10);

      case "io1":
        return schema.min(4).max(16384).default(10);

      case "io2":
        return schema.min(4).max(65536).default(10);

      case "sc1":
      case "st1":
        return schema.min(125).max(16384).default(125);

      default:
        return schema;
    }
  }),
  Throughput: number().label("Throughput").when(["VolumeType", "Iops"], ([VolumeType, Iops], schema) => {
    let max;
    const [vt] = VolumeType || [];

    switch (vt) {
      case "gp3":
        // Throughput is the IOPS multiplied by 0.25, but in any case it must be
        // bigger than 125 and smaller than 1000
        max = Math.ceil(Math.max(125, Math.min(Iops * 0.25, 1000)));
        return schema.min(125).max(max).default(125);

      default:
        return schema;
    }
  }),
  VolumeType: array().of(string()).label("Volume type").default(["gp3"]),
});
