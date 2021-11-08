declare var sails: any;

module.exports = {
  sync: true,
  friendlyName: 'Sort',
  description: 'Sort',

  inputs: {
    data: {
      type: 'ref',
      required: true
    },

    key: {
      type: 'string',
      required: true
    },

    type: {
      type: 'string',
      required: false,
      defaultsTo: 'a' // Means ascending order
    }
  },


  exits: {
    success: {
      description: 'All done.',
    },
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: function (inputs: any, exits: any) {
    const types: string[] = ['a', 'd'];
    const type: string = inputs.type;

    if (!types.includes(type)) {
      return exits.notFound(`WashMen Message: Sorting type '${type}' not found! Types can be ${types.join(',')}`);
    }

    const data: any[] = inputs.data;
    const key: string = inputs.key;
    let val: number = 1;

    if (type === 'd') {
      val = -1;
    }

    const result = data.sort((a: any, b: any) => (a[key] > b[key] ? val : -val));
    return exits.success(result);
  },


};

