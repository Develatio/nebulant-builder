import MarketplaceIcon from "@src/assets/img/icons/control/marketplace.svg?transform";

export const MarketCTA = () => {
  return (
    <div className="sidebarright_marketcta">
      <span className="title">Need <span className="title_highlight">inspiration</span>?</span>
      <span className="description">Go to our <span className="description_highlight">marketplace</span> and check what other users created</span>
      <div className="button border rounded mt-3">

        <div className="icon"><MarketplaceIcon /></div>
        <a href={process.env.MARKETPLACE_ENDPOINT} target="_blank">Go to Marketplace</a>
      </div>
    </div>
  );
}
