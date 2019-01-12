import CMS from 'netlify-cms'

import GeneralPagePreview from './preview-templates/GeneralPagePreview'
import NewsPostPreview from './preview-templates/NewsPostPreview'
import ProductPagePreview from './preview-templates/ProductPagePreview'

CMS.registerPreviewTemplate('about', GeneralPagePreview)
CMS.registerPreviewTemplate('products', ProductPagePreview)
CMS.registerPreviewTemplate('news', NewsPostPreview)
