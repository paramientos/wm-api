
module.exports.routes = {

  /**
   * @api {get} /partners/distances?distance&unit&order Get nearest partner to given distance
   * @apiName GetPartner Distance
   * @apiGroup Partner
   *
   * @apiParam {Number} distance default is 0
   * @apiParam {String} [unit] Optional.Default value is 'K' which means KM (can be 'K' or 'N')
   * @apiParam {Number} [order] Optional.Default value is 'a' which means ascending order (can be 'a' or 'd')
   *
   * @apiSuccess {PartnerItem} Partner location Json information
   */
  'GET /partners/distances': 'PartnerController.getAllByDistance',

  /**
   * @api {get} /partners/:id Get partner information
   * @apiName GetPartner
   * @apiGroup Partner
   *
   * @apiParam {Number} id Partner unique ID.
   *
   * @apiSuccess {Object} Partner Json information
   */
  'GET /partners/:id': 'PartnerController.get',

};
