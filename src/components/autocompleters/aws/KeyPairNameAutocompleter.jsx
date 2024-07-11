import { KeyPairAutocompleter } from "./KeyPairAutocompleter";

export class KeyPairNameAutocompleter extends KeyPairAutocompleter {
  // This method will process the received data
  process() {
    const keyPairsData = this.getResultOfNode(this.keyPairsNode.id);

    const dataset = keyPairsData.KeyPairs || [];

    const data = dataset.map(keypair => {
      return {
        type: "value",
        label: this._createLabel(keypair),
        value: `${keypair.KeyName}`,
      }
    });

    return {
      data: data,
      total: data.length, // TODO <-- fix this
    };
  }
}
