// product schema

const mongoose = require('mongoose');
let Schema = mongoose.Schema;
// fix deprecation warning on utilizing save by specifiying native promises
mongoose.Promise = global.Promise;
const db = require('./index');

const productCatalogSchema = Schema({
  site_id: String,
  md5: String,
  url: String,
  title: String,
  price: String,
  original_price: String,
  description: String,
  image: String,
  alt_images: Array,
  categories: Array,
  category_attributes: Array,
  site_categories: Array,
  weight: String,
  required_field_values: { type: {
    color: [{ type: {
      alt_images: Array,
      extra_info: String,
      image: String,
      price: String,
      text: String,
      value: String,
      weight: String
    }}]

  }},
  required_field_names: Array,
  updated_at: String,
  source: String
});

const productCatalog = mongoose.model('ProductCatalog', productCatalogSchema)

module.exports = productCatalog;
