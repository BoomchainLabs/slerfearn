"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_instrument_sentry_server_config_ts";
exports.ids = ["_instrument_sentry_server_config_ts"];
exports.modules = {

/***/ "(instrument)/./sentry.server.config.ts":
/*!*********************************!*\
  !*** ./sentry.server.config.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/nextjs */ \"(instrument)/./node_modules/@sentry/nextjs/build/cjs/index.server.js\");\n/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sentry_nextjs__WEBPACK_IMPORTED_MODULE_0__);\n// This file configures the initialization of Sentry on the server.\n// The config you add here will be used whenever the server handles a request.\n// https://docs.sentry.io/platforms/javascript/guides/nextjs/\n\n_sentry_nextjs__WEBPACK_IMPORTED_MODULE_0__.init({\n    dsn: \"https://51a547c3fbe3dd08c9f33c2cc96a3c78@o4509250546696192.ingest.de.sentry.io/4509830128336976\",\n    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.\n    tracesSampleRate: 1,\n    // Enable logs to be sent to Sentry\n    enableLogs: true,\n    // Setting this option to true will print useful information to the console while you're setting up Sentry.\n    debug: false\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGluc3RydW1lbnQpLy4vc2VudHJ5LnNlcnZlci5jb25maWcudHMiLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUVBQW1FO0FBQ25FLDhFQUE4RTtBQUM5RSw2REFBNkQ7QUFFcEI7QUFFekNBLGdEQUFXLENBQUM7SUFDVkUsS0FBSztJQUVMLG1IQUFtSDtJQUNuSEMsa0JBQWtCO0lBRWxCLG1DQUFtQztJQUNuQ0MsWUFBWTtJQUVaLDJHQUEyRztJQUMzR0MsT0FBTztBQUNUIiwic291cmNlcyI6WyIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL3NlbnRyeS5zZXJ2ZXIuY29uZmlnLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoaXMgZmlsZSBjb25maWd1cmVzIHRoZSBpbml0aWFsaXphdGlvbiBvZiBTZW50cnkgb24gdGhlIHNlcnZlci5cbi8vIFRoZSBjb25maWcgeW91IGFkZCBoZXJlIHdpbGwgYmUgdXNlZCB3aGVuZXZlciB0aGUgc2VydmVyIGhhbmRsZXMgYSByZXF1ZXN0LlxuLy8gaHR0cHM6Ly9kb2NzLnNlbnRyeS5pby9wbGF0Zm9ybXMvamF2YXNjcmlwdC9ndWlkZXMvbmV4dGpzL1xuXG5pbXBvcnQgKiBhcyBTZW50cnkgZnJvbSBcIkBzZW50cnkvbmV4dGpzXCI7XG5cblNlbnRyeS5pbml0KHtcbiAgZHNuOiBcImh0dHBzOi8vNTFhNTQ3YzNmYmUzZGQwOGM5ZjMzYzJjYzk2YTNjNzhAbzQ1MDkyNTA1NDY2OTYxOTIuaW5nZXN0LmRlLnNlbnRyeS5pby80NTA5ODMwMTI4MzM2OTc2XCIsXG5cbiAgLy8gRGVmaW5lIGhvdyBsaWtlbHkgdHJhY2VzIGFyZSBzYW1wbGVkLiBBZGp1c3QgdGhpcyB2YWx1ZSBpbiBwcm9kdWN0aW9uLCBvciB1c2UgdHJhY2VzU2FtcGxlciBmb3IgZ3JlYXRlciBjb250cm9sLlxuICB0cmFjZXNTYW1wbGVSYXRlOiAxLFxuXG4gIC8vIEVuYWJsZSBsb2dzIHRvIGJlIHNlbnQgdG8gU2VudHJ5XG4gIGVuYWJsZUxvZ3M6IHRydWUsXG5cbiAgLy8gU2V0dGluZyB0aGlzIG9wdGlvbiB0byB0cnVlIHdpbGwgcHJpbnQgdXNlZnVsIGluZm9ybWF0aW9uIHRvIHRoZSBjb25zb2xlIHdoaWxlIHlvdSdyZSBzZXR0aW5nIHVwIFNlbnRyeS5cbiAgZGVidWc6IGZhbHNlLFxufSk7XG4iXSwibmFtZXMiOlsiU2VudHJ5IiwiaW5pdCIsImRzbiIsInRyYWNlc1NhbXBsZVJhdGUiLCJlbmFibGVMb2dzIiwiZGVidWciXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(instrument)/./sentry.server.config.ts\n");

/***/ })

};
;