/**
 * @file This file defines the configuration of the extension. The configuration
 * here will be used by all content scripts.
 *
 * @author Johnson Zhou (Clumsyndicate)
 */


/**
 * Specifies the backend URL for the Bruin Assistant server.
 *
 * @global
 * @constant {String}
 * @readonly
 */
// const BACKEND_URL = "https://class-planner-assistant-dev.herokuapp.com/";
const BACKEND_URL = "http://molasses.home.kg:65529/";


/**
 * Specifies the QRCode image generator API link for GroupMe QR codes
 *
 * @global
 * @constant {String}
 * @readonly
 */
const QR_API_URL = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=";


/**
 * Specifies the API key used for internal invocations to Google Maps'
 * Distance Matrix API (mimics macro-defined constant).
 *
 * @global
 * @constant {String}
 * @readonly
 * @todo Secure API key in backend.
 * @todo Consider possibly moving this to some extension-wide CONFIG module.
 */
 const MAP_API_KEY = "AIzaSyDW_FKptRQMGtYiQqPPw4s15jkF-YLe2w8";
