import { environment } from "../../environments/environment";

export const MODULE_ROUTE = {
    home: '/home',
    store: '/store',
    store_search: '/store/',
    storelanding: '/storelanding',
    blog: '/blog',
    cart: '/cart',
    postdetails: '/postdetails',
    productdetails: '/productdetails',
    postlist: '/postlist',
    starred: '/starred',
    profile: '/profile'
}

export const FEED_DROP_DOWN_OPTION = ['Hair Stylist', 'Salon', 'Brand', 'All Tags'];
export const FEED_SEARCH_TYPE = ['hair_stylist', 'salon', 'brand', 'all_tags'];

export const FEED_SEARCH_API_URL = {
    // salon: `${environment.apiUrl}users/search_profile?account_type=owner`,
    salon: `${environment.apiUrl}salons/fetch_all`,
    brand: `${environment.apiUrl}users/search_profile?account_type=ambassador`,
    hair_style: `${environment.apiUrl}users/search_profile?account_type=stylist`,
    all_tags: `${environment.apiUrl}posts/search_by_tags_new`,
}

// salon : `${environment.apiUrl}users/search_profile?account_type=owner`,
// http://hairfolio-prod.herokuapp.com/users?account_type=stylist&q=R