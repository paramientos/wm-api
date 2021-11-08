import fs from "fs";

declare var sails: any;
import e = require('express');

interface PartnerItem {
  id: number,
  name: string,
  lat: number,
  long: number,
  location: string,
  address: string,
  website: string,
  officeCount: number
}

interface Coordinate {
  lat: number,
  long: number
}

interface Office {
  location: string,
  address: string,
  coordinates: string,
  coordinate: Coordinate
}

interface Partner {
  id: number,
  urlName: string,
  organization: string,
  customerLocations: string,
  willWorkRemotely: boolean,
  website: string,
  services: string,
  offices: Array<Office>
}

export function get(req: e.Request, res: e.Response, next: Function): e.Response {
  const id: number = Number(req.params.id);

  const result = getPartners().filter((partner: Partner) => {
    return partner.id === id;
  });

  return res.json(result[0]);
}

export function getPartners(): Array<Partner> {
  return JSON.parse(fs.readFileSync(sails.config.custom.partnersFileLocation, {
    encoding: 'utf8',
    flag: 'r'
  }));
}

export function isWithinRange(partnerDistance: number, givenDistance: number) {
  return givenDistance > partnerDistance;
}

export function getAllByDistance(req: e.Request, res: e.Response, next: Function): any {
  const requestedDistance: number = Number(req.query.distance);
  const unit: string = String(req.query.unit || 'K');
  const sortingType: string = String(req.query.sorting || 'a')

  const result: Array<PartnerItem> = [];

  let cp: Array<number> = sails.config.custom.centerPoint;
  let centerPoint: Coordinate = {
    lat: cp[0],
    long: cp[1]
  };

  const partners: Array<Partner> = getPartners();

  partners.map((partner: Partner) => {
    partner.offices.map((office: Office) => {
      let coordinate: string[] = office.coordinates.split(',');

      office.coordinate = {
        lat: +coordinate[0],
        long: +coordinate[1]
      };

      const partnerDistance = sails.helpers.geo.with({
        lat1: centerPoint.lat,
        long1: centerPoint.long,
        lat2: office.coordinate.lat,
        long2: office.coordinate.long,
        unit: unit
      });

      if (isWithinRange(partnerDistance, requestedDistance)) {
        result.push({
          id: partner.id,
          lat: office.coordinate.lat,
          long: office.coordinate.long,
          address: office.address,
          name: partner.organization,
          location: office.location,
          officeCount: partner.offices.length,
          website: partner.website,

        });
      }
    });
  });

  sails.helpers.sort.with({
    data: result,
    key: 'name',
    type: sortingType
  });

  return res.json(result);
}
