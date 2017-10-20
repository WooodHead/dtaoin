import brandInfoData from './brand.info.js';

const BrandInfo = {
  brand_name: '水稻汽车',
  brand_logo: 'brand.logo.png',
};

Object.assign(BrandInfo, brandInfoData);

document.title = BrandInfo.brand_name;

export default BrandInfo;
