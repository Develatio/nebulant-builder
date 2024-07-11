import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Alert from "react-bootstrap/esm/Alert";
import FormLabel from "react-bootstrap/esm/FormLabel";

import { ROField } from "@src/ui/functionality/ROField";
import { RangeInput } from "@src/ui/functionality/RangeInput";
import { DropdownInput } from "@src/ui/functionality/DropdownInput";

import { StaticAutocompleter } from "@src/components/autocompleters/base/StaticAutocompleter";

import { EBS_VOLUME_TYPE } from "./_ebs_volume_types";

export const VolumeTypeSizeSettings = (props) => {
  const sizeRules = props.node.validator.resolveRules({
    fieldPath: "parameters.Size",
    fieldRules: ["min", "max"],
    data: props.form.values.parameters,
    node: props.node,
  });

  const iopsRules = props.node.validator.resolveRules({
    fieldPath: "parameters.Iops",
    fieldRules: ["min", "max"],
    data: props.form.values.parameters,
    node: props.node,
  });

  const throughputRules = props.node.validator.resolveRules({
    fieldPath: "parameters.Throughput",
    fieldRules: ["min", "max"],
    data: props.form.values.parameters,
    node: props.node,
  });

  return (
    <Row>
      <Col sm={6}>
        <DropdownInput
          form={props.form}
          validations={props.validations}
          path={"parameters.VolumeType"}
          label={"Volume type"}
          help_text={"The volume type."}
          editable={false}
          multi={false}
          options={[
            ({ searchPattern, page, perPage, group, pagingDetails }) => {
              return new StaticAutocompleter({
                data: EBS_VOLUME_TYPE,
                filters: { searchPattern, page, perPage, group, pagingDetails },
              }).run();
            },
          ]}
        ></DropdownInput>

        <RangeInput
          node={props.node}
          form={props.form}
          validations={props.validations}
          min={sizeRules.find(r => r.rule == "min")?.value}
          max={sizeRules.find(r => r.rule == "max")?.value}
          path={"parameters.Size"}
          label={"Size"}
          sliderSuffix={" GiBs"}
          suffix="GiBs"
          help_text={"The size of the volume, in GiBs."}
        ></RangeInput>

        {
          props.form.get("parameters.VolumeType")[0] == "gp2" && (
            <ROField
              value={
                <>
                  {
                    props.form.get("parameters.Size") < 1000 ? (
                      <>
                        <span className="fw-bold me-2">
                          Base: {Math.max(100, Math.min(props.form.get("parameters.Size") * 3, 3000))}
                        </span>
                        <small>(<code>Disk size * 3</code>, min 100, max 3000)</small>
                        <hr className="my-1 w-100" />
                        <span className="fw-bold me-2">
                          Burst: 3000
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="fw-bold me-2">
                          {Math.max(100, Math.min(props.form.get("parameters.Size") * 3, 3000))}
                        </span>
                        <small>(<code>Disk size * 3</code>, min 100, max 3000)</small>
                      </>
                    )
                  }
                </>
              }
              label={"IOPS"}
              help_text={"The number of I/O operations per second (IOPS)."}
            ></ROField>
          )
        }

        {
          ["io1", "io2", "gp3"].includes(props.form.get("parameters.VolumeType")[0]) && (
            <RangeInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              min={iopsRules.find(r => r.rule == "min")?.value}
              max={iopsRules.find(r => r.rule == "max")?.value}
              path={"parameters.Iops"}
              label={"IOPS"}
              sliderSuffix={" IOPS"}
              suffix="IOPS"
              help_text={"The number of I/O operations per second (IOPS)."}
            ></RangeInput>
          )
        }

        {
          props.form.get("parameters.VolumeType")[0] == "gp3" && (
            <RangeInput
              node={props.node}
              form={props.form}
              validations={props.validations}
              min={throughputRules.find(r => r.rule == "min")?.value}
              max={throughputRules.find(r => r.rule == "max")?.value}
              path={"parameters.Throughput"}
              label={"Throughput"}
              sliderSuffix={" MiB/s"}
              suffix="MiB/s"
              help_text={"The throughput to provision for the volume."}
            ></RangeInput>
          )
        }

        {
          props.form.get("parameters.VolumeType")[0] == "sc1" && (
            <ROField
              value={
                <>
                  <span className="fw-bold me-2">
                    Base: {Math.max(1.5, Math.min(Math.ceil((props.form.get("parameters.Size") / 1024) * 12), 192))} MiB/s
                  </span>
                  <small>(<code>(Disk size / 1024) * 12</code>, min 1.5, max 192)</small>
                  <hr className="my-1 w-100" />
                  <span className="fw-bold me-2">
                    Burst: {Math.max(10, Math.min(Math.ceil((props.form.get("parameters.Size") / 1024) * 80), 250))} MiB/s
                  </span>
                  <small>(<code>(Disk size / 1024) * 80</code>, min 10, max 250)</small>
                </>
              }
              label={"Throughput"}
              help_text={"The throughput to provision for the volume."}
            ></ROField>
          )
        }

        {
          props.form.get("parameters.VolumeType")[0] == "st1" && (
            <ROField
              value={
                <>
                  <span className="fw-bold me-2">
                    Base: {Math.max(5, Math.min(Math.ceil((props.form.get("parameters.Size") / 1024) * 40), 500))} MiB/s
                  </span>
                  <small>(<code>(Disk size / 1024) * 40</code>, min 5, max 500)</small>
                  <hr className="my-1 w-100" />
                  <span className="fw-bold me-2">
                    Burst: {Math.max(31, Math.min(Math.ceil((props.form.get("parameters.Size") / 1024) * 250), 500))} MiB/s
                  </span>
                  <small>(<code>(Disk size / 1024) * 250</code>, min 31, max 500)</small>
                </>
              }
              label={"Throughput"}
              help_text={"The throughput to provision for the volume."}
            ></ROField>
          )
        }
      </Col>

      <Col sm={6} className="d-flex flex-column">
        <FormLabel>{"\u00A0"}</FormLabel>
        <Alert variant="info" className="py-1 small">
          {
            props.form.get("parameters.VolumeType")[0] == "standard" && (
              <>
                <b>Standard</b> volumes are suitable for small-scale workloads where throughput isn't a
                requiremet.
              </>
            )
          }

          {
            props.form.get("parameters.VolumeType")[0] == "gp2" && (
              <>
                <b>GP2</b> volumes scale IOPS with the size of the volume.
                You're given a base of <code>{iopsRules.find(r => r.rule == "min")?.value} IOPS</code> and
                an additional 3 IOPS per GiB after exceeding 33GiB, with a maximum of <code>
                {iopsRules.find(r => r.rule == "max")?.value} IOPS</code>.
                The throughput also scales up with the volume size.
              </>
            )
          }

          {
            props.form.get("parameters.VolumeType")[0] == "gp3" && (
              <>
                <b>GP3</b> volumes can be assigned any IOPS value between <code>
                {iopsRules.find(r => r.rule == "min")?.value} IOPS</code> and <code>
                {iopsRules.find(r => r.rule == "max")?.value} IOPS</code>.
                Similarly, the throughput can be assigned any MiB/s value between <code>
                {throughputRules.find(r => r.rule == "min")?.value} MiB/s</code> and <code>
                {throughputRules.find(r => r.rule == "max")?.value} MiB/s</code>.
              </>
            )
          }

          {
            props.form.get("parameters.VolumeType")[0] == "io1" && (
              <>
                <b>IO1</b> volumes offer higher IO and throughput performance and lower latency than
                the general purpose volumes. IOPS vary depending on the size of the volume. You're
                given a base of <code>100 IOPS</code> and an additional <code>50 IOPS</code> per
                GiB.
              </>
            )
          }

          {
            props.form.get("parameters.VolumeType")[0] == "io2" && (
              <>
                <b>IO2</b> volumes offer higher IO and throughput performance and lower latency than
                the general purpose volumes. IOPS vary depending on the size of the volume. You're
                given a base of <code>100 IOPS</code> and an additional <code>1000 IOPS</code> per
                GiB.
              </>
            )
          }

          {
            ["sc1", "st1"].includes(props.form.get("parameters.VolumeType")[0]) && (
              <>
                <b>{props.form.get("parameters.VolumeType")[0].toUpperCase()}</b> volumes are suitable for
                storing infrequently accessed data. They have higher capacity and performance than the
                standard magnetic volumes. The throughput varies depending on the size of the volume.
              </>
            )
          }

          <br />
          <br />

          <b>IOPS</b> stands for "Input/Output Operations per Second". It measures how many read/write
          operations the volume can do in a single second.

          If an I/O operation is bigger than <code>256 KiB</code>, the operation is split into multiple operations.
          This means that if you perform a read/write operation of <code>1024 KiB</code>, that will take <code>
          4 IOPS</code> because <code>1024/256 = 4</code>.

          Random (non-sequential) read/writes of data smaller than <code>256 KiB</code> can also result in
          performing multiple operations.

          You can hit the IOPS limits more quickly if each operation is larger than <code>256 KiB</code>.

          <br />
          <br />

          <b>Throughput</b> is the measure of the amount of data transferred from/to a storage device in a second.

          If your operations are <code>256 KiB</code> in size, and the volume's max throughput is <code>250 MiB/s</code>,
          then the volume can only reach <code>1000 IOPS</code>.

          This is because <code>1000 * 256 KiB = 250 MiB</code>.

          {
            props.form.get("parameters.VolumeType")[0] == "gp2" && (
              <>
                <br />
                <br />

                The throughput of GP2 volumes can be calculated with the following math operation
                (it can't exceed <code>250 MiB/s</code>):

                <br />
                <br />

                <code>Throughput in MiB/s = ((Volume size in GiB) × (IOPS per GiB) × (I/O size in KiB))</code>
              </>
            )
          }

          <br />
        </Alert>
      </Col>
    </Row>
  );
}
