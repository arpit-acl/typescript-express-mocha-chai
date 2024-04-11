import { Model } from 'mongoose';
interface aggregationFilter {
  startDate: string;
  endDate: string;
}
class DataBaseFactoryServices {
  modelObj: Model<any>;
  constructor(model: Model<any>) {
    this.modelObj = model;
  }
  /**
   * Find single object from database
   * @param value string value
   * @param field field value
   * @returns object
   */
  async find(value: any, field = '_id', populate = '', lean = false) {
    const query = { [field]: value };
    const findQuery = this.modelObj.findOne(query).populate(populate);
    if (lean) {
      findQuery.lean();
    }
    const data = await findQuery.exec();
    return data;
  }

  async getDetails(
    value: any,
    field = '_id',
    selectString: string,
    model: Model<any>
  ) {
    const userData = await model.findOne(
      {
        [`${field}`]: value,
      },
      selectString
    );
    return userData;
  }
  async getSingleData(
    condition: any,
    populateArray: any,
    selectString: string
  ) {
    const userData = await this.modelObj
      .findOne(condition, selectString)
      .populate(populateArray)
      .lean();
    return userData;
  }
  async getDataFactory(
    condition: any = {},
    limit = 0
    // populateArray: Array<any>,
    // skipLimitObj: string,
    // model: Model<any>
  ) {
    if (limit) {
      return await this.modelObj.find(condition).limit(limit);
    }
    return await this.modelObj.find(condition);
  }
  async insertDataFactory(userData: any) {
    const data = new this.modelObj(userData);
    return await data.save();
  }
  async deleteDataFactory(condition: any) {
    return await this.modelObj.deleteMany(condition);
  }
  async updateDataFactory(
    condition: any,
    updatedData: any,
    populateArray: Array<any>,
    selectString: string,
    upsert = false
  ) {
    return await this.modelObj
      .findOneAndUpdate(condition, updatedData, {
        upsert,
        new: true,
      })
      .populate(populateArray)
      .lean();
  }
  async updateManyDataFactory(
    condition: any,
    updatedData: any,
    oprerationObj = {},
  ) {
    return await this.modelObj.updateMany(
      condition,
      updatedData,
      oprerationObj
    );
  }
  async aggregationQuery(query: Array<any>) {
    const data = await this.modelObj.aggregate(query);
    return data;
  }
  public aggregationSearch = (fieldArray: Array<any>, searchValue: string) => {
    const query = {
      $match: {
        $or: [
          ...fieldArray.map((field) => ({
            [field]: { $regex: searchValue, $options: 'i' },
          })),
        ],
      },
    };
    return query;
  };
  public aggregationFilterDate = (
    queries: aggregationFilter,
    fieldName: string
  ) => {
    const query = {
      $match: {
        [fieldName]: {
          $gte: new Date(queries.startDate),
          $lte: new Date(queries.endDate),
        },
      },
    };
    return query;
  };
  public aggregationSkipLimit = (query: any) => {
    const facetObject = {
      $facet: {
        list: [
          { $skip: (Number(query.page) - 1) * Number(query.limit) || 0 },
          { $limit: Number(query.limit) || 10 },
          { $sort: { createdAt: -1 } },
        ],

        totalItem: [{ $count: 'count' }],
      },
    };
    return facetObject;
  };
  public aggregationMatch = (matchCondition: object) => {
    const matchObj = {
      $match: matchCondition,
    };
    return matchObj;
  };
  public aggregationLookup = (
    from: string,
    letCond: object,
    pipeline: object,
    asString: string,
    preserveNullAndEmptyArrays = true
  ) => {
    const lookupObj = [
      {
        $lookup: {
          from,
          let: letCond,
          pipeline,
          as: asString,
        },
      },
      {
        $unwind: {
          path: `$${asString}`,
          preserveNullAndEmptyArrays,
        },
      },
    ];
    return lookupObj;
  };

  public groupService = (groupObj: object) => {
    const group = [
      {
        $group: groupObj,
      },
    ];

    return group;
  };

  public aggregationGeoNear = (
    long: number,
    lat: number,
    distanceFiled: number
  ) => {
    return {
      $geoNear: {
        near: [long, lat],
        distanceField: distanceFiled,
        spherical: true,
        distanceMultiplier: 6378.1, // convert radians to kilometers
      },
    };
  };
  public aggregationDatatable = (query: any) => {
    const _facet = {
      $facet: {
        list: [
          {
            $skip: Number(query.start) || 0,
          },
          {
            $limit: Number(query.length) || 10,
          },
        ],
        totalRecords: [
          {
            $count: 'count',
          },
        ],
      },
    };
    return _facet;
  };
  public lookupService = (
    from: string,
    localField: string,
    foreignField: string,
    pipeline: any = [],
    asString: string,
    arrayString = 'string',
    preserveNullAndEmptyArrays = true
  ) => {
    const obj = [
      {
        $lookup: {
          from,
          localField,
          foreignField,
          pipeline,
          as: asString,
        },
      },
      {
        $unwind: {
          path: `$${asString}`,
          includeArrayIndex: arrayString,
          preserveNullAndEmptyArrays,
        },
      },
    ];
    return obj;
  };
  public facetService = (facets: any) => {
    return { $facet: facets };
  };
  public skipLimitPagination = (skip = 0, limit = 100) => {
    return {
      $facet: {
        list: [
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ],
        totalCount: [
          {
            $count: 'count',
          },
        ],
      },
    };
  };
  public aggregationProjection = (requiredDataObj: any) => {
    const query = {
      $project: requiredDataObj,
    };
    return query;
  };
  async countDocuments(filter: any = {}) {
    const data = await this.modelObj.countDocuments(filter);
    return data;
  }
  public bulkInsert = async (data: any[]) => {
    try {
      return await this.modelObj.insertMany(data);
    } catch (err) {}
  };

  public sort = (sortType: string, sort: number) => {
    try {
      return {
        $sort: {
          [`${sortType}`]: sort,
        },
      };
    } catch (err) {
    }
  };

  public limit = (limitNumber: number) => {
    return {
      $limit: limitNumber,
    };
  };
  public aggregationGroup = (dataObj: any) => {
    const query = {
      $group: dataObj,
    };
    return query;
  };
  public aggregationUnwind = (field: string) => {
    const query = {
      $unwind: {
        path: `$${field}`,
        includeArrayIndex: `is${field}`,
        preserveNullAndEmptyArrays: true,
      },
    };
    return query;
  };
}
export default DataBaseFactoryServices;
