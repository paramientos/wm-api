declare var sails: any;

interface Number {
  toRadians(): number;
}

// degrees to radians
Number.prototype.toRadians = function (): number {
  return Number(this) * Math.PI / 180;
}


module.exports = {
  sync: true,

  friendlyName: 'Geo',


  description: 'Geo.',


  inputs: {
    lat1: {
      type: 'number',
      required: true
    },

    long1: {
      type: 'number',
      required: true
    },

    lat2: {
      type: 'number',
      required: true
    },

    long2: {
      type: 'number',
      required: true
    },

    unit: {
      type: 'string',
      defaultsTo: 'K'
    }
  },


  exits: {
    success: {
      description: 'All done.',
    },

  },


  fn: function (inputs: any, exits: any) {
    const convertUnit = (unit: any, distance: number): number => {
      interface UnitType {
        [key: string]: number;
      }

      const units: UnitType = {
        'K': (distance * 1.609344),
        'N': (distance * 0.8684),
      };

      if (typeof units[unit] === 'undefined') {
        return units[unit];
      }

      return distance;
    };

    // https://www.codegrepper.com/code-examples/javascript/haversine+formula+javascript
    function haversine(lat1: number, lon1: number, lat2: number, lon2: number, unit: string): number {
      const dLat: number = (lat2 - lat1).toRadians();
      const dLon: number = (lon2 - lon1).toRadians();
      lat1 = (lat1).toRadians();
      lat2 = (lat2).toRadians();

      const a: number = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
      const R: number = convertUnit(unit, 6371); // the radius of the world
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return convertUnit(unit,  R * c);
    }

    let result: number = haversine(inputs.lat1, inputs.long1, inputs.lat2, inputs.long2, inputs.unit)

    return exits.success(result);
  },


};

