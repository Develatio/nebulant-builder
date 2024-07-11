export const LabelSelectorTooltip = () => {
  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Expression</th>
            <th>Meaning</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <code>k==v</code> / <code>k=v</code>
            </td>
            <td>
              Value of label <code>k</code> equals value <code>v</code>
            </td>
          </tr>

          <tr>
            <td>
              <code>k!=v</code>
            </td>
            <td>
              Value of label <code>k</code> does not equal value <code>v</code>
            </td>
          </tr>

          <tr>
            <td>
              <code>k</code>
            </td>
            <td>
            Label <code>k</code> is present
            </td>
          </tr>

          <tr>
            <td>
              <code>!k</code>
            </td>
            <td>
              Label <code>k</code> is not present
            </td>
          </tr>

          <tr>
            <td>
              <code>k in (v1,v2,v3)</code>
            </td>
            <td>
              Value of label <code>k</code> equals any of the values <code>v1</code>, <code>v2</code> or <code>v3</code>
            </td>
          </tr>

          <tr>
            <td>
              <code>k notin (v1,v2,v3)</code>
            </td>
            <td>
              Value of label <code>k</code> is neither <code>v1</code>, <code>v2</code> or <code>v3</code>
            </td>
          </tr>

          <tr>
            <td>
              <code>k==v,!k2</code>
            </td>
            <td>
              Value of label <code>k</code> equals value <code>v</code> and label <code>k2</code> is not present
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
