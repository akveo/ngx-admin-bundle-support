/*
* Copyright (c) Akveo 2019. All Rights Reserved.
* Licensed under the Personal / Commercial License.
* See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
*/

using Common.Entities;
using Common.Entities.Statistics;
using ECommerce.Entities;
using ECommerce.Services.Infrastructure;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.EntityFramework
{
    public class TrafficAggregatedRepository : ITrafficAggregatedRepository
    {
        public Task<IEnumerable<AggregatedData>> GetDataByPeriod(DateTime start, DateTime end,
            Expression<Func<Traffic, AggregatedData>> groupDataSelector, ContextSession session)
        {
            return GetData(
                obj => obj.Date >= start && obj.Date <= end,
                groupDataSelector,
                group => new AggregatedData { Group = group.Key, Sum = group.Sum(x => x.Sum) },
                session);
        }

        private ECommerceDataContext GetContext(ContextSession session)
        {
            return new ECommerceDataContext(session);
        }

        private async Task<IEnumerable<AggregatedData>> GetData(
            Expression<Func<Traffic, bool>> filter,
            Expression<Func<Traffic, AggregatedData>> groupDataSelector,
            Expression<Func<IGrouping<int, AggregatedData>, AggregatedData>> groupExpression,
            ContextSession session)
        {
            using (var context = GetContext(session))
            {
                var query = context.Traffic
                    .AsNoTracking()
                    .Where(filter)
                    .Select(groupDataSelector)
                    .GroupBy(obj => obj.Group)
                    .Select(groupExpression);

                return await query.ToListAsync();
            }
        }
    }
}
