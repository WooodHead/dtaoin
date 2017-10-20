const StoreController = {
  renderFirstValidStore(stores) {
    if (stores && stores.length > 0) {
      let firstStore = stores[0];
      $('#stores_container').empty().append(
        `<div class="container-item">
            <h3 class="item-title">${firstStore.company_name}</h3>
            <div class="item-desc-wrapper">
              <span class="icon-location"></span>
              <p class="item-desc">${firstStore.company_address}</p>
            </div>
            <a href="tel:${firstStore.company_hotline_phone}" class="right-call">
              <img src="./img/info_store_call_h5.png" class="icon-call" alt="call">
            </a>
          </div>`);

      // 当只有一个门店时，不显示更多门店
      if (stores.length < 2) {
        $('.-store-container-footer').text(' ');
      }
    }
  },

  renderMoreValidStores(stores) {
    let storeHtmls = [];
    if (stores && stores.length > 0) {
      stores.map(item => {
        storeHtmls.push(
          `<div class="store-item">
            <h3 class="item-title">${item.company_name}</h3>
            <div class="item-desc-wrapper">
              <span class="icon-list-location"></span>
              <p class="item-desc">${item.company_address}</p>
            </div>
            <a href="tel:${item.company_hotline_phone}" class="right-call">
              <img src="./img/list_store_icon_call.png" class="icon-call" alt="call">
            </a>
          </div>`);
      });

      $('#more_store_list').empty().append(storeHtmls);
    }
  },
};

$(function() {
  let stores = JSON.parse(sessionStorage.getItem('stores'));
  StoreController.renderMoreValidStores(stores ? stores : []);
});
