import CMS from 'netlify-cms'

import GeneralPagePreview from './preview-templates/GeneralPagePreview'
import NewsPostPreview from './preview-templates/NewsPostPreview'

CMS.registerPreviewTemplate('news', NewsPostPreview)

const generalPages = ['about', 'home', 'sponsorship'];

generalPages.forEach(function (page) {
    CMS.registerPreviewTemplate(page, GeneralPagePreview);
});