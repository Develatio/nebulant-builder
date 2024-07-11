export const InstanceTypeExplanation = () => {
  return (
    <table>
      <tbody>
        <tr>
          <td className="align-text-top text-start fw-bold pe-2 pb-1">A</td>
          <td className="align-text-top">ARM based instances</td>
        </tr>
        <tr>
          <td className="align-text-top text-start fw-bold pe-2 pb-1">C, H</td>
          <td className="align-text-top">Compute oriented</td>
        </tr>
        <tr>
          <td className="align-text-top text-start fw-bold pe-2 pb-1">F</td>
          <td className="align-text-top">FPGA</td>
        </tr>
        <tr>
          <td className="align-text-top text-start fw-bold pe-2 pb-1">G, P, V</td>
          <td className="align-text-top">GPU</td>
        </tr>
        <tr>
          <td className="align-text-top text-start fw-bold pe-2 pb-1">I, D</td>
          <td className="align-text-top">Storage oriented</td>
        </tr>
        <tr>
          <td className="align-text-top text-start fw-bold pe-2 pb-1">M</td>
          <td className="align-text-top">General purpose</td>
        </tr>
        <tr>
          <td className="align-text-top text-start fw-bold pe-2 pb-1">R, X</td>
          <td className="align-text-top">Memory oriented</td>
        </tr>
        <tr>
          <td className="align-text-top text-start fw-bold pe-2 pb-1">T</td>
          <td className="align-text-top">Cheap general purpose</td>
        </tr>
        <tr>
          <td className="align-text-top text-start fw-bold pe-2 pb-1">U</td>
          <td className="align-text-top">Bare metal</td>
        </tr>
        <tr>
          <td className="align-text-top text-start fw-bold pe-2">Z</td>
          <td className="align-text-top">Compute and memory oriented</td>
        </tr>
      </tbody>
    </table>
  );
}
