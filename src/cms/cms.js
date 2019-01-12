import CMS from 'netlify-cms'

import AboutPagePreview from './preview-templates/AboutPagePreview'
import NewsPostPreview from './preview-templates/NewsPostPreview'
import ProductPagePreview from './preview-templates/ProductPagePreview'

CMS.registerPreviewTemplate('about', AboutPagePreview)
CMS.registerPreviewTemplate('products', ProductPagePreview)
CMS.registerPreviewTemplate('news', NewsPostPreview)
