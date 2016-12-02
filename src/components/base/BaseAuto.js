import UploadComponent from './BaseUpload'
import api from '../../middleware/api'

export default class BaseAutoComponent extends UploadComponent {
  constructor(props) {
    super(props);
    [
      'handleBrandSelect',
      'handleSeriesSelect',
      'handleTypeSelect'
    ].map(method => this[method] = this[method].bind(this));
  }

  handleBrandSelect(brandId) {
    this.getAutoSeries(brandId);
    this.resetSeriesSelect();
    this.resetTypesSelect();
    this.concatName('brands', brandId);
  }

  handleSeriesSelect(seriesId) {
    this.getAutoTypes(seriesId);
    this.resetTypesSelect();
    this.concatName('series', seriesId);
  }

  handleTypeSelect(typeId) {
    this.concatName('types', typeId);
  }

  resetSeriesSelect() {
    this.props.form.setFieldsValue({auto_series_id: '不限'})
    let arrNameProp = 'series_name';
    this.setState({[arrNameProp]: ''});
  }

  resetTypesSelect() {
    this.props.form.setFieldsValue({auto_type_id: '不限'})
    let arrNameProp = 'types_name';
    this.setState({[arrNameProp]: ''});
  }

  concatName(arrName, id) {
    let arr = this.state[arrName];
    let arrNameProp = arrName + '_name';
    if (arr.length > 0) {
      for (let item of arr) {
        if (Number(item._id) === Number(id)) {
          this.setState({[arrNameProp]: item.name || item.year + ' ' + item.version});
          break;
        }
      }
    }
  }

  getAutoBrands() {
    api.ajax({url: api.getAutoBrands()}, function (data) {
      this.setState({brands: data.res.auto_brand_list})
    }.bind(this))
  }

  getAutoSeries(brandId) {
    api.ajax({url: api.getAutoSeriesByBrand(brandId)}, function (data) {
      this.setState({series: data.res.series});
    }.bind(this))
  }

  getAutoTypes(seriesId) {
    api.ajax({url: api.getAutoTypesBySeries(seriesId)}, function (data) {
      let types = data.res.type, fistItem = types[0];
      this.setState({
        types: types,
        auto_factory_id: fistItem.auto_factory_id
      });
      this.getOutColors(seriesId);
    }.bind(this));
  }

  getOutColors(seriesId) {
    api.ajax({url: api.getAutoOutColorBySeries(seriesId)}, function (data) {
      this.setState({outColor: data.res.out_colors});
    }.bind(this))
  }
}
