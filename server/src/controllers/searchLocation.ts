import { PrismaRead } from "../services/prisma_client"
import { PrismaClient,Prisma} from '@prisma/client';
const prisma = new PrismaClient();
import { LocationData } from "../utils/types"
export const searchLocation = async (req: any, res: any) => {
    try {
        let {address, latitude, longitude, limit, page } = req.query;
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);

        const search_keyword = address ? [...address?.toLowerCase().split(" ")] : []
        const whereClauses = search_keyword.length ? `where
                  (ci.name ILIKE '%' || '${address}' || '%' OR
                  ct.name ILIKE '%' ||  '${address}' || '%' )` : ""
        console.log(address,latitude,longitude)
        const locations: [LocationData] = await PrismaRead.$queryRaw`
              SELECT
              lo.id,
              lo.street,
              lo.zip_code,
              lo.latitude,
              lo.longitude,
              ci.name as city,
              ct.name as county,
              ctr.name as country,
              tz.name as timezone,
              CASE
                  WHEN ABS(lo.latitude - ${latitude}) <= 2  AND ABS(lo.longitude - (${longitude})) <= 2 THEN   1
                  WHEN ABS(lo.latitude - ${latitude}) <= 3  AND ABS(lo.longitude - (${longitude})) <= 3 THEN   0.9
                  WHEN ABS(lo.latitude - ${latitude}) <= 4  AND ABS(lo.longitude - (${longitude})) <= 4 THEN   0.8
                  WHEN ABS(lo.latitude - ${latitude}) <= 5  AND ABS(lo.longitude - (${longitude})) <= 5 THEN   0.7
                  WHEN ABS(lo.latitude - ${latitude}) <= 7  AND ABS(lo.longitude -(${longitude}))  <= 7 THEN   0.6
                  WHEN ABS(lo.latitude - ${latitude}) <= 8  AND ABS(lo.longitude - (${longitude})) <= 8 THEN   0.5
                  WHEN ABS(lo.latitude - ${latitude}) <= 9  AND ABS(lo.longitude - (${longitude})) <= 9 THEN   0.4
                  WHEN ABS(lo.latitude - ${latitude}) <= 10 AND ABS(lo.longitude -(${longitude}))  <= 10 THEN  0.3
                  WHEN ABS(lo.latitude - ${latitude}) <= 15 AND ABS(lo.longitude - (${longitude})) <= 15 THEN  0.2
                  WHEN ABS(lo.latitude - ${latitude}) <= 20 AND ABS(lo.longitude -(${longitude}))  <= 20 THEN  0.1
                  ELSE 0
              END AS score
              FROM locations lo
                  left join cities ci on (ci.id = lo.city_id)
                  left join counties ct on (ct.id = lo.county_id)
                  left join countries ctr on (ctr.id = lo.country_id)
                  left join timezones tz on (tz.id = lo.timezone_id)
              ${Prisma.raw(whereClauses)}
              Order By score desc
        `
      console.log("whereClauses",whereClauses)
      const calculated_locations = locations?.map((location) =>{
         let location_keywords =[...location?.city?.toLowerCase()?.split(" "), ...location?.county?.toLowerCase()?.split(" ")]
         let name_score:number = location_keywords.reduce((count, keyword)=> (
             count += search_keyword.includes(keyword) ? 0.1 : 0
         ), 0 )
         location.score = Math.round((Number(location.score ?? 0) + Number(name_score)) * 100) / 100;
         if(location.score > 1){
            location.score = 1
         }
         return location
      })
      if(page <= 0) page = 1
      if(limit <= 0) limit = 1
      let cur:number = parseInt(page) ?? 1
      let skip:number = parseInt(limit) ?? 10
      let start:number = (cur - 1) * skip;
      let end:number = start + skip;

      res.status(201).json({
        locations: calculated_locations.slice(start, end),
        total: calculated_locations.length,
        cur,
        totalPages: Math.ceil(calculated_locations.length / skip)
      });
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: "Something wrong" });
    }
  }
