import UploadComponent from './BaseUpload';
import api from '../../middleware/api';

export default class BaseAutoComponent extends UploadComponent {
  constructor(props) {
    super(props);
    [
      'handleBrandSelect',
      'handleSeriesSelect',
      'handleTypeSelect',
    ].map(method => this[method] = this[method].bind(this));
  }

  handleBrandSelect(brandId) {
    this.getAutoSeries(brandId);
    this.resetSeriesSelect();
    this.resetTypesSelect();
    this.concatName('brands', brandId);
    this.setState({
      autoTypeNameDisable: false,
    });
  }

  handleSeriesSelect(seriesId) {
    this.getAutoTypes(seriesId);
    this.resetTypesSelect();
    this.concatName('series', seriesId);
    this.setState({
      autoTypeNameDisable: false,
    });
  }

  handleTypeSelect(typeId) {
    if (Number(typeId) > 0) {
      this.props.form.setFieldsValue({ auto_type_name: '' });
      this.setState({
        autoTypeNameDisable: true,
      });
    } else {
      this.setState({
        autoTypeNameDisable: false,
      });
    }
    this.concatName('types', typeId);
  }

  resetSeriesSelect() {
    this.props.form.setFieldsValue({ auto_series_id: '不限' });
    const arrNameProp = 'series_name';
    this.setState({ [arrNameProp]: ' ' });
  }

  resetTypesSelect() {
    this.props.form.setFieldsValue({ auto_type_id: '不限' });
    const arrNameProp = 'types_name';
    this.setState({ [arrNameProp]: ' ' });
  }


  concatName(arrName, id) {
    const arr = this.state[arrName];
    const arrNameProp = `${arrName  }_name`;
    if (arr.length > 0) {
      for (const item of arr) {
        if (Number(item._id) === Number(id)) {
          this.setState({ [arrNameProp]: item.name || `${item.year  } ${  item.version}` });
          break;
        }
      }
    }
  }

  getAutoBrands() {
    api.ajax({ url: api.auto.getBrands() }, data => {
      this.setState({ brands: data.res.auto_brand_list });
    });
  }

  getAutoSeries(brandId) {
    api.ajax({ url: api.auto.getSeriesByBrand(brandId) }, data => {
      this.setState({ series: data.res.series });
    });
  }

  getAutoTypes(seriesId) {
    api.ajax({ url: api.auto.getTypesBySeries(seriesId) }, data => {
      let types = data.res.type, fistItem = types[0];
      this.setState({
        types,
        auto_factory_id: fistItem ? fistItem.auto_factory_id : 0,
      });
      this.getOutColors(seriesId);
    });
  }

  getOutColors(seriesId) {
    api.ajax({ url: api.auto.getOutColorBySeries(seriesId) }, data => {
      this.setState({ outColor: data.res.out_colors });
    });
  }
}
